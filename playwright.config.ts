import { defineConfig, devices } from '@playwright/test';

/**
 * The E2E suite runs its own dev server on a dedicated port (not the 3000 used
 * by `pnpm dev`). This keeps E2E decoupled from a developer's running dev
 * server: Playwright never reuses it, and always boots its own MSW-mocked
 * instance for deterministic runs.
 */
const E2E_PORT = 3100;
const BASE_URL = `http://localhost:${E2E_PORT}`;

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
    command: `pnpm dev --port ${E2E_PORT}`,
    url: BASE_URL,
    // Safe to reuse: only the E2E server (MSW-enabled) ever lives on E2E_PORT,
    // so this never picks up a developer's `pnpm dev` running on 3000.
    reuseExistingServer: true,
    timeout: WEB_SERVER_TIMEOUT_MS,
    // Run the dev server against the MSW mocks (not the live API) so the suite
    // is deterministic and offline-friendly. Vite exposes VITE_-prefixed env
    // vars to import.meta.env, which gates mocking in src/main.tsx.
    env: { VITE_ENABLE_MSW: 'true' },
  },
});
