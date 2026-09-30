import { notFound } from "next/navigation";
import { CalendarClock, MapPin, Video } from "lucide-react";
import { PageHeader } from "@/components/public/PageHeader";
import { DocumentList } from "@/components/public/cards";
import { SourceNote } from "@/components/public/SourceNote";
import { Badge } from "@/components/ui/Badge";
import { Prose } from "@/components/ui/Prose";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSession } from "@/lib/queries/public";
import { formatDate } from "@/lib/dates";
import { SESSION_TYPE_LABEL } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const s = await getSession((await params).slug);
  if (!s) return {};
  return pageMetadata({ title: s.title, description: `${SESSION_TYPE_LABEL[s.sessionType]} del Ayuntamiento de Jaca, ${formatDate(s.date, "long")}.`, path: `/plenos/${s.slug}` });
}

export default async function SessionPage({ params }: Props) {
  const s = await getSession((await params).slug);
  if (!s) notFound();
  const upcoming = s.date > new Date();
  return (
    <>
      <PageHeader title={s.title} eyebrow={SESSION_TYPE_LABEL[s.sessionType]} crumbs={[{ label: "Plenos", href: "/plenos" }, { label: s.title }]}>
        <div className="flex flex-wrap gap-2">
          {upcoming ? <Badge tone="ok">Próxima sesión</Badge> : <Badge tone="neutral">Sesión celebrada</Badge>}
          {s.isDemo && <Badge tone="demo">Demo</Badge>}
        </div>
      </PageHeader>
      <div className="container-site grid gap-12 py-10 md:py-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <dl className="grid gap-5 sm:grid-cols-2">
            <div className="flex gap-3">
              <CalendarClock aria-hidden className="mt-0.5 size-5 text-earth" />
              <div>
                <dt className="font-semibold text-muted">Fecha y hora</dt>
                <dd>{formatDate(s.date, "long")}{s.timeText ? ` · ${s.timeText}` : ""}</dd>
              </div>
            </div>
            {s.location && (
              <div className="flex gap-3">
                <MapPin aria-hidden className="mt-0.5 size-5 text-earth" />
                <div>
                  <dt className="font-semibold text-muted">Lugar</dt>
                  <dd>{s.location}</dd>
                </div>
              </div>
            )}
          </dl>
          {s.agenda && (
            <section aria-labelledby="orden" className="mt-10">
              <h2 id="orden" className="mb-3 font-serif text-h3 font-medium">Orden del día</h2>
              <Prose markdown={s.agenda} />
            </section>
          )}
          <DocumentList docs={s.documents} title="Convocatoria y documentos" />
          <SourceNote sourceUrl={s.sourceUrl} sourceName={s.sourceName} lastVerifiedAt={s.lastVerifiedAt} />
        </div>
        {s.streamingUrl && (
          <aside className="lg:col-span-4">
            <div className="rounded-[10px] bg-forest-900 p-6 text-snow">
              <Video aria-hidden className="size-8 text-sand" />
              <p className="mt-3 font-serif text-2xl">{upcoming ? "Síguelo en directo" : "Grabación y directos"}</p>
              <p className="mt-2 text-[0.9375rem] text-stone-300">Las sesiones pueden seguirse presencialmente en el Salón de Plenos o en el canal municipal de YouTube.</p>
              <a href={s.streamingUrl} target="_blank" rel="noopener noreferrer" className="mt-5 flex min-h-12 items-center justify-center rounded-[4px] bg-sand px-5 font-semibold text-forest-900 hover:bg-snow">
                Abrir WebTV Jaca<span className="sr-only"> (abre sitio externo)</span>
              </a>
            </div>
          </aside>
        )}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: s.title,
          startDate: s.date.toISOString(),
          eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
          location: [{ "@type": "Place", name: "Salón de Plenos, Casa Consistorial", address: "Calle Mayor, 24, 22700 Jaca" }, ...(s.streamingUrl ? [{ "@type": "VirtualLocation", url: s.streamingUrl }] : [])],
          organizer: { "@type": "GovernmentOrganization", name: "Ayuntamiento de Jaca" },
        }}
      />
    </>
  );
}
