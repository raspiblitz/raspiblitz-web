import { LoginPage } from './fixtures/login-page';
import { fulfillRoute } from './utils';
import { test as base, expect } from '@playwright/test';
import { createServer, type ServerResponse } from 'node:http';
import { once } from 'node:events';

type MyFixtures = {
  loginPage: LoginPage
};

const test = base.extend<MyFixtures>({
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
  // mock a sse connection - needs to be improved
  await page.route('**/api/sse/subscribe', (route) => {
    const events = [
      `event: system_startup_info\n data: ${JSON.stringify({
        bitcoin: 'done',
        bitcoin_msg: '',
        lightning: '',
        lightning_msg: '',
      })}`,
    ];

    route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      headers: {
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
      },
      body: events[0],
    });
  });
});

test('should route to home and save token after login', async ({
  loginPage,
  page,
}) => {
  await page.waitForURL('/home');
  await expect(page).toHaveURL('/home');
  expect(
    await page.evaluate(_ => localStorage.getItem('access_token')),
  ).toMatch('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
});

test('loads missing Bitcoin statistics and updates them from the live stream', async ({ page }) => {
  const initial = {
    version: 290500, subversion: '/Satoshi:29.5.0/', blocks: 0, headers: 2,
    connections_in: 0, connections_out: 3, verification_progress: 0.25, size_on_disk: 2147483648,
    difficulty: 1, networks: [],
  };
  let sendSnapshot!: () => void;
  const snapshotRequested = new Promise<void>(resolve => { sendSnapshot = resolve; });
  const clients = new Set<ServerResponse>();
  const event = (name: string, value: unknown) =>
    `event: ${name}\ndata: ${JSON.stringify(value)}\n\n`;
  const stream = createServer((request, response) => {
    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Credentials': 'true',
    });
    clients.add(response);
    request.on('close', () => clients.delete(response));
    response.write(event('system_startup_info', { bitcoin: 'done', lightning: 'disabled' }));
    response.write(event('system_info', { chain: 'regtest' }));
  });
  stream.listen(0, '127.0.0.1');
  await once(stream, 'listening');
  try {
    await page.route('**/api/bitcoin/btc-info', async route => {
      await snapshotRequested;
      await fulfillRoute(route, initial);
    });
    const address = stream.address();
    if (!address || typeof address === 'string') throw new Error('Missing test stream port');
    await page.route('**/api/sse/subscribe', route => route.fulfill({
      status: 307, headers: { location: `http://127.0.0.1:${address.port}/events` },
    }));
    await new LoginPage(page).login(page);
    const card = page.locator('section.bd-card').filter({ has: page.getByRole('heading', { name: 'Bitcoin', exact: true }) });
    await expect(card).toBeVisible();
    await expect(card.getByText('0.00 GB')).toHaveCount(0);
    sendSnapshot();
    await expect(card.getByText('29.5.0')).toBeVisible();
    await expect(card.getByText('regtest')).toBeVisible();
    await expect(card.getByText('0 Incoming / 3 Outgoing')).toBeVisible();
    await expect(card.getByText('0 / 2 (25.00 %)')).toBeVisible();
    await expect(card.getByText('0', { exact: true })).toBeVisible();
    await expect(card.getByText('2.00 GB')).toBeVisible();
    for (const client of clients) {
      client.write(event('btc_info', { ...initial, blocks: 2, verification_progress: 1 }));
    }
    await expect(card.getByText('2 / 2 (100.00 %)')).toBeVisible();
  } finally {
    sendSnapshot();
    stream.closeAllConnections();
    await new Promise<void>(resolve => stream.close(() => resolve()));
  }
});

// see https://github.com/raspiblitz/raspiblitz-web/issues/760
test.skip('should login automatically if token is not expired', async ({
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

// see https://github.com/raspiblitz/raspiblitz-web/issues/760
test.skip('redirect to home if token is not expired & login page was called', async ({
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
