import { PageHeader } from "@/components/public/PageHeader";
import { EventCard } from "@/components/public/cards";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/States";
import { eventCategories, listUpcomingEvents, type EventFilter } from "@/lib/queries/public";
import { formatDate } from "@/lib/dates";
import { pageMetadata, param, type SearchParams } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Agenda", description: "Qué hacer en Jaca: cultura, deporte, turismo, juventud y actividades municipales.", path: "/agenda" });

const WHEN: Array<{ slug: NonNullable<EventFilter["when"]>; label: string }> = [
  { slug: "hoy", label: "Hoy" },
  { slug: "fin-de-semana", label: "Este fin de semana" },
  { slug: "semana", label: "Próximos 7 días" },
  { slug: "mes", label: "Próximos 30 días" },
];

export default async function AgendaPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const categoria = param(sp, "categoria");
  const cuando = WHEN.find((w) => w.slug === param(sp, "cuando"))?.slug;
  const [cats, events] = await Promise.all([eventCategories(), listUpcomingEvents({ category: categoria, when: cuando })]);
  const qs = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams(Object.entries({ categoria, cuando, ...next }).filter(([, v]) => v) as [string, string][]);
    const s = params.toString();
    return s ? `/agenda?${s}` : "/agenda";
  };

  // Agrupar por mes para facilitar la lectura
  const groups = new Map<string, typeof events>();
  for (const e of events) {
    const key = formatDate(e.nextDate, "medium").replace(/^\d+ de /, "");
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }

  return (
    <>
      <PageHeader title="Agenda" eyebrow="Qué hacer en Jaca" intro="Toda la actividad cultural, deportiva, turística y municipal en un único calendario." crumbs={[{ label: "Actualidad", href: "/actualidad" }, { label: "Agenda" }]} />
      <div className="container-site py-10 md:py-14">
        <div className="mb-8 space-y-4">
          <FilterBar label="Cuándo" options={[{ label: "Todas las fechas", href: qs({ cuando: undefined }), active: !cuando }, ...WHEN.map((w) => ({ label: w.label, href: qs({ cuando: w.slug }), active: cuando === w.slug }))]} />
          <FilterBar label="Categoría" options={[{ label: "Todas", href: qs({ categoria: undefined }), active: !categoria }, ...cats.map((c) => ({ label: c.name, href: qs({ categoria: c.slug }), active: categoria === c.slug }))]} />
        </div>
        <p className="mb-6 text-ink-2" role="status">
          {events.length} {events.length === 1 ? "actividad" : "actividades"}
        </p>
        {events.length ? (
          <div className="space-y-12">
            {[...groups.entries()].map(([month, items]) => (
              <section key={month} aria-labelledby={`m-${month}`}>
                <h2 id={`m-${month}`} className="mb-4 font-serif text-h3 font-medium first-letter:uppercase">
                  {month}
                </h2>
                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((e) => (
                    <li key={e.id}>
                      <EventCard item={e} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState title="No hay actividades publicadas con estos filtros" description="Prueba con otras fechas o categorías." action={{ href: "/agenda", label: "Ver toda la agenda" }} />
        )}
        <p className="mt-12 text-[0.9375rem] text-muted">
          Más propuestas en <a className="link" href="https://visitjaca.es/" target="_blank" rel="noopener noreferrer">visitjaca.es</a> y en el{" "}
          <a className="link" href="https://www.deportesjaca.es/" target="_blank" rel="noopener noreferrer">Servicio Municipal de Deportes</a>.
        </p>
      </div>
    </>
  );
}
