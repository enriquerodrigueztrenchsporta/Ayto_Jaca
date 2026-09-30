import { execSync } from "node:child_process";
import pg from "pg";
import bcrypt from "bcryptjs";
import { testDatabaseUrl } from "../setup/db-url";
import { E2E_ADMIN } from "../../playwright.config";

/** Base de datos limpia con el contenido real (seed) y un usuario admin exclusivo de tests. */
export default async function globalSetup() {
  const url = testDatabaseUrl();
  const dbName = new URL(url).pathname.slice(1);
  if (!dbName.endsWith("_test")) throw new Error("La BD de E2E debe terminar en _test");
  const admin = new URL(url);
  admin.pathname = "/postgres";
  const c = new pg.Client({ connectionString: admin.toString() });
  await c.connect();
  const exists = await c.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
  if (!exists.rowCount) await c.query(`CREATE DATABASE "${dbName}"`);
  await c.end();
  const env = { ...process.env, DATABASE_URL: url, ADMIN_EMAIL: "", ADMIN_PASSWORD: "" };
  execSync("npx prisma migrate deploy", { stdio: "ignore", env });
  execSync("npx tsx prisma/seed.ts --force", { stdio: "ignore", env });
  const db = new pg.Client({ connectionString: url });
  await db.connect();
  const hash = await bcrypt.hash(E2E_ADMIN.password, 10);
  await db.query(
    `INSERT INTO "User" (id, email, name, "passwordHash", role, active, "createdAt", "updatedAt") VALUES ('e2e-admin', $1, 'Admin E2E', $2, 'ADMIN', true, now(), now())
     ON CONFLICT (email) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", active = true`,
    [E2E_ADMIN.email, hash],
  );
  await db.end();
}
