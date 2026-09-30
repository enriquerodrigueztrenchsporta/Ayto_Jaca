"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { StatusMessage } from "@/components/admin/StatusMessage";

export function MediaLibraryUpload() {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <h2 className="font-serif text-h3 font-medium">Subir archivo</h2>
      <MediaUploader
        label="Elegir imagen o PDF"
        onUploaded={(m) => {
          setMsg(`«${m.filename}» subido correctamente. Dirección: ${m.url}`);
          router.refresh();
        }}
      />
      <StatusMessage message={msg} tone="ok" />
    </div>
  );
}
