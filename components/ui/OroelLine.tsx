import { cn } from "@/lib/cn";

/** Motivo gráfico: silueta simplificada de la Peña Oroel en una sola línea. Decorativo. */
export function OroelLine({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 600 80" preserveAspectRatio="none" aria-hidden focusable="false" className={cn("block w-full", className)}>
      <path
        d="M0 72 L60 66 L110 58 L150 52 L185 30 L205 18 L250 14 L300 13 L330 16 L352 26 L372 44 L410 54 L470 60 L540 66 L600 70"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}
