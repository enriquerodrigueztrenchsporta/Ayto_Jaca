"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import type { NavSection } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Menú principal de escritorio (≥1024px). Accesible con teclado: Tab, Enter/Espacio y Escape. */
export function MegaMenu({ sections }: { sections: NavSection[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
  }

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const btn = rootRef.current?.querySelector<HTMLButtonElement>(`[data-menu-button="${open}"]`);
        setOpen(null);
        btn?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <nav aria-label="Menú principal" className="hidden xl:block" ref={rootRef}>
      <ul className="flex items-center gap-0.5">
        {sections.map((s, i) => {
          const active = pathname === s.href || pathname.startsWith(s.href + "/");
          return (
            <li key={s.label}>
              <button
                type="button"
                data-menu-button={i}
                aria-expanded={open === i}
                aria-controls={`megamenu-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-1 whitespace-nowrap rounded-[4px] px-2.5 text-[0.9688rem] font-semibold transition-colors",
                  open === i || active ? "text-forest-700" : "text-ink hover:text-forest-700",
                  active && "underline decoration-earth-500 decoration-2 underline-offset-[10px]",
                )}
              >
                {s.label}
                <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-200", open === i && "rotate-180")} />
              </button>
              <div
                id={`megamenu-${i}`}
                hidden={open !== i}
                className="absolute inset-x-0 top-full border-y border-stone-200 bg-white shadow-[0_24px_40px_-24px_rgba(18,41,31,.35)]"
              >
                <div className="container-site grid grid-cols-12 gap-8 py-10">
                  <div className="col-span-4 border-r border-stone-200 pr-8">
                    <p className="font-serif text-h2 font-medium text-forest-900">{s.label}</p>
                    <p className="mt-3 text-ink-2">{s.intro}</p>
                    <Link href={s.href} className="mt-6 inline-flex items-center gap-2 font-semibold text-forest-700 hover:underline">
                      Ir a {s.label} <ArrowRight aria-hidden className="size-4" />
                    </Link>
                  </div>
                  <ul className="col-span-8 grid grid-cols-2 gap-x-8 gap-y-1">
                    {s.links.map((l) => (
                      <li key={l.label}>
                        {l.external ? (
                          <a href={l.href} target="_blank" rel="noopener noreferrer" className="group block rounded-[6px] px-3 py-2.5 hover:bg-stone-100">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-ink group-hover:text-forest-700">
                              {l.label} <ExternalLink aria-hidden className="size-3.5" />
                              <span className="sr-only">(abre sitio externo)</span>
                            </span>
                            {l.description && <span className="block text-[0.9375rem] text-muted">{l.description}</span>}
                          </a>
                        ) : (
                          <Link href={l.href} className="group block rounded-[6px] px-3 py-2.5 hover:bg-stone-100">
                            <span className="font-semibold text-ink group-hover:text-forest-700">{l.label}</span>
                            {l.description && <span className="block text-[0.9375rem] text-muted">{l.description}</span>}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
