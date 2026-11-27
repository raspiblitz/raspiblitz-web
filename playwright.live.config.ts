import { defineConfig } from '@playwright/test';
import config from './playwright.config';

// Required env vars are checked in globalSetup so the config loads without them.
const backend = process.env.BACKEND_SERVER ?? '';

export default defineConfig({
  ...config,
  globalSetup: './tests/live-global-setup.ts',
  testMatch: '**/realtime-live.spec.ts',
  testIgnore: [],
  retries: 0,
  workers: 1,
  reporter: 'line',
  use: { ...config.use, trace: 'off', screenshot: 'off', video: 'off' },
  webServer: {
    name: 'WebUI with live API',
    command: 'npm run start -- --port 3100 --strictPort',
    url: 'http://localhost:3100',
    env: { BACKEND_SERVER: backend },
    timeout: 120 * 1000,
    reuseExistingServer: false,
  },
});
