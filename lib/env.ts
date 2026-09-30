/**
 * Acceso centralizado a configuración de entorno.
 * Solo servidor: se leen en tiempo de ejecución, por lo que un cambio en `.env`
 * (p. ej. NEXT_PUBLIC_DEMO_MODE) surte efecto al reiniciar el contenedor sin recompilar.
 */
function read(name: string): string | undefined {
  return process.env[name];
}

export function isDemoMode(): boolean {
  const v = read("NEXT_PUBLIC_DEMO_MODE") ?? read("DEMO_MODE") ?? "true";
  return v.toLowerCase() !== "false";
}

export function siteUrl(): string {
  return (read("SITE_URL") ?? read("AUTH_URL") ?? "http://localhost:3000").replace(/\/$/, "");
}

export function uploadDir(): string {
  return read("UPLOAD_DIR") ?? "./storage/uploads";
}

export function uploadLimits() {
  return {
    imageBytes: Number(read("UPLOAD_MAX_IMAGE_MB") ?? 5) * 1024 * 1024,
    documentBytes: Number(read("UPLOAD_MAX_DOCUMENT_MB") ?? 15) * 1024 * 1024,
  };
}
