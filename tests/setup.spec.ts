import { setupStartInfo, setupStatus } from './status';
import { fulfillRoute } from './utils';
import { expect, test } from '@playwright/test';

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
