"use client";
import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { runLifecycleAction } from "../actions";

/** Ejecuta manualmente la publicación de programados y el archivado de caducados. */
export function LifecycleButton() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => setMsg((await runLifecycleAction()).message ?? ""))}
        className="inline-flex min-h-11 items-center gap-2 rounded-[4px] border border-stone-300 bg-white px-4 font-semibold hover:bg-stone-100 disabled:opacity-60"
      >
        <RefreshCw aria-hidden className={pending ? "size-4 animate-spin" : "size-4"} /> Actualizar estados ahora
      </button>
      <p role="status" className="text-sm text-muted">{msg}</p>
    </div>
  );
}
