import { defineConfig, devices } from "@playwright/test";
import { testDatabaseUrl } from "./tests/setup/db-url";

/**
 * E2E contra la build de producción (`next start`) en el puerto 3100 y la BD de tests.
 * Requiere `npm run build` previo. Ver README → Tests.
 */
const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE = `http://localhost:${PORT}`;
export const E2E_ADMIN = { email: "e2e-admin@example.org", password: process.env.E2E_ADMIN_PASSWORD ?? "e2e-solo-para-tests-1234" };

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  globalSetup: "./tests/e2e/global-setup.ts",
  use: { baseURL: BASE, locale: "es-ES", timezoneId: "Europe/Madrid", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /public|a11y/ },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `${BASE}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      DATABASE_URL: testDatabaseUrl(),
      AUTH_SECRET: process.env.AUTH_SECRET ?? "e2e-secret-only-for-local-tests-00000000",
      AUTH_URL: BASE,
      AUTH_TRUST_HOST: "true",
      SITE_URL: BASE,
      NEXT_PUBLIC_DEMO_MODE: "true",
      UPLOAD_DIR: "./storage/e2e-uploads",
    },
  },
});
