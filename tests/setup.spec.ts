import { setupStartInfo, setupStatus } from './status';
import { fulfillRoute } from './utils';
import { expect, test } from '@playwright/test';

test('recovery startup waits for a confirmed wallet state before offering unlock', async ({ page }) => {
  const sync = {
    btc_default_ready: '0',
    btc_default_sync_percentage: '0',
    ln_default: 'lnd',
    ln_default_ready: '0',
    ln_default_locked: '0',
    system_count_start_lightning: '1',
  };
  await page.route('**/api/setup/status', route => fulfillRoute(route, {
    ...setupStatus, state: 'ready', setupPhase: 'done', initialsync: 'running',
  }));
  await page.route('**/api/setup/setup-sync-info', route => fulfillRoute(route, sync));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Node startup and synchronization' })).toBeVisible();
  await expect(page.getByText('Waiting for Bitcoin', { exact: true })).toBeVisible();
  await expect(page.getByText('Waiting for Lightning wallet status')).toBeVisible();
  await expect(page.getByText('Lightning wallet unlocked', { exact: true })).toHaveCount(0);

  Object.assign(sync, { btc_default_ready: '1', btc_default_sync_percentage: '100.00', ln_default_locked: '1' });
  const unlock = page.getByRole('button', { name: 'Unlock Wallet' });
  await expect(unlock).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Sync Progress: 100%')).toBeVisible();
  await unlock.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  Object.assign(sync, { ln_default_locked: '0', ln_default_ready: '1' });
  await expect(page.getByText('Lightning wallet unlocked', { exact: true })).toBeVisible({ timeout: 10000 });
});

test('keeps monitoring RaspiBlitz script progress states', async ({ page }) => {
  let readyForSetup = false;
  await page.route('**/api/setup/status', route => fulfillRoute(route, {
    ...setupStatus,
    state: readyForSetup ? 'waitsetup' : 'hdd-format',
    message: 'Formatting storage',
  }));
  await page.route('**/api/setup/setup-start-info', route => fulfillRoute(route, setupStartInfo));

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'hdd-format', exact: true })).toBeVisible();
  await expect(page.getByText('Formatting storage', { exact: true })).toBeVisible();
  readyForSetup = true;
  await expect(page.getByLabel('Fresh Setup')).toBeVisible({ timeout: 10000 });
});

test('simple setup path', async ({ page }) => {
  await page.route('**/api/setup/status', route =>
    fulfillRoute(route, setupStatus),
  );
  await page.route('**/api/setup/setup-start-info', route =>
    fulfillRoute(route, setupStartInfo),
  );

  await page.goto('/');

  await page.getByLabel('Fresh Setup').click({ force: true });
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Yes, delete all data' }).click();

  await page.getByLabel('Node Name').fill('BlueNode');
  await page.getByRole('button', { name: 'Continue' }).click();

  await page
    .getByLabel('Bitcoin Full Node with Lightning LND Implementation ')
    .click({ force: true });
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByLabel('Node Password', { exact: true }).fill('node12345');
  await page
    .getByLabel('Repeat Node Password', { exact: true })
    .fill('node12345');
  await page.getByRole('button', { name: 'Continue' }).click();

  page.getByAltText('Set your Apps password');
  await page.getByLabel('Apps Password', { exact: true }).fill('apps12345');
  await page
    .getByLabel('Repeat Apps Password', { exact: true })
    .fill('apps12345');
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByLabel('Wallet Password', { exact: true }).fill('wallet12345');
  await page
    .getByLabel('Repeat Wallet Password', { exact: true })
    .fill('wallet12345');
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.route('**/api/setup/setup-start-done', route =>
    fulfillRoute(route, 'STATUS'),
  );
  await page.route('**/api/setup/status', route =>
    fulfillRoute(route, setupStatus),
  );

  await page.getByRole('button', { name: 'Start setup' }).click();
  await page.route('**/api/setup/status', route =>
    fulfillRoute(route, setupStatus),
  );
  await page.route('**/api/setup/setup-start-info', route =>
    fulfillRoute(route, setupStartInfo),
  );
});

test('incomplete migration data offers retry and recovers when data is available', async ({ page }) => {
  await page.route('**/api/setup/status', route =>
    fulfillRoute(route, { ...setupStatus, setupPhase: 'migration' }),
  );
  let infoRequests = 0;
  let migrationAvailable = false;
  await page.route('**/api/setup/setup-start-info', route => {
    infoRequests += 1;
    return fulfillRoute(route, {
      ...setupStartInfo,
      setupPhase: 'migration',
      hddGotMigrationData: migrationAvailable ? 'umbrel' : null,
      migrationMode: migrationAvailable ? 'normal' : null,
    });
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'error', exact: true })).toBeVisible();
  await expect(page.getByText('Migration data is incomplete. Retry after checking the source disk.')).toBeVisible();
  const initialRequests = infoRequests;
  migrationAvailable = true;
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Migrate to RaspiBlitz' })).toBeVisible();
  expect(infoRequests).toBe(initialRequests + 1);
});
