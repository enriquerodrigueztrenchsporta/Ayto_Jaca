import { db } from "@/lib/db";
import { publishedWhere } from "@/lib/content/visibility";
import { addDays, startOfWeek } from "@/lib/dates";
import { listActiveAlerts, listUpcomingEvents } from "@/lib/queries/public";

export const VERIFY_DAYS = 90;

/** Indicadores del resumen semanal del panel. */
export async function weekStats(now: Date = new Date()) {
  const weekStart = startOfWeek(now);
  const in7 = addDays(now, 7);
  const in14 = addDays(now, 14);
  const staleBefore = new Date(now.getTime() - VERIFY_DAYS * 86400000);
  const draft = { status: "DRAFT" as const };
  const expiring = { expiresAt: { gte: now, lte: in7 } };

  const [alerts, events, newsThisWeek, openGrants, drafts, staleCounts, expiringCounts] = await Promise.all([
    listActiveAlerts({ now }),
    listUpcomingEvents({}, now),
    db.news.count({ where: { AND: [publishedWhere(now), { date: { gte: weekStart } }] } }),
    db.grant.count({ where: { AND: [publishedWhere(now), { grantStatus: "OPEN" }] } }),
    Promise.all([db.news.count({ where: draft }), db.event.count({ where: draft }), db.alert.count({ where: draft }), db.grant.count({ where: draft }), db.publicJob.count({ where: draft }), db.municipalSession.count({ where: draft }), db.procedure.count({ where: draft }), db.page.count({ where: draft })]),
    Promise.all([
      db.procedure.count({ where: { OR: [{ lastVerifiedAt: null }, { lastVerifiedAt: { lt: staleBefore } }], status: { not: "ARCHIVED" } } }),
      db.area.count({ where: { OR: [{ lastVerifiedAt: null }, { lastVerifiedAt: { lt: staleBefore } }] } }),
      db.grant.count({ where: { OR: [{ lastVerifiedAt: null }, { lastVerifiedAt: { lt: staleBefore } }], status: { in: ["PUBLISHED", "SCHEDULED"] } } }),
      db.page.count({ where: { OR: [{ lastVerifiedAt: null }, { lastVerifiedAt: { lt: staleBefore } }], status: { in: ["PUBLISHED", "SCHEDULED"] } } }),
    ]),
    Promise.all([
      db.alert.count({ where: { AND: [publishedWhere(now), { OR: [{ endsAt: { gte: now, lte: in7 } }, expiring] }] } }),
      db.grant.count({ where: { AND: [publishedWhere(now), { OR: [{ deadline: { gte: now, lte: in7 } }, expiring] }] } }),
      db.publicJob.count({ where: { AND: [publishedWhere(now), { OR: [{ deadline: { gte: now, lte: in7 } }, expiring] }] } }),
      db.news.count({ where: { AND: [publishedWhere(now), expiring] } }),
      db.event.count({ where: { AND: [publishedWhere(now), expiring] } }),
    ]),
  ]);

  const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
  return {
    activeAlerts: alerts.length,
    newsThisWeek,
    upcomingEvents: events.filter((e) => e.nextDate <= in14).length,
    openGrants,
    pendingReview: sum(drafts) + sum(staleCounts),
    drafts: sum(drafts),
    stale: sum(staleCounts),
    expiringThisWeek: sum(expiringCounts),
  };
}

/** Elementos cuya verificación supera el umbral (aviso "no se verifica desde hace 90 días"). */
export async function staleItems(now: Date = new Date(), take = 12) {
  const before = new Date(now.getTime() - VERIFY_DAYS * 86400000);
  const cond = { OR: [{ lastVerifiedAt: null }, { lastVerifiedAt: { lt: before } }] };
  const [procedures, areas, grants] = await Promise.all([
    db.procedure.findMany({ where: { ...cond, status: { not: "ARCHIVED" } }, select: { id: true, title: true, lastVerifiedAt: true }, take }),
    db.area.findMany({ where: cond, select: { id: true, name: true, lastVerifiedAt: true }, take }),
    db.grant.findMany({ where: { ...cond, status: { in: ["PUBLISHED", "SCHEDULED"] } }, select: { id: true, title: true, lastVerifiedAt: true }, take }),
  ]);
  return [
    ...procedures.map((p) => ({ href: `/admin/tramites/${p.id}`, title: p.title, type: "Trámite", lastVerifiedAt: p.lastVerifiedAt })),
    ...areas.map((a) => ({ href: `/admin/areas/${a.id}`, title: a.name, type: "Contacto", lastVerifiedAt: a.lastVerifiedAt })),
    ...grants.map((g) => ({ href: `/admin/convocatorias/${g.id}`, title: g.title, type: "Subvención", lastVerifiedAt: g.lastVerifiedAt })),
  ].slice(0, take);
}
