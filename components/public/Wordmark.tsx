import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Wordmark tipográfico. El escudo oficial NO se redibuja: el hueco `data-escudo`
 * está reservado para incorporar el archivo vectorial oficial que facilite el Ayuntamiento.
 */
export function Wordmark({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3", className)} aria-label="Ayuntamiento de Jaca, ir a la portada">
      <span
        data-escudo="pendiente-archivo-oficial"
        aria-hidden
        className={cn(
          "hidden size-11 shrink-0 place-items-center rounded-[6px] border font-serif text-xl font-semibold min-[400px]:grid",
          inverted ? "border-mist/40 text-sand" : "border-stone-300 bg-white text-forest-700",
        )}
      >
        J
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("text-[0.8125rem] font-semibold uppercase tracking-[0.12em]", inverted ? "text-mist" : "text-muted")}>Ayuntamiento de</span>
        <span className={cn("font-serif text-[1.75rem] font-semibold leading-[1.05]", inverted ? "text-snow" : "text-forest-900")}>Jaca</span>
      </span>
    </Link>
  );
}
