import { isDemoMode } from "@/lib/env";

/** Aviso discreto durante la fase de propuesta. Se oculta con NEXT_PUBLIC_DEMO_MODE=false. */
export function DemoBanner() {
  if (!isDemoMode()) return null;
  return (
    <div className="bg-ink text-sand" role="note" aria-label="Aviso de demostración">
      <p className="container-site py-1.5 text-center text-sm font-medium">
        Propuesta de rediseño — demo no oficial.{" "}
        <span className="text-stone-300">
          La web oficial es{" "}
          <a href="https://www.jaca.es/" className="underline hover:text-white" rel="noopener noreferrer" target="_blank">
            jaca.es
          </a>
          .
        </span>
      </p>
    </div>
  );
}
