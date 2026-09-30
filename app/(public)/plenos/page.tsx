import { Video } from "lucide-react";
import { PageHeader } from "@/components/public/PageHeader";
import { SessionCard } from "@/components/public/cards";
import { EmptyState } from "@/components/ui/States";
import { listSessions } from "@/lib/queries/public";
import { pageMetadata } from "@/lib/seo";
import { EXTERNAL } from "@/lib/site";

export const metadata = pageMetadata({ title: "Plenos", description: "Sesiones del Pleno del Ayuntamiento de Jaca: convocatorias, órdenes del día, documentos y retransmisión en directo.", path: "/plenos" });

export default async function SessionsPage() {
  const sessions = await listSessions(60);
  const [latest, ...rest] = sessions;
  const byYear = new Map<number, typeof rest>();
  for (const s of rest) {
    const y = Number(new Intl.DateTimeFormat("es-ES", { year: "numeric", timeZone: "Europe/Madrid" }).format(s.date));
    byYear.set(y, [...(byYear.get(y) ?? []), s]);
  }
  return (
    <>
      <PageHeader
        title="Plenos"
        eyebrow="Actividad institucional"
        intro="El Pleno ordinario se celebra con carácter mensual. Puedes seguirlo en directo y consultar la convocatoria y el orden del día."
        crumbs={[{ label: "Actualidad", href: "/actualidad" }, { label: "Plenos" }]}
      >
        <a href={EXTERNAL.plenosStreaming} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-forest-700 px-5 font-semibold text-snow hover:bg-forest-600">
          <Video aria-hidden className="size-5" /> Plenos en directo (YouTube)<span className="sr-only"> (abre sitio externo)</span>
        </a>
      </PageHeader>
      <div className="container-site py-10 md:py-14">
        {latest ? (
          <>
            <h2 className="mb-4 font-serif text-h3 font-medium">Último pleno</h2>
            <div className="max-w-xl">
              <SessionCard item={latest} highlight />
            </div>
            {[...byYear.entries()].map(([year, items]) => (
              <section key={year} aria-labelledby={`y-${year}`} className="mt-12">
                <h2 id={`y-${year}`} className="mb-4 font-serif text-h3 font-medium">{year}</h2>
                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((s) => (
                    <li key={s.id}>
                      <SessionCard item={s} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        ) : (
          <EmptyState title="Todavía no hay plenos publicados" />
        )}
        <p className="mt-12 text-[0.9375rem] text-muted">
          Las actas y acuerdos se publican en el{" "}
          <a href={EXTERNAL.transparency} target="_blank" rel="noopener noreferrer" className="link">Portal de Transparencia</a> y en el{" "}
          <a href={EXTERNAL.tablon} target="_blank" rel="noopener noreferrer" className="link">tablón de anuncios de la Sede</a>.
        </p>
      </div>
    </>
  );
}
