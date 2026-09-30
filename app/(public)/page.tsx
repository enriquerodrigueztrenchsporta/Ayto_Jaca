import Link from "next/link";
import { ArrowRight, Gavel, HandCoins, Landmark, Scale, Video } from "lucide-react";
import { Hero } from "@/components/public/home/Hero";
import { QuickAccess } from "@/components/public/home/QuickAccess";
import { ExploreJaca } from "@/components/public/home/ExploreJaca";
import { JacaHoy } from "@/components/public/home/JacaHoy";
import { AlertItem } from "@/components/public/AlertBanner";
import { EventCard, NewsCard, ProcedureCard, SessionCard } from "@/components/public/cards";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/States";
import { FilterBar } from "@/components/ui/FilterBar";
import { Reveal } from "@/components/ui/Reveal";
import { db } from "@/lib/db";
import { publishedWhere } from "@/lib/content/visibility";
import { featuredProcedures, grantCounts, listActiveAlerts, listNews, listSessions, listUpcomingEvents, listFeatured } from "@/lib/queries/public";
import { EXTERNAL } from "@/lib/site";
import { SmartLink } from "@/components/ui/ExternalAnchor";

export default async function HomePage() {
  const [alerts, news, events, todayEvents, procedures, sessions, grants, procedureCount, highlights] = await Promise.all([
    listActiveAlerts({ homeOnly: true }),
    listNews({ pageSize: 5, featuredFirst: true }),
    listUpcomingEvents(),
    listUpcomingEvents({ when: "hoy" }),
    featuredProcedures(8),
    listSessions(1),
    grantCounts(),
    db.procedure.count({ where: publishedWhere() }),
    listFeatured("HIGHLIGHT"),
  ]);
  const [lead, ...rest] = news.items;
  const lastSession = sessions[0];
  const eventFilters = [
    { label: "Este fin de semana", slug: "@finde" },
    { label: "Cultura", slug: "cultura" },
    { label: "Deporte", slug: "deporte" },
    { label: "Turismo", slug: "turismo" },
    { label: "Juventud", slug: "juventud" },
    { label: "Participación", slug: "participacion" },
    { label: "Institucional", slug: "institucional" },
  ];

  return (
    <>
      <Hero alertCount={alerts.length} />

      {alerts.length > 0 && (
        <section aria-labelledby="avisos-title" className="border-b border-stone-200 bg-stone-100">
          <div className="container-site py-10">
            <SectionHeader eyebrow="Qué necesitas saber hoy" title="Avisos importantes" id="avisos-title" href="/avisos" linkLabel="Todos los avisos" className="mb-6" />
            <ul className="grid gap-4 lg:grid-cols-2">
              {alerts.slice(0, 4).map((a) => (
                <li key={a.id}>
                  <AlertItem alert={a} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <QuickAccess procedureCount={procedureCount} />

      <section aria-labelledby="actualidad-title" className="border-y border-stone-200 bg-white py-16 md:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader eyebrow="Qué está pasando en Jaca" title="Actualidad" id="actualidad-title" href="/actualidad/noticias" linkLabel="Todas las noticias" />
            {lead ? (
              <>
                <Reveal>
                  <article className="relative border-l-4 border-earth-500 pl-6">
                    <p className="text-[0.9375rem] text-muted">
                      {lead.category?.name} · <time dateTime={lead.date.toISOString()}>{new Intl.DateTimeFormat("es-ES", { dateStyle: "long", timeZone: "Europe/Madrid" }).format(lead.date)}</time>
                    </p>
                    <h3 className="mt-2 font-serif text-h2 font-medium leading-tight">
                      <Link href={`/actualidad/noticias/${lead.slug}`} className="hover:text-forest-700 hover:underline">
                        {lead.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-lg text-ink-2">{lead.excerpt}</p>
                  </article>
                </Reveal>
                <div className="mt-6 grid gap-x-8 md:grid-cols-2">
                  {rest.map((n) => (
                    <NewsCard key={n.id} item={n} variant="compact" />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState title="Todavía no hay noticias publicadas" />
            )}
          </div>
          <div className="lg:col-span-5">
            <JacaHoy todayEvents={todayEvents} openGrants={grants.OPEN ?? 0} openAlerts={alerts.length} />
          </div>
        </div>
      </section>

      <section aria-labelledby="agenda-title" className="py-16 md:py-20">
        <div className="container-site">
          <SectionHeader eyebrow="Próximos días" title="Agenda" id="agenda-title" href="/agenda" linkLabel="Ver toda la agenda" description="Cultura, deporte, turismo y actividad municipal." />
          <FilterBar
            label="Filtrar agenda por categoría"
            className="mb-8"
            options={eventFilters.map((f) => ({ label: f.label, href: f.slug === "@finde" ? "/agenda?cuando=fin-de-semana" : `/agenda?categoria=${f.slug}`, active: false }))}
          />
          {events.length ? (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 6).map((e, i) => (
                <li key={e.id}>
                  <Reveal delay={i * 0.04} className="h-full">
                    <EventCard item={e} />
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No hay actividades publicadas en los próximos días" action={{ href: "/agenda", label: "Ver agenda" }} />
          )}
        </div>
      </section>

      <section aria-labelledby="tramites-title" className="border-y border-stone-200 bg-stone-100 py-16 md:py-20">
        <div className="container-site">
          <SectionHeader eyebrow="Qué necesitas hacer" title="Trámites destacados" id="tramites-title" href="/tramites" linkLabel="Buscador de trámites" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {procedures.map((p) => (
              <li key={p.id}>
                <ProcedureCard item={p} />
              </li>
            ))}
          </ul>
          <p className="mt-8 flex flex-wrap items-center gap-3 text-ink-2">
            ¿No encuentras tu trámite?
            <a href={EXTERNAL.sedeCatalog} target="_blank" rel="noopener noreferrer" className="link font-semibold">
              Catálogo completo de la Sede Electrónica<span className="sr-only"> (abre sitio externo)</span>
            </a>
          </p>
        </div>
      </section>

      <ExploreJaca />

      <section aria-labelledby="ayto-title" className="py-16 md:py-20">
        <div className="container-site">
          <SectionHeader eyebrow="Tu Ayuntamiento" title="Gobierno abierto y actividad institucional" id="ayto-title" href="/ayuntamiento" linkLabel="Ir a Ayuntamiento" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">{lastSession ? <SessionCard item={lastSession} highlight /> : <EmptyState title="Sin plenos publicados" />}</div>
            <ul className="grid gap-px overflow-hidden rounded-[10px] border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:col-span-2">
              {[
                { href: "/plenos", icon: Video, title: "Plenos", text: "Convocatorias, órdenes del día y directo" },
                { href: "/convocatorias", icon: HandCoins, title: "Subvenciones", text: `${grants.OPEN ?? 0} convocatorias abiertas` },
                { href: "/transparencia", icon: Scale, title: "Transparencia", text: "Portal oficial, normativa y contratación" },
                { href: "/ayuntamiento/corporacion", icon: Landmark, title: "Corporación municipal", text: "Alcaldía, grupos y concejalías" },
                { href: "/transparencia/contratacion", icon: Gavel, title: "Perfil del contratante", text: "Licitaciones en la Plataforma del Estado" },
                { href: "/ayuntamiento/participacion", icon: ArrowRight, title: "Participación", text: "Consejos y consultas públicas" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group flex h-full items-start gap-4 bg-white p-6 hover:bg-forest-50">
                    <l.icon aria-hidden className="mt-1 size-6 shrink-0 text-earth" strokeWidth={1.6} />
                    <span>
                      <span className="block font-semibold text-ink group-hover:text-forest-700 group-hover:underline">{l.title}</span>
                      <span className="text-[0.9375rem] text-muted">{l.text}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {highlights.length > 0 && (
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {highlights.map((h) => (
                <li key={h.id} className="rounded-[10px] border border-stone-200 bg-white p-6">
                  <p className="eyebrow mb-2">Destacado</p>
                  <h3 className="font-serif text-h3 font-medium">
                    <SmartLink href={h.url} className="hover:text-forest-700 hover:underline">
                      {h.title}
                    </SmartLink>
                  </h3>
                  {h.description && <p className="mt-2 text-[0.9375rem] text-ink-2">{h.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="newsletter-title" className="border-t border-stone-200 bg-stone-100 py-16">
        <div className="container-site grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-2">Avisos por correo</p>
            <h2 id="newsletter-title" className="font-serif text-h2 font-medium">
              Entérate de cortes, obras y plazos antes que nadie
            </h2>
            <p className="mt-3 text-lg text-ink-2">Un resumen semanal con los avisos, la agenda y las convocatorias abiertas.</p>
          </div>
          <NewsletterForm tone="light" />
        </div>
      </section>
    </>
  );
}
