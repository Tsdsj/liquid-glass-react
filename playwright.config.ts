import { defineConfig } from '@playwright/test';

const STORYBOOK_URL = 'http://127.0.0.1:6006';

export default defineConfig({
  testDir: './visual-tests',
  outputDir: './test-results',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 8_000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.01,
    },
  },
  reporter: 'list',
  use: {
    baseURL: STORYBOOK_URL,
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    locale: 'zh-CN',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm exec storybook dev -p 6006 --ci --host 127.0.0.1',
    url: STORYBOOK_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
