import Link from "next/link";
import { cn } from "@/lib/cn";

export type FilterOption = { label: string; href: string; active: boolean; count?: number };

/** Filtros como enlaces: funcionan sin JavaScript, son accesibles y compartibles. */
export function FilterBar({ label, options, className }: { label: string; options: FilterOption[]; className?: string }) {
  return (
    <nav aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((o) => (
        <Link
          key={o.href + o.label}
          href={o.href}
          aria-current={o.active ? "true" : undefined}
          scroll={false}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[0.9375rem] font-semibold transition-colors duration-200",
            o.active ? "border-forest-700 bg-forest-700 text-snow" : "border-stone-300 bg-white text-ink-2 hover:border-forest-700 hover:text-forest-700",
          )}
        >
          {o.label}
          {typeof o.count === "number" && <span className={cn("text-sm font-medium", o.active ? "text-mist" : "text-muted")}>{o.count}</span>}
        </Link>
      ))}
    </nav>
  );
}
