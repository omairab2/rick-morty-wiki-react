import { defineConfig, devices } from '@playwright/test';

/**
 * Local dev base URL. The Vite dev server is pinned to port 3000 in
 * `vite.config.ts`, so the E2E suite targets the same port.
 */
const BASE_URL = 'http://localhost:3000';

const WEB_SERVER_TIMEOUT_MS = 120_000;
const EXPECT_TIMEOUT_MS = 10_000;

export default defineConfig({
  testDir: './e2e',
  // Run serially: against the live API, stability beats speed for so few tests
  // (avoids parallel cold-start contention on the dev server / API).
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: {
    timeout: EXPECT_TIMEOUT_MS,
  },
  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: WEB_SERVER_TIMEOUT_MS,
    // Run the dev server against the MSW mocks (not the live API) so the suite
    // is deterministic and offline-friendly. Vite exposes VITE_-prefixed env
    // vars to import.meta.env, which gates mocking in src/main.tsx.
    env: { VITE_ENABLE_MSW: 'true' },
  },
});
