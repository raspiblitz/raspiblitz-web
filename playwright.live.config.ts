import { defineConfig } from '@playwright/test';
import config from './playwright.config';

const backend = process.env.BACKEND_SERVER;
if (!backend || !process.env.BLITZ_API_PASSWORD) {
  throw new Error('Live tests require BACKEND_SERVER and BLITZ_API_PASSWORD');
}

export default defineConfig({
  ...config,
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
