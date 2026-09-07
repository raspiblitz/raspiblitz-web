import { readFile } from 'node:fs/promises';
import { expect, test, type WebSocketRoute } from '@playwright/test';
import { isRecord } from '../src/utils/guards';

// These tests share the mock's app/wallet state and broadcast stream.
test.describe.configure({ mode: 'serial' });

// No request or WebSocket interception: exercise browser -> Vite -> backend-mock.
test('renders mock snapshots and wallet state updates over a native WebSocket', async ({ page }) => {
  const events = new Set<string>();
  const lightningStates: string[] = [];
  const errors: string[] = [];
  let authenticatedConnections = 0;
  page.on('pageerror', error => errors.push(error.message));
  page.on('websocket', socket => {
    if (!socket.url().endsWith('/api/ws')) return;
    socket.on('framesent', ({ payload }) => {
      const frame: unknown = JSON.parse(String(payload));
      if (isRecord(frame) && frame.type === 'auth') authenticatedConnections++;
    });
    socket.on('framereceived', ({ payload }) => {
      const frame: unknown = JSON.parse(String(payload));
      if (!isRecord(frame) || typeof frame.event !== 'string') return;
      events.add(frame.event);
      if (frame.event === 'system_startup_info' && isRecord(frame.data)
        && typeof frame.data.lightning === 'string') lightningStates.push(frame.data.lightning);
    });
  });

  await page.goto('/');
  await page.getByPlaceholder('Password A').fill('password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL('/home');
  const unlock = page.getByRole('dialog');
  await expect(unlock).toBeVisible();
  await unlock.getByPlaceholder('Password C').fill('password');
  await unlock.getByRole('button', { name: 'Unlock', exact: true }).click();
  await expect(unlock).toBeHidden();
  await expect.poll(() => lightningStates).toEqual(['locked', 'bootstrapping_after_unlock', 'done']);

  await expect(page.getByRole('heading', { name: 'Bitcoin', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'RAM Usage', exact: true })).toBeVisible();
  await expect(page.locator('header')).toContainText('myBlitz');
  await expect(page.getByText('regtest', { exact: true })).toBeVisible();
  await expect(page.getByText('0.21.1', { exact: true })).toBeVisible();
  expect([...events].sort()).toEqual([
    'app_state_update_message', 'btc_info', 'hardware_info', 'ln_info',
    'system_info', 'system_startup_info', 'wallet_balance',
  ]);
  await expect(page.getByText('883,313 SAT', { exact: true })).toBeVisible();
  await expect(page.getByText('Lightning wallet locked', { exact: true })).toBeHidden();
  expect(authenticatedConnections).toBe(1);
  expect(errors).toEqual([]);
});

// Real browser HTTP and WebSocket traffic through Vite to backend-mock.
test('installation failure, log export, retry and uninstall use the backend lifecycle', async ({ page }) => {
  const errors: string[] = [];
  const states: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('websocket', socket => {
    socket.on('framereceived', ({ payload }) => {
      const frame = JSON.parse(String(payload));
      if (frame.event === 'app_manage_message' && frame.data.id === 'mempool') states.push(frame.data.state);
    });
  });
  await page.goto('/');
  await page.getByPlaceholder('Password A').fill('password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL('/home');
  const unlock = page.getByRole('dialog');
  await unlock.getByPlaceholder('Password C').fill('password');
  await unlock.getByRole('button', { name: 'Unlock', exact: true }).click();
  await expect(unlock).toBeHidden();
  await page.goto('/apps');
  const card = page.getByRole('article').filter({ has: page.getByRole('heading', { name: 'Mempool.space', exact: true }) });
  await card.getByRole('button', { name: 'Install', exact: true }).click();
  await expect(card.getByRole('button', { name: 'Installing', exact: true })).toBeDisabled();
  await expect(page.getByText('Failed', { exact: true })).toBeVisible();
  await expect(page.getByText(/Mock disk full/)).toBeVisible();
  await expect(card.getByRole('button', { name: 'Install', exact: true })).toBeEnabled();
  expect(states).toEqual(['initiated', 'running', 'failure', 'finished']);

  await page.getByRole('button', { name: 'View Full Log' }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Log' }).click();
  const download = await downloadEvent;
  const path = await download.path();
  if (!path) throw new Error('Missing log download');
  const log = await readFile(path, 'utf8');
  expect(log).toContain('[FAILURE] Mock disk full');
  expect(log).toContain('Not enough space for installation');
  const timestamp = log.match(/^(\d{4}-\d{2}-\d{2}T\S+) \[FAILURE\]/m)?.[1];
  if (!timestamp) throw new Error("Missing UTC timestamp");
  expect(Math.abs(Date.now() - Date.parse(timestamp))).toBeLessThan(60000);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Download Log' })).toBeHidden();

  await card.getByRole('button', { name: 'Install', exact: true }).click();
  await expect(page.getByText('Completed', { exact: true })).toBeVisible();
  await expect(page.getByText(/Mock disk full/)).toBeHidden();
  expect(states.slice(4)).toEqual(['initiated', 'running', 'success', 'finished']);
  // Reconnect warmup must retain the mock's installed state.
  await page.reload();
  await expect(card.getByRole('button', { name: 'Install', exact: true })).toBeHidden();
  await card.getByRole('button', { name: 'Info', exact: true }).click();
  await page.getByRole('button', { name: 'Uninstall', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Uninstalling', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Install', exact: true })).toBeEnabled();
  expect(states.slice(8)).toEqual(['initiated', 'running', 'success', 'finished']);
  expect(errors).toEqual([]);
});

type Connection = { opened: number; closed?: number; ready?: number; browser: WebSocketRoute; server: WebSocketRoute };

function retryDelay(next: Connection, previous: Connection): number {
  if (previous.closed === undefined) throw new Error('Expected the previous socket to be closed');
  return next.opened - previous.closed;
}

test('backs off after authenticated short-lived mock connections and resets after stability', async ({ page }) => {
  test.setTimeout(45000);
  const connections: Connection[] = [];
  // Forward real mock traffic, injecting only transport disconnects.
  await page.routeWebSocket('**/api/ws', browser => {
    const server = browser.connectToServer();
    const connection: Connection = { opened: Date.now(), browser, server };
    // StrictMode also creates a trial socket that is closed before authentication.
    browser.onMessage(raw => {
      if (JSON.parse(String(raw)).type === 'auth' && !connections.includes(connection)) {
        connection.opened = Date.now();
        connections.push(connection);
      }
      server.send(raw);
    });
    server.onMessage(raw => {
      browser.send(raw);
      const frame = JSON.parse(String(raw));
      if (frame.event !== 'btc_info' || connection.ready !== undefined) return;
      connection.ready = Date.now();
      if (connections.length <= 2) {
        connection.closed = Date.now();
        void browser.close({ code: 1012 });
        void server.close();
      }
    });
    server.onClose((code, reason) => { void browser.close({ code, reason }); });
  });
  await page.goto('/');
  await page.getByPlaceholder('Password A').fill('password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect.poll(() => connections.length).toBe(3);
  const firstDelay = retryDelay(connections[1], connections[0]);
  const secondDelay = retryDelay(connections[2], connections[1]);
  expect(firstDelay).toBeGreaterThanOrEqual(450);
  expect(firstDelay).toBeLessThan(2500);
  expect(secondDelay).toBeGreaterThanOrEqual(950);
  expect(secondDelay).toBeLessThan(5000);
  await expect.poll(() => connections[2].ready).toBeDefined();
  await expect.poll(() => Date.now() - (connections[2].ready ?? Date.now()), { timeout: 15000 }).toBeGreaterThanOrEqual(11000);
  const stable = connections[2];
  stable.closed = Date.now();
  await stable.browser.close({ code: 1012 });
  await stable.server.close();
  await expect.poll(() => connections.length).toBe(4);
  const resetDelay = retryDelay(connections[3], stable);
  expect(resetDelay).toBeGreaterThanOrEqual(450);
  expect(resetDelay).toBeLessThan(2000);
  await expect.poll(() => connections[3].ready).toBeDefined();
  expect(await page.evaluate(() => localStorage.getItem('access_token') !== null)).toBe(true);
});
