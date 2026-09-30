import "dotenv/config";

/** URL de la BD de tests: TEST_DATABASE_URL o la BD "ayto_jaca_test" del mismo servidor que DATABASE_URL. */
export function testDatabaseUrl(): string {
  if (process.env.TEST_DATABASE_URL) return process.env.TEST_DATABASE_URL;
  const base = process.env.DATABASE_URL ?? "postgresql://ayto:ayto_local_only@localhost:5433/ayto_jaca";
  const u = new URL(base);
  u.pathname = "/ayto_jaca_test";
  return u.toString();
}
