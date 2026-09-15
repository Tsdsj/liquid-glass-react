import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', timeout: 30_000, expect: { timeout: 5_000 }, fullyParallel: false,
  forbidOnly: !!process.env.CI, retries: process.env.CI ? 1 : 0, workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'reports/playwright', open: 'never' }]],
  use: { baseURL: process.env.TEST_URL || 'http://127.0.0.1:4173', trace: 'retain-on-failure', screenshot: 'only-on-failure', viewport: { width: 1440, height: 1000 } },
  projects: [
    { name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' }, testIgnore: /fallback\.spec\.ts/ },
    { name: 'chromium', use: { ...devices['Desktop Chrome'], ...(process.env.CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.CHROMIUM_PATH } } : {}) }, testIgnore: /fallback\.spec\.ts/ },
    /* Safari and Firefox have no SVG-backdrop lensing. They are not a substitute for the Chrome
       run: these projects check that the fallback is a material rather than a hole, and that
       nothing about the layout, the semantics or the keyboard depends on the refraction path. */
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testMatch: /fallback\.spec\.ts/ },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testMatch: /fallback\.spec\.ts/ },
  ],
  webServer: process.env.TEST_URL ? undefined : { command: 'node scripts/serve-preview.mjs --root site/dist', port: 4173, reuseExistingServer: !process.env.CI, timeout: 10_000 },
});
