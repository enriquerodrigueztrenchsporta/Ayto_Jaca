import { execSync } from "node:child_process";
import pg from "pg";
import { testDatabaseUrl } from "./db-url";

/**
 * Prepara la base de datos de tests: la crea si no existe, aplica migraciones y carga el seed.
 * Si no hay PostgreSQL disponible, los tests de integración se marcan como omitidos.
 */
export default async function setup() {
  const url = testDatabaseUrl();
  const target = new URL(url);
  const dbName = target.pathname.slice(1);
  if (!/_test$/.test(dbName)) throw new Error(`Por seguridad, la BD de tests debe terminar en "_test" (recibido: ${dbName})`);
  const admin = new URL(url);
  admin.pathname = "/postgres";
  const client = new pg.Client({ connectionString: admin.toString() });
  try {
    await client.connect();
  } catch {
    process.env.SKIP_DB_TESTS = "1";
    console.warn("\n[tests] PostgreSQL no disponible: se omiten los tests de integración. Arranca `npm run db:local` o define TEST_DATABASE_URL.\n");
    return;
  }
  const exists = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
  if (!exists.rowCount) await client.query(`CREATE DATABASE "${dbName}"`);
  await client.end();
  const env = { ...process.env, DATABASE_URL: url, ADMIN_EMAIL: "", ADMIN_PASSWORD: "" };
  execSync("npx prisma migrate deploy", { stdio: "ignore", env });
  execSync("npx tsx prisma/seed.ts --force", { stdio: "ignore", env });
}
