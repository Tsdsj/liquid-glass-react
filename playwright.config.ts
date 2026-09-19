import { defineConfig, devices } from '@playwright/test';

/**
 * Ports nobody else is likely to be sitting on, and servers we always start ourselves.
 *
 * `reuseExistingServer` sounds like a convenience and is a trap: 5173 and 4173 are the Vite
 * defaults, so any other checkout running on this machine already owns them, and Playwright
 * will happily adopt that stranger and run the whole suite against somebody else's
 * application. It did. Starting our own and failing loudly when the port is taken is the only
 * answer that cannot quietly test the wrong thing.
 */
export const PREVIEW_PORT = 41730;
export const DEV_PORT = 41731;

export default defineConfig({
  testDir: './tests/browser', timeout: 30_000, expect: { timeout: 5_000 }, fullyParallel: false,
  forbidOnly: !!process.env.CI, retries: process.env.CI ? 1 : 0, workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'reports/playwright', open: 'never' }]],
  use: { baseURL: process.env.TEST_URL || `http://127.0.0.1:${PREVIEW_PORT}`, trace: 'retain-on-failure', screenshot: 'only-on-failure', viewport: { width: 1440, height: 1000 } },
  projects: [
    { name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' }, testIgnore: /(fallback|warnings|strict-mode|hydration|matrix)\.spec\.ts/ },
    { name: 'chromium', use: { ...devices['Desktop Chrome'], ...(process.env.CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.CHROMIUM_PATH } } : {}) }, testIgnore: /(fallback|warnings|strict-mode|hydration|matrix)\.spec\.ts/ },
    /* The development-mode warnings only exist before `process.env.NODE_ENV` is replaced, so
       they have to be read from the dev server rather than from the built site. */
    { name: 'dev', use: { ...devices['Desktop Chrome'], channel: 'chrome', baseURL: `http://127.0.0.1:${DEV_PORT}` }, testMatch: /(warnings|strict-mode|hydration)\.spec\.ts/ },
    /* Safari and Firefox have no SVG-backdrop lensing. They are not a substitute for the Chrome
       run: these projects check that the fallback is a material rather than a hole, and that
       nothing about the layout, the semantics or the keyboard depends on the refraction path. */
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testMatch: /fallback\.spec\.ts/ },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testMatch: /fallback\.spec\.ts/ },
    /* The audit sweep. Its own project because it is slow and because it reports rather than
       asserts: `pnpm test:matrix` writes reports/matrix.json, and what it finds becomes a
       dedicated test in one of the projects above. */
    { name: 'matrix', use: { ...devices['Desktop Chrome'], channel: 'chrome' }, testMatch: /matrix\.spec\.ts/, timeout: 20 * 60_000 },
  ],
  webServer: process.env.TEST_URL ? undefined : [
    { command: `node scripts/serve-preview.mjs --root site/dist`, port: PREVIEW_PORT, env: { PORT: String(PREVIEW_PORT) }, reuseExistingServer: false, timeout: 10_000 },
    { command: `vite --config site/vite.config.ts --port ${DEV_PORT} --strictPort`, port: DEV_PORT, reuseExistingServer: false, timeout: 30_000 },
  ],
});
