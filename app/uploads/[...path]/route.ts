import fs from "node:fs/promises";
import { mimeFromExt, resolveUploadPath } from "@/lib/uploads";

/**
 * Sirve archivos subidos desde el panel (imágenes y PDF).
 * En producción Nginx puede servir /uploads directamente desde el volumen (ver deploy/nginx).
 */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const file = resolveUploadPath((await params).path);
  if (!file) return new Response("No encontrado", { status: 404 });
  try {
    const data = await fs.readFile(file);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": mimeFromExt(file),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": "inline",
      },
    });
  } catch {
    return new Response("No encontrado", { status: 404 });
  }
}
