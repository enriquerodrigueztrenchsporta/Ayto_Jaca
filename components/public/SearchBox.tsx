"use client";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/cn";

type Suggestion = { type: string; label: string; title: string; url: string; external?: boolean };

type Props = {
  size?: "lg" | "md";
  placeholder?: string;
  defaultValue?: string;
  label?: string;
  hideLabel?: boolean;
  scope?: "all" | "procedures";
  autoFocus?: boolean;
  className?: string;
  tone?: "light" | "dark";
};

/**
 * Buscador con sugerencias (patrón combobox ARIA 1.2).
 * Sin JavaScript funciona como formulario GET normal hacia /buscar o /tramites.
 */
export function SearchBox({
  size = "md",
  placeholder = "Buscar un trámite, servicio, noticia o lugar…",
  defaultValue = "",
  label = "¿Qué necesitas hacer?",
  hideLabel = false,
  scope = "all",
  autoFocus,
  className,
  tone = "light",
}: Props) {
  const router = useRouter();
  const id = useId();
  const [q, setQ] = useState(defaultValue);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const action = scope === "procedures" ? "/tramites" : "/buscar";

  useEffect(() => {
    const term = q.trim();
    if (term.length < 3) return;
    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}&scope=${scope}`, { signal: ctrl.signal });
        if (res.ok) {
          const data = (await res.json()) as { suggestions: Suggestion[] };
          setItems(data.suggestions);
          setOpen(true);
          setActive(-1);
        }
      } catch {
        // Sin sugerencias: el formulario sigue funcionando.
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [q, scope]);

  const visible = open && q.trim().length >= 3 && items.length > 0;

  function go(s: Suggestion) {
    setOpen(false);
    if (s.external) window.open(s.url, "_blank", "noopener");
    else router.push(s.url);
  }

  return (
    <form
      action={action}
      role="search"
      className={cn("relative", className)}
      onSubmit={(e) => {
        if (visible && active >= 0) {
          e.preventDefault();
          go(items[active]);
        }
      }}
    >
      <label htmlFor={`${id}-input`} className={cn(hideLabel ? "sr-only" : "mb-3 block font-serif text-h3 font-medium", tone === "dark" ? "text-snow" : "text-ink")}>
        {label}
      </label>
      <div className="relative">
        <Search aria-hidden className={cn("pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted", size === "lg" ? "size-6" : "size-5")} />
        <input
          id={`${id}-input`}
          name="q"
          type="search"
          value={q}
          autoFocus={autoFocus}
          autoComplete="off"
          role="combobox"
          aria-expanded={visible}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={visible && active >= 0 ? `${id}-opt-${active}` : undefined}
          placeholder={placeholder}
          onChange={(e) => {
            setQ(e.target.value);
            if (e.target.value.trim().length < 3) setItems([]);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onFocus={() => items.length && setOpen(true)}
          onKeyDown={(e) => {
            if (!visible) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, items.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, -1));
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className={cn(
            "w-full rounded-[6px] border border-stone-300 bg-white text-ink placeholder:text-muted focus:border-forest-700",
            size === "lg" ? "h-16 pl-12 pr-28 text-base sm:pl-13 sm:pr-36 sm:text-lg" : "h-12 pl-11 pr-28 text-base",
          )}
        />
        <button
          type="submit"
          className={cn(
            "absolute right-1.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-2 rounded-[4px] bg-forest-700 font-semibold text-snow hover:bg-forest-600",
            size === "lg" ? "h-13 px-4 sm:px-5" : "h-9 px-4",
          )}
        >
          {loading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
          Buscar
        </button>
      </div>
      <ul
        id={`${id}-list`}
        role="listbox"
        aria-label="Sugerencias"
        hidden={!visible}
        className="absolute inset-x-0 top-full z-30 mt-2 max-h-96 overflow-y-auto rounded-[8px] border border-stone-200 bg-white py-2 text-left shadow-[0_24px_40px_-20px_rgba(18,41,31,.4)]"
      >
        {items.map((s, i) => (
          <li
            key={s.url + i}
            id={`${id}-opt-${i}`}
            role="option"
            aria-selected={active === i}
            onMouseDown={(e) => {
              e.preventDefault();
              go(s);
            }}
            onMouseEnter={() => setActive(i)}
            className={cn("flex cursor-pointer items-baseline gap-3 px-4 py-2.5", active === i && "bg-stone-100")}
          >
            <span className="w-24 shrink-0 text-[0.8125rem] font-semibold uppercase tracking-wide text-earth">{s.label}</span>
            <span className="text-ink">{s.title}</span>
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {visible ? `${items.length} sugerencias disponibles. Use las flechas para recorrerlas.` : ""}
      </p>
    </form>
  );
}
