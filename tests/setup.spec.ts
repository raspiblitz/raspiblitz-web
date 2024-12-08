import { setupStartInfo, setupStatus } from './status';
import { fulfillRoute } from './utils';
import { test } from '@playwright/test';

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
