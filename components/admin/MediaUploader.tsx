"use client";
import { useId, useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";

export type UploadedMedia = { id: string; url: string; mimeType: string; size: number; filename: string; width?: number | null; height?: number | null };

/** Subida de imágenes (JPG, PNG, WebP) y PDF con validación en servidor. */
export function MediaUploader({ accept = "image/jpeg,image/png,image/webp,application/pdf", label = "Subir archivo", onUploaded }: { accept?: string; label?: string; onUploaded: (m: UploadedMedia) => void }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo subir el archivo.");
      onUploaded(json as UploadedMedia);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={id} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[4px] border border-dashed border-forest-700 bg-white px-4 font-semibold text-forest-700 hover:bg-forest-50 focus-within:outline focus-within:outline-3 focus-within:outline-earth-500">
        {busy ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Upload aria-hidden className="size-4" />}
        {busy ? "Subiendo…" : label}
        <input
          ref={input}
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
        />
      </label>
      <p className="mt-1 text-sm text-muted">JPG, PNG o WebP hasta 5 MB · PDF hasta 15 MB.</p>
      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-urgent">
          {error}
        </p>
      )}
    </div>
  );
}
