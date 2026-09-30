import { cn } from "@/lib/cn";

/**
 * Aparición progresiva sutil al entrar en pantalla, solo con CSS (scroll-driven animations).
 * Mejora progresiva: sin soporte del navegador, sin JavaScript o con prefers-reduced-motion,
 * el contenido se muestra directamente. Nunca oculta contenido.
 */
export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={cn("reveal", className)} style={delay ? ({ "--reveal-delay": `${Math.round(delay * 100)}%` } as React.CSSProperties) : undefined}>
      {children}
    </div>
  );
}
