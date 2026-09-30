"use client";
import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "primary" | "danger";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Diálogo modal accesible basado en <dialog> nativo (gestiona foco y Escape). */
export function ConfirmDialog({ open, title, children, confirmLabel, cancelLabel = "Cancelar", tone = "primary", busy, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      className="m-auto w-[min(560px,calc(100vw-2rem))] rounded-[10px] border border-stone-200 bg-white p-0 text-ink shadow-2xl backdrop:bg-forest-900/60"
    >
      <div className="p-6 md:p-8">
        <h2 id="confirm-title" className="font-serif text-h3 font-medium">
          {title}
        </h2>
        <div className="mt-3 text-ink-2">{children}</div>
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onCancel} className="min-h-12 rounded-[4px] border border-stone-300 px-5 font-semibold hover:bg-stone-100">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            autoFocus
            className={
              tone === "danger"
                ? "min-h-12 rounded-[4px] bg-urgent px-5 font-semibold text-white hover:bg-[#8a1d15] disabled:opacity-60"
                : "min-h-12 rounded-[4px] bg-forest-700 px-5 font-semibold text-snow hover:bg-forest-600 disabled:opacity-60"
            }
          >
            {busy ? "Procesando…" : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
