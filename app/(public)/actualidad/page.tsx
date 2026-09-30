import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/public/PageHeader";
import { AlertItem } from "@/components/public/AlertBanner";
import { EventCard, NewsCard, SessionCard } from "@/components/public/cards";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/States";
import { listActiveAlerts, listNews, listSessions, listUpcomingEvents, grantCounts } from "@/lib/queries/public";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Actualidad", description: "Noticias, avisos, agenda, plenos y convocatorias del Ayuntamiento de Jaca.", path: "/actualidad" });

export default async function ActualidadPage() {
  const [news, alerts, events, sessions, grants] = await Promise.all([listNews({ pageSize: 6 }), listActiveAlerts(), listUpcomingEvents(), listSessions(1), grantCounts()]);
  return (
    <>
      <PageHeader title="Actualidad" eyebrow="Qué está pasando en Jaca" intro="Todo lo que ocurre en el municipio, organizado para que encuentres lo que te afecta." crumbs={[{ label: "Actualidad" }]} />
      <div className="container-site space-y-16 py-10 md:py-14">
        <nav aria-label="Secciones de actualidad">
          <ul className="grid gap-px overflow-hidden rounded-[10px] border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { href: "/actualidad/noticias", title: "Noticias", text: `${news.total} publicadas` },
              { href: "/avisos", title: "Avisos", text: `${alerts.length} vigentes` },
              { href: "/agenda", title: "Agenda", text: `${events.length} próximas actividades` },
              { href: "/plenos", title: "Plenos", text: "Convocatorias y directo" },
              { href: "/convocatorias", title: "Convocatorias", text: `${grants.OPEN ?? 0} abiertas` },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group flex h-full items-center justify-between gap-3 bg-white p-5 hover:bg-forest-50">
                  <span>
                    <span className="block text-lg font-semibold text-ink group-hover:text-forest-700">{l.title}</span>
                    <span className="text-[0.9375rem] text-muted">{l.text}</span>
                  </span>
                  <ArrowRight aria-hidden className="size-5 text-earth" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {alerts.length > 0 && (
          <section aria-labelledby="h-avisos">
            <SectionHeader title="Avisos vigentes" id="h-avisos" href="/avisos" />
            <ul className="grid gap-4 lg:grid-cols-2">
              {alerts.slice(0, 4).map((a) => (
                <li key={a.id}><AlertItem alert={a} /></li>
              ))}
            </ul>
          </section>
        )}
        <section aria-labelledby="h-noticias">
          <SectionHeader title="Últimas noticias" id="h-noticias" href="/actualidad/noticias" />
          {news.items.length ? (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.items.map((n) => (
                <li key={n.id}><NewsCard item={n} /></li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Sin noticias" />
          )}
        </section>
        <section aria-labelledby="h-agenda" className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeader title="Próximas actividades" id="h-agenda" href="/agenda" />
            <ul className="grid gap-4 md:grid-cols-2">
              {events.slice(0, 4).map((e) => (
                <li key={e.id}><EventCard item={e} /></li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader title="Último pleno" href="/plenos" linkLabel="Todos" />
            {sessions[0] ? <SessionCard item={sessions[0]} highlight /> : <EmptyState title="Sin plenos" />}
          </div>
        </section>
      </div>
    </>
  );
}
