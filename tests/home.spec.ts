import { LoginPage } from './fixtures/login-page';
import { fulfillRoute } from './utils';
import { test as base, expect } from '@playwright/test';

type MyFixtures = {
  loginPage: LoginPage;
  realtimeConnection: void;
};

const test = base.extend<MyFixtures>({
  realtimeConnection: [async ({ page }, use) => {
    await page.routeWebSocket('**/api/ws', ws => {
      ws.onMessage(raw => {
        const frame = JSON.parse(String(raw));
        expect(frame.type).toBe('auth');
        expect(typeof frame.token).toBe('string');
        ws.send(JSON.stringify({ event: 'system_startup_info', data: {
          bitcoin: 'done',
          bitcoin_msg: '',
          lightning: 'disabled',
          lightning_msg: '',
        } }));
      });
    });
    await use();
  }, { auto: true }],
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(page);

    await use(loginPage);
  },
});

test.beforeEach(async ({ page }) => {
  await page.route('**/api/lightning/list-all-tx?reversed=true', route =>
    fulfillRoute(route, []),
  );
});

test('should route to home and save token after login', async ({
  loginPage,
  page,
}) => {
  await page.waitForURL('/home');
  await expect(page).toHaveURL('/home');
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  expect(
    await page.evaluate(_ => localStorage.getItem('access_token')),
  ).toMatch('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
});

test('should login automatically if token is not expired', async ({
  loginPage,
  page,
}) => {
  await page.waitForURL('/home');
  await expect(page).toHaveURL('/home');

  await page.reload();
  await page.waitForURL('/home');
  await expect(page).toHaveURL('/home');
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
});

test('redirect to home if token is not expired & login page was called', async ({
  loginPage,
  page,
}) => {
  await page.waitForURL('/home');
  await expect(page).toHaveURL('/home');

  await page.goto('/login');
  await page.waitForURL('/home');
  await expect(page).toHaveURL('/home');
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
});
