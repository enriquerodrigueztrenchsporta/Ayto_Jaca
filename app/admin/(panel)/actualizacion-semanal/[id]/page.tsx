import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { loadLookups } from "@/lib/admin/lookups";
import { publishedWhere } from "@/lib/content/visibility";
import { emptyPayload, type WeeklyPayload } from "@/lib/weekly/service";
import { WeeklyWizard } from "@/components/admin/weekly/WeeklyWizard";
import { WeeklyChecklist } from "@/components/admin/weekly/WeeklyChecklist";

export const metadata = { title: "Actualización semanal" };

export default async function WeeklyEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const weekly = await db.weeklyUpdate.findUnique({ where: { id } });
  if (!weekly) notFound();
  const now = new Date();
  const [lookups, news, events, alerts] = await Promise.all([
    loadLookups(),
    db.news.findMany({ where: { AND: [publishedWhere(now), { OR: [{ weeklyUpdateId: null }, { NOT: { weeklyUpdateId: id } }] }] }, orderBy: { date: "desc" }, take: 8, select: { id: true, title: true, featured: true } }),
    db.event.findMany({ where: { AND: [publishedWhere(now), { OR: [{ weeklyUpdateId: null }, { NOT: { weeklyUpdateId: id } }] }] }, orderBy: { startDate: "asc" }, take: 8, select: { id: true, title: true, featured: true } }),
    db.alert.findMany({ where: { AND: [publishedWhere(now), { OR: [{ endsAt: null }, { endsAt: { gte: now } }] }, { OR: [{ weeklyUpdateId: null }, { NOT: { weeklyUpdateId: id } }] }] }, take: 8, select: { id: true, title: true, showOnHome: true } }),
  ]);
  const stored = (weekly.payload as unknown as WeeklyPayload | null) ?? emptyPayload(weekly.updateDate);
  // Estado actual de destacados de contenidos ya publicados como valor inicial del paso 9.
  const featured = {
    news: Object.fromEntries(news.map((n) => [n.id, stored.featured?.news?.[n.id] ?? n.featured])),
    events: Object.fromEntries(events.map((e) => [e.id, stored.featured?.events?.[e.id] ?? e.featured])),
    alerts: Object.fromEntries(alerts.map((a) => [a.id, stored.featured?.alerts?.[a.id] ?? a.showOnHome])),
  };
  const initial: WeeklyPayload = { ...emptyPayload(weekly.updateDate), ...stored, featured };

  return (
    <div>
      <Link href="/admin/actualizacion-semanal" className="mb-4 inline-flex items-center gap-1.5 font-semibold text-forest-700 hover:underline">
        <ArrowLeft aria-hidden className="size-4" /> Actualizaciones semanales
      </Link>
      <h1 className="mb-8 font-serif text-h1 font-medium text-forest-900">{weekly.weekLabel}</h1>
      <WeeklyWizard
        weeklyId={id}
        initial={initial}
        lookups={lookups}
        locked={weekly.status === "PUBLISHED"}
        candidates={{
          news: news.map((n) => ({ id: n.id, title: n.title, featured: n.featured })),
          events: events.map((e) => ({ id: e.id, title: e.title, featured: e.featured })),
          alerts: alerts.map((a) => ({ id: a.id, title: a.title, featured: a.showOnHome })),
        }}
        checklist={<WeeklyChecklist weeklyId={id} initial={(weekly.checklist ?? {}) as Record<string, boolean>} />}
      />
    </div>
  );
}
