import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarClock, Euro, ExternalLink, MapPin, Repeat, Ticket, Users } from "lucide-react";
import { PageHeader } from "@/components/public/PageHeader";
import { SourceNote } from "@/components/public/SourceNote";
import { Badge } from "@/components/ui/Badge";
import { Prose } from "@/components/ui/Prose";
import { JsonLd } from "@/components/ui/JsonLd";
import { getEvent } from "@/lib/queries/public";
import { nextOccurrence } from "@/lib/content/events";
import { formatDate } from "@/lib/dates";
import { RECURRENCE_LABEL } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/env";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const e = await getEvent((await params).slug);
  if (!e) return {};
  return pageMetadata({ title: e.title, description: e.description.slice(0, 160), path: `/agenda/${e.slug}` });
}

export default async function EventPage({ params }: Props) {
  const e = await getEvent((await params).slug);
  if (!e) notFound();
  const next = nextOccurrence(e);
  const osm = e.location ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${e.address ?? e.location}, Jaca`)}` : null;
  const dateText =
    e.recurrence !== "NONE"
      ? `${RECURRENCE_LABEL[e.recurrence]}${next ? ` · próxima: ${formatDate(next, "long")}` : ""}`
      : e.endDate && formatDate(e.endDate, "short") !== formatDate(e.startDate, "short")
        ? `Del ${formatDate(e.startDate, "long")} al ${formatDate(e.endDate, "long")}`
        : formatDate(e.startDate, "long");

  const facts = [
    { icon: e.recurrence !== "NONE" ? Repeat : CalendarClock, label: "Cuándo", value: `${dateText}${e.timeText ? ` · ${e.timeText}` : ""}` },
    e.location && { icon: MapPin, label: "Dónde", value: [e.location, e.address].filter(Boolean).join(" · ") },
    e.organizer && { icon: Users, label: "Organiza", value: e.organizer },
    e.price && { icon: Euro, label: "Precio", value: e.price },
  ].filter(Boolean) as Array<{ icon: typeof MapPin; label: string; value: string }>;

  return (
    <>
      <PageHeader title={e.title} eyebrow={e.category?.name ?? "Agenda"} crumbs={[{ label: "Agenda", href: "/agenda" }, { label: e.title }]}>
        {e.isDemo && <Badge tone="demo">Evento de demostración</Badge>}
      </PageHeader>
      <div className="container-site grid gap-12 py-10 md:py-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {e.image && (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[10px]">
              <Image src={e.image.url} alt={e.imageAlt ?? e.image.alt} fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
            </div>
          )}
          <Prose markdown={e.description} />
          <SourceNote sourceUrl={e.sourceUrl} sourceName={e.sourceName} lastVerifiedAt={e.lastVerifiedAt} />
        </div>
        <aside className="lg:col-span-5">
          <dl className="space-y-5 rounded-[10px] border border-stone-200 bg-white p-6">
            {facts.map((f) => (
              <div key={f.label} className="flex gap-3">
                <f.icon aria-hidden className="mt-0.5 size-5 shrink-0 text-earth" />
                <div>
                  <dt className="text-[0.9375rem] font-semibold text-muted">{f.label}</dt>
                  <dd className="text-ink">{f.value}</dd>
                </div>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap gap-3">
            {e.bookingUrl && (
              <a href={e.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-forest-700 px-5 font-semibold text-snow hover:bg-forest-600">
                <Ticket aria-hidden className="size-5" /> Reservas / entradas <span className="sr-only">(abre sitio externo)</span>
              </a>
            )}
            {e.url && (
              <a href={e.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-[4px] border-[1.5px] border-forest-700 px-5 font-semibold text-forest-700 hover:bg-forest-50">
                Más información <ExternalLink aria-hidden className="size-4" /><span className="sr-only">(abre sitio externo)</span>
              </a>
            )}
            {osm && (
              <a href={osm} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-[4px] px-3 font-semibold text-forest-700 underline underline-offset-4">
                <MapPin aria-hidden className="size-4" /> Ver en OpenStreetMap<span className="sr-only"> (abre sitio externo)</span>
              </a>
            )}
          </div>
        </aside>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: e.title,
          description: e.description,
          startDate: (next ?? e.startDate).toISOString(),
          ...(e.endDate ? { endDate: e.endDate.toISOString() } : {}),
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: { "@type": "Place", name: e.location ?? "Jaca", address: { "@type": "PostalAddress", addressLocality: "Jaca", addressRegion: "Huesca", addressCountry: "ES", ...(e.address ? { streetAddress: e.address } : {}) } },
          ...(e.organizer ? { organizer: { "@type": "Organization", name: e.organizer } } : {}),
          url: `${siteUrl()}/agenda/${e.slug}`,
        }}
      />
    </>
  );
}
