import { notFound } from "next/navigation";
import { AlertItem } from "@/components/public/AlertBanner";
import { EventCard, GrantCard, JobCard, NewsCard, SessionCard } from "@/components/public/cards";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/States";
import { db } from "@/lib/db";

/** Previsualización de todo lo preparado en una actualización semanal (borradores incluidos). */
export default async function PreviewWeekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const weekly = await db.weeklyUpdate.findUnique({
    where: { id },
    include: {
      alerts: { include: { area: true }, orderBy: { startsAt: "asc" } },
      news: { include: { category: true, image: true }, orderBy: { date: "desc" } },
      events: { include: { category: true }, orderBy: { startDate: "asc" } },
      grants: true,
      jobs: true,
      sessions: { orderBy: { date: "asc" } },
    },
  });
  if (!weekly) notFound();
  const empty = !weekly.alerts.length && !weekly.news.length && !weekly.events.length && !weekly.grants.length && !weekly.jobs.length && !weekly.sessions.length;

  return (
    <div className="container-site space-y-14 py-10">
      <div>
        <p className="eyebrow">Vista previa de la actualización semanal</p>
        <h1 className="mt-2 font-serif text-h1 font-medium text-forest-900">{weekly.weekLabel}</h1>
      </div>
      {empty && <EmptyState title="Todavía no hay contenidos en esta actualización" description="Añade elementos en el formulario y pulsa «Guardar borrador»." />}
      {weekly.alerts.length > 0 && (
        <section>
          <SectionHeader title="Avisos" />
          <ul className="grid gap-4 lg:grid-cols-2">{weekly.alerts.map((a) => <li key={a.id}><AlertItem alert={a} detailed /></li>)}</ul>
        </section>
      )}
      {weekly.news.length > 0 && (
        <section>
          <SectionHeader title="Noticias" />
          <ul className="grid gap-6 md:grid-cols-3">{weekly.news.map((n) => <li key={n.id}><NewsCard item={n} /></li>)}</ul>
        </section>
      )}
      {weekly.events.length > 0 && (
        <section>
          <SectionHeader title="Agenda" />
          <ul className="grid gap-4 md:grid-cols-3">{weekly.events.map((e) => <li key={e.id}><EventCard item={e} /></li>)}</ul>
        </section>
      )}
      {(weekly.grants.length > 0 || weekly.jobs.length > 0) && (
        <section>
          <SectionHeader title="Convocatorias y empleo" />
          <ul className="grid gap-4 md:grid-cols-3">
            {weekly.grants.map((g) => <li key={g.id}><GrantCard item={g} /></li>)}
            {weekly.jobs.map((j) => <li key={j.id}><JobCard item={j} /></li>)}
          </ul>
        </section>
      )}
      {weekly.sessions.length > 0 && (
        <section>
          <SectionHeader title="Plenos" />
          <ul className="grid gap-4 md:grid-cols-3">{weekly.sessions.map((s) => <li key={s.id}><SessionCard item={s} /></li>)}</ul>
        </section>
      )}
    </div>
  );
}
