import { expect, test, type WebSocketRoute } from '@playwright/test';

const password = process.env.BLITZ_API_PASSWORD;

// Authentication data must not be retained in browser traces or screenshots.
test.use({ trace: 'off', screenshot: 'off', video: 'off' });

test.describe('live Blitz API', () => {
  test.skip(!process.env.BACKEND_SERVER || !password, 'Set BACKEND_SERVER and BLITZ_API_PASSWORD');

  test('authenticates, renders snapshots, reconnects, and logs out on invalid auth', async ({ page }) => {
    test.setTimeout(90000);
    if (!password) throw new Error('Missing BLITZ_API_PASSWORD');
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const connections: { page: WebSocketRoute; server: WebSocketRoute; events: Set<string> }[] = [];
    let rejectedCode: number | undefined;
    let invalidateNextAuth = false;
    await page.routeWebSocket('**/api/ws', ws => {
      const server = ws.connectToServer();
      const connection = { page: ws, server, events: new Set<string>() };
      connections.push(connection);
      ws.onMessage(raw => {
        const frame = JSON.parse(String(raw));
        // Assert only the shape so credentials cannot appear in test output.
        expect(frame.type === 'auth' && typeof frame.token === 'string').toBe(true);
        server.send(invalidateNextAuth ? JSON.stringify({ type: 'auth', token: 'invalid-token' }) : raw);
      });
      server.onMessage(raw => {
        const frame = JSON.parse(String(raw));
        if (typeof frame.event === 'string' && !frame.data?.error) connection.events.add(frame.event);
        ws.send(raw);
      });
      server.onClose((code, reason) => {
        rejectedCode = code;
        void ws.close({ code, reason });
      });
    });

    await page.goto('/');
    await page.getByPlaceholder('Password A').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/home$/, { timeout: 30000 });
    const requiredEvents = ['system_startup_info', 'system_info', 'btc_info', 'hardware_info'];
    await expect.poll(() => requiredEvents.every(event => connections.at(-1)?.events.has(event)), {
      timeout: 30000,
    }).toBe(true);
    await expect(page.getByRole('heading', { name: 'Bitcoin', exact: true })).toBeVisible();

    // Force a dropped connection without interrupting the node or changing its data.
    const active = connections.at(-1);
    if (!active) throw new Error('No active WebSocket');
    const before = connections.length;
    await active.page.close({ code: 1012 });
    await active.server.close();
    await expect.poll(() => connections.length).toBeGreaterThan(before);
    await expect.poll(() => requiredEvents.every(event => connections.at(-1)?.events.has(event)), {
      timeout: 30000,
    }).toBe(true);
    await expect(page.getByRole('heading', { name: 'Bitcoin', exact: true })).toBeVisible();

    // The API, rather than a mock, must reject the next handshake with 4401.
    invalidateNextAuth = true;
    const reconnected = connections.at(-1);
    if (!reconnected) throw new Error('No reconnected WebSocket');
    await reconnected.page.close({ code: 1012 });
    await reconnected.server.close();
    await expect.poll(() => rejectedCode).toBe(4401);
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('access_token') === null)).toBe(true);
    expect(errors).toEqual([]);
  });
});
