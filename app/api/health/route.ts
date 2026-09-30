import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Healthcheck para Docker, Nginx y monitorización.
 * No revela versiones, rutas, credenciales ni errores internos.
 */
export async function GET() {
  const started = Date.now();
  let database: "ok" | "error" = "ok";
  try {
    await db.$queryRaw`SELECT 1`;
  } catch {
    database = "error";
  }
  const status = database === "ok" ? "ok" : "degraded";
  return NextResponse.json(
    { status, app: "ok", database, timestamp: new Date().toISOString(), responseTimeMs: Date.now() - started },
    { status: database === "ok" ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
