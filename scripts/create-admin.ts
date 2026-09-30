/**
 * Crea o actualiza un usuario administrador sin guardar contraseñas en el repositorio.
 *
 *   npm run admin:create
 *   npm run admin:create -- --email persona@aytojaca.es --name "Nombre" --role ADMIN
 *
 * La contraseña se pide por consola (o se toma de ADMIN_PASSWORD si existe).
 */
import "dotenv/config";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const email = (arg("email") ?? process.env.ADMIN_EMAIL ?? (await rl.question("Correo electrónico: "))).trim().toLowerCase();
  const name = arg("name") ?? process.env.ADMIN_NAME ?? (await rl.question("Nombre: "));
  const role = (arg("role") ?? "ADMIN").toUpperCase() === "EDITOR" ? "EDITOR" : "ADMIN";
  let password = process.env.ADMIN_PASSWORD ?? "";
  if (!password) password = await rl.question("Contraseña (mínimo 12 caracteres): ");
  rl.close();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Correo no válido");
  if (password.length < 12) throw new Error("La contraseña debe tener al menos 12 caracteres");

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.upsert({ where: { email }, update: { name, role, passwordHash, active: true }, create: { email, name, role, passwordHash } });
  console.log(`Usuario ${user.email} (${user.role}) listo. Ya puede entrar en /admin.`);
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
