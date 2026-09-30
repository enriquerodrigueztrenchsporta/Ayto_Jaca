import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { uploadDir, uploadLimits } from "@/lib/env";

export type AllowedType = { mime: string; ext: string; kind: "image" | "document" };

const SIGNATURES: Array<AllowedType & { test: (b: Buffer) => boolean }> = [
  { mime: "image/jpeg", ext: "jpg", kind: "image", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: "image/png", ext: "png", kind: "image", test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: "image/webp", ext: "webp", kind: "image", test: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" },
  { mime: "application/pdf", ext: "pdf", kind: "document", test: (b) => b.subarray(0, 5).toString("ascii") === "%PDF-" },
];

/** Detecta el tipo real por la firma binaria (no se confía en la extensión ni en el MIME declarado). */
export function detectType(buffer: Buffer): AllowedType | null {
  const hit = SIGNATURES.find((s) => s.test(buffer));
  return hit ? { mime: hit.mime, ext: hit.ext, kind: hit.kind } : null;
}

export class UploadError extends Error {}

export function validateUpload(buffer: Buffer, declaredMime?: string): AllowedType {
  if (!buffer.length) throw new UploadError("El archivo está vacío.");
  const type = detectType(buffer);
  if (!type) throw new UploadError("Formato no permitido. Se admiten JPG, PNG, WebP y PDF.");
  if (declaredMime && declaredMime !== type.mime && !(declaredMime === "image/jpg" && type.mime === "image/jpeg")) {
    throw new UploadError("El tipo del archivo no coincide con su contenido.");
  }
  const limits = uploadLimits();
  const max = type.kind === "image" ? limits.imageBytes : limits.documentBytes;
  if (buffer.length > max) throw new UploadError(`El archivo supera el tamaño máximo (${Math.round(max / 1024 / 1024)} MB).`);
  return type;
}

/** Nombre seguro: nunca se usa el nombre original en la ruta del disco. */
export async function storeUpload(buffer: Buffer, type: AllowedType) {
  const now = new Date();
  const rel = path.posix.join(String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, "0"), `${randomBytes(12).toString("hex")}.${type.ext}`);
  const abs = path.join(path.resolve(uploadDir()), rel);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, buffer, { mode: 0o640 });
  return { url: `/uploads/${rel}`, relativePath: rel };
}

/** Resuelve una ruta pública /uploads/... a disco impidiendo path traversal. */
export function resolveUploadPath(segments: string[]): string | null {
  const base = path.resolve(uploadDir());
  const target = path.resolve(base, ...segments);
  if (!target.startsWith(base + path.sep)) return null;
  if (!/^[a-z0-9/_\.-]+$/i.test(segments.join("/"))) return null;
  return target;
}

export function mimeFromExt(file: string): string {
  const ext = path.extname(file).toLowerCase();
  return { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".pdf": "application/pdf" }[ext] ?? "application/octet-stream";
}

/** Lee dimensiones básicas de JPEG/PNG/WebP sin dependencias. */
export function imageSize(buffer: Buffer): { width: number; height: number } | null {
  try {
    if (buffer[0] === 0x89) return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    if (buffer.subarray(0, 4).toString("ascii") === "RIFF") {
      const chunk = buffer.subarray(12, 16).toString("ascii");
      if (chunk === "VP8X") return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
      if (chunk === "VP8 ") return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
      if (chunk === "VP8L") {
        const bits = buffer.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
    }
    if (buffer[0] === 0xff) {
      let i = 2;
      while (i < buffer.length) {
        if (buffer[i] !== 0xff) return null;
        const marker = buffer[i + 1];
        const len = buffer.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { height: buffer.readUInt16BE(i + 5), width: buffer.readUInt16BE(i + 7) };
        }
        i += 2 + len;
      }
    }
  } catch {
    return null;
  }
  return null;
}
