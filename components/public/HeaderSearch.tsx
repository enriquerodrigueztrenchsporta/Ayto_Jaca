"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { SearchBox } from "./SearchBox";

const EXAMPLES = ["empadronarme", "licencia de obra", "bonificación IBI", "subvención", "factura electrónica", "pleno"];

/** Botón de búsqueda de la cabecera que abre un panel modal accesible. */
export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  const btnRef = useRef<HTMLButtonElement>(null);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const btn = btnRef.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex min-h-11 items-center gap-2 rounded-[4px] px-3 font-semibold text-forest-900 hover:bg-stone-100"
      >
        <Search aria-hidden className="size-5" />
        <span className="hidden sm:inline xl:hidden 2xl:inline">Buscar</span>
        <span className="sr-only sm:hidden">Buscar en la web</span>
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Buscar en la web" className="fixed inset-0 z-50 bg-forest-900/60" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="border-b border-stone-200 bg-snow">
            <div className="container-site py-8">
              <div className="mb-4 flex justify-end">
                <button type="button" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center gap-2 rounded-[4px] border border-stone-300 px-3 font-semibold">
                  <X aria-hidden className="size-5" /> Cerrar
                </button>
              </div>
              <SearchBox size="lg" autoFocus />
              <p className="mt-4 text-ink-2">
                Ejemplos:{" "}
                {EXAMPLES.map((e, i) => (
                  <span key={e}>
                    <a className="link" href={`/buscar?q=${encodeURIComponent(e)}`}>{e}</a>
                    {i < EXAMPLES.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
