import path from "node:path";
import { defineConfig } from "vitest/config";
import { testDatabaseUrl } from "./tests/setup/db-url";

/**
 * Tests unitarios (sin BD) e integración (con PostgreSQL).
 * La integración usa una BD aislada (ver tests/setup/db-url.ts); nunca la de desarrollo o producción.
 */
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
    globalSetup: ["tests/setup/global-setup.ts"],
    env: { DATABASE_URL: testDatabaseUrl(), TEST_DATABASE_URL: testDatabaseUrl(), AUTH_SECRET: "test-secret-not-used-in-production-000000", UPLOAD_DIR: "./storage/test-uploads" },
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 120_000,
  },
});
