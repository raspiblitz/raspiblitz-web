import { expect, test } from '@playwright/test';
import { isRecord } from '../src/utils/guards';

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
