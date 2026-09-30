import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { imageSize, storeUpload, UploadError, validateUpload } from "@/lib/uploads";

/**
 * Subida de imágenes y PDF desde el panel.
 * Seguridad: sesión obligatoria, comprobación de origen (CSRF), límite de peticiones,
 * validación del tipo real por firma binaria y del tamaño, nombre de archivo aleatorio.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });

  if (!rateLimit(`upload:${session.user.id}`, 30, 10 * 60_000).ok) return NextResponse.json({ error: "Demasiadas subidas. Espera unos minutos." }, { status: 429 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No se ha recibido ningún archivo." }, { status: 400 });
  if (file.size > 25 * 1024 * 1024) return NextResponse.json({ error: "Archivo demasiado grande." }, { status: 413 });

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const type = validateUpload(buffer, file.type || undefined);
    const stored = await storeUpload(buffer, type);
    const dims = type.kind === "image" ? imageSize(buffer) : null;
    const alt = String(form?.get("alt") ?? "").slice(0, 300);
    const safeName = file.name.replace(/[^\w.\- áéíóúñÁÉÍÓÚÑ()]/g, "_").slice(0, 150);
    const media = await db.media.create({
      data: { filename: safeName, url: stored.url, mimeType: type.mime, size: buffer.length, width: dims?.width, height: dims?.height, alt, uploadedById: session.user.id },
    });
    await audit({ action: "UPLOAD", entityType: "Media", entityId: media.id, entityTitle: safeName, user: { id: session.user.id, email: session.user.email } });
    return NextResponse.json({ id: media.id, url: media.url, mimeType: media.mimeType, size: media.size, width: media.width, height: media.height, filename: media.filename });
  } catch (err) {
    if (err instanceof UploadError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("[upload] error al guardar el archivo");
    return NextResponse.json({ error: "No se pudo guardar el archivo." }, { status: 500 });
  }
}
