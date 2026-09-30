"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, Menu, Phone, X } from "lucide-react";
import type { NavSection } from "@/lib/site";
import { EXTERNAL, SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Navegación móvil a pantalla completa con acordeones. Diálogo modal accesible. */
export function MobileNavigation({ sections }: { sections: NavSection[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const first = dialogRef.current?.querySelector<HTMLElement>("button, a");
    first?.focus();
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex min-h-11 items-center gap-2 rounded-[4px] border border-stone-300 px-3 font-semibold text-forest-900"
      >
        <Menu aria-hidden className="size-5" /> Menú
      </button>
      {open && (
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Menú principal" className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-snow">
          <div className="container-site flex h-20 shrink-0 items-center justify-between border-b border-stone-200">
            <span className="font-serif text-2xl font-semibold text-forest-900">Menú</span>
            <button type="button" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center gap-2 rounded-[4px] border border-stone-300 px-3 font-semibold">
              <X aria-hidden className="size-5" /> Cerrar
            </button>
          </div>
          <div className="container-site flex-1 py-4">
            <a href={EXTERNAL.sede} target="_blank" rel="noopener noreferrer" className="mb-4 flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-forest-700 font-semibold text-snow">
              Sede Electrónica <ExternalLink aria-hidden className="size-4" /><span className="sr-only">(abre sitio externo)</span>
            </a>
            <ul className="divide-y divide-stone-200 border-y border-stone-200">
              {sections.map((s, i) => (
                <li key={s.label}>
                  <button
                    type="button"
                    aria-expanded={expanded === i}
                    aria-controls={`mnav-${i}`}
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="flex min-h-14 w-full items-center justify-between text-left text-lg font-semibold text-ink"
                  >
                    {s.label}
                    <ChevronDown aria-hidden className={cn("size-5 transition-transform", expanded === i && "rotate-180")} />
                  </button>
                  <ul id={`mnav-${i}`} hidden={expanded !== i} className="pb-4">
                    <li>
                      <Link href={s.href} className="flex min-h-11 items-center pl-3 font-semibold text-forest-700">
                        Portada de {s.label}
                      </Link>
                    </li>
                    {s.links.map((l) => (
                      <li key={l.label}>
                        {l.external ? (
                          <a href={l.href} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-1.5 pl-3 text-ink-2">
                            {l.label} <ExternalLink aria-hidden className="size-3.5" /><span className="sr-only">(abre sitio externo)</span>
                          </a>
                        ) : (
                          <Link href={l.href} className="flex min-h-11 items-center pl-3 text-ink-2">
                            {l.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <a href={SITE.phoneHref} className="mt-6 flex min-h-12 items-center gap-2 font-semibold text-forest-700">
              <Phone aria-hidden className="size-5" /> {SITE.phone} · Atención general
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
