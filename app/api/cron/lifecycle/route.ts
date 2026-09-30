import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { runLifecycle } from "@/lib/content/lifecycle";

/**
 * Tarea programada: publica lo programado y archiva lo caducado.
 * Invocar desde cron del servidor:  curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://dominio/api/cron/lifecycle
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!secret || secret.length < 16 || given.length !== secret.length || !timingSafeEqual(Buffer.from(given), Buffer.from(secret))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const result = await runLifecycle();
  return NextResponse.json({ ok: true, ...result, timestamp: new Date().toISOString() });
}

export const GET = POST;
