import { createServer } from 'node:http';
import { LoginPage } from './fixtures/login-page';
import { fulfillRoute } from './utils';
import { test as base, expect } from '@playwright/test';

type MyFixtures = {
  loginPage: LoginPage;
  sseConnection: void;
};

const test = base.extend<MyFixtures>({
  sseConnection: [async ({ page }, use) => {
    const server = createServer((_request, response) => {
      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true',
      });
      response.write(`event: system_startup_info\ndata: ${JSON.stringify({
        bitcoin: 'done',
        bitcoin_msg: '',
        lightning: 'disabled',
        lightning_msg: '',
      })}\n\n`);
      // Keep the stream open until teardown, just like the API's SSE endpoint.
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Missing SSE server address');
    try {
      await page.route('**/api/sse/subscribe', route =>
        route.continue({ url: `http://127.0.0.1:${address.port}/` }),
      );
      await use();
    } finally {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) => {
        server.close(error => error ? reject(error) : resolve());
      });
    }
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
