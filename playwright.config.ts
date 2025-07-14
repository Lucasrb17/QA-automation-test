import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/specs',
  timeout: 40 * 1000,
  expect: { timeout: 6000 },
  use: {
    baseURL: 'https://dashboard-local.zala.app:4002',
    ignoreHTTPSErrors: true,
    headless: false,
    viewport: { width: 1280, height: 720 },
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox',  use: { browserName: 'firefox'  } },
    { name: 'webkit',   use: { browserName: 'webkit'   } },
  ],
  reporter: [['list'], ['html', { open: 'never' }]],
});