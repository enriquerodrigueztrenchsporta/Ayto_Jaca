#!/usr/bin/env node
/**
 * PostgreSQL local sin Docker (Windows, macOS, Linux) para desarrollo y tests.
 *
 * Usa el paquete `embedded-postgres`, que incluye binarios oficiales de PostgreSQL.
 * Los datos se guardan en `.local-db/<nombre>` (ignorado por Git).
 *
 *   npm run db:local            → base de datos de desarrollo  (puerto 5433, BD "ayto_jaca")
 *   npm run db:local -- --test  → base de datos de tests       (puerto 5434, BD "ayto_jaca_test")
 *
 * Mantener la ventana abierta mientras se trabaja. Ctrl+C la detiene limpiamente.
 */
import EmbeddedPostgres from "embedded-postgres";
import fs from "node:fs";
import path from "node:path";

const isTest = process.argv.includes("--test");
const port = Number(process.env.LOCAL_DB_PORT ?? (isTest ? 5434 : 5433));
const dbName = isTest ? "ayto_jaca_test" : "ayto_jaca";
const dataDir = path.resolve(".local-db", isTest ? "test" : "dev");
const user = "ayto";
const password = "ayto_local_only";

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user,
  password,
  port,
  persistent: !isTest,
  onLog: () => {},
  onError: (e) => console.error("[postgres]", e),
});

const firstRun = !fs.existsSync(path.join(dataDir, "PG_VERSION"));
if (firstRun) {
  if (isTest && fs.existsSync(dataDir)) fs.rmSync(dataDir, { recursive: true, force: true });
  await pg.initialise();
}
await pg.start();
try {
  await pg.createDatabase(dbName);
} catch {
  // Ya existe.
}

const url = `postgresql://${user}:${password}@localhost:${port}/${dbName}`;
console.log(`\nPostgreSQL local listo en el puerto ${port}.`);
console.log(`DATABASE_URL="${url}"\n`);
if (process.env.LOCAL_DB_READY_FILE) fs.writeFileSync(process.env.LOCAL_DB_READY_FILE, url);

const shutdown = async () => {
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
setInterval(() => {}, 1 << 30);
