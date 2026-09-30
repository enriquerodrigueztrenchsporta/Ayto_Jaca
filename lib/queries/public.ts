import { db } from "@/lib/db";
import { publishedWhere } from "@/lib/content/visibility";
import { nextOccurrence, notFinishedWhere, occursBetween } from "@/lib/content/events";
import { addDays, startOfDay, weekendRange } from "@/lib/dates";
import type { GrantStatus, JobStatus } from "@/lib/generated/prisma/enums";

const imageSelect = { select: { url: true, alt: true, width: true, height: true } } as const;
const docOrder = [{ documentDate: "desc" as const }, { title: "asc" as const }];

export const PAGE_SIZE = 12;

// ─── Avisos ────────────────────────────────────────────────
export async function listActiveAlerts({ homeOnly = false, now = new Date() } = {}) {
  const alerts = await db.alert.findMany({
    where: {
      AND: [publishedWhere(now), { startsAt: { lte: addDays(now, 7) } }, { OR: [{ endsAt: null }, { endsAt: { gte: now } }] }, homeOnly ? { showOnHome: true } : {}],
    },
    include: { area: { select: { name: true, slug: true } }, documents: { orderBy: docOrder } },
  });
  const rank = { URGENT: 0, IMPORTANT: 1, NORMAL: 2 };
  return alerts.sort((a, b) => rank[a.priority] - rank[b.priority] || a.startsAt.getTime() - b.startsAt.getTime());
}

// ─── Noticias ──────────────────────────────────────────────
export async function listNews({ category, page = 1, pageSize = PAGE_SIZE, featuredFirst = false }: { category?: string; page?: number; pageSize?: number; featuredFirst?: boolean } = {}) {
  const where = { AND: [publishedWhere(), category ? { category: { slug: category } } : {}] };
  const [items, total] = await Promise.all([
    db.news.findMany({
      where,
      orderBy: featuredFirst ? [{ featured: "desc" }, { date: "desc" }] : [{ date: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: true, image: imageSelect },
    }),
    db.news.count({ where }),
  ]);
  return { items, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export function getNews(slug: string) {
  return db.news.findFirst({
    where: { AND: [{ slug }, publishedWhere()] },
    include: { category: true, image: { select: { url: true, alt: true, width: true, height: true, credit: true, license: true } }, documents: { orderBy: docOrder } },
  });
}

export function newsCategories() {
  return db.category.findMany({ where: { scope: "NEWS", news: { some: publishedWhere() } }, orderBy: { sortOrder: "asc" } });
}

// ─── Agenda ────────────────────────────────────────────────
export type EventFilter = { category?: string; when?: "hoy" | "fin-de-semana" | "semana" | "mes" };

export async function listUpcomingEvents({ category, when }: EventFilter = {}, now = new Date()) {
  const events = await db.event.findMany({
    where: { AND: [publishedWhere(now), notFinishedWhere(now), category ? { category: { slug: category } } : {}] },
    include: { category: true, image: imageSelect },
    take: 300,
  });
  let range: { from: Date; to: Date } | null = null;
  const today = startOfDay(now);
  if (when === "hoy") range = { from: today, to: new Date(addDays(today, 1).getTime() - 1) };
  if (when === "fin-de-semana") range = weekendRange(now);
  if (when === "semana") range = { from: today, to: addDays(today, 7) };
  if (when === "mes") range = { from: today, to: addDays(today, 31) };
  return events
    .map((e) => ({ ...e, nextDate: nextOccurrence(e, now) }))
    .filter((e): e is typeof e & { nextDate: Date } => !!e.nextDate)
    .filter((e) => (range ? occursBetween(e, range.from, range.to) : true))
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime() || Number(b.featured) - Number(a.featured));
}

export function getEvent(slug: string) {
  return db.event.findFirst({
    where: { AND: [{ slug }, publishedWhere()] },
    include: { category: true, image: { select: { url: true, alt: true, width: true, height: true, credit: true } } },
  });
}

export function eventCategories() {
  return db.category.findMany({ where: { scope: "EVENT" }, orderBy: { sortOrder: "asc" } });
}

// ─── Subvenciones y empleo ─────────────────────────────────
export async function listGrants(status?: GrantStatus) {
  const grants = await db.grant.findMany({
    where: { AND: [publishedWhere(), status ? { grantStatus: status } : {}] },
    include: { area: { select: { name: true } } },
  });
  const rank = { OPEN: 0, UPCOMING: 1, CLOSED: 2, AWARDED: 3 };
  return grants.sort((a, b) => rank[a.grantStatus] - rank[b.grantStatus] || (b.deadline?.getTime() ?? 0) - (a.deadline?.getTime() ?? 0));
}

export async function grantCounts() {
  const rows = await db.grant.groupBy({ by: ["grantStatus"], where: publishedWhere(), _count: true });
  return Object.fromEntries(rows.map((r) => [r.grantStatus, r._count])) as Partial<Record<GrantStatus, number>>;
}

export function getGrant(slug: string) {
  return db.grant.findFirst({ where: { AND: [{ slug }, publishedWhere()] }, include: { area: true, documents: { orderBy: docOrder } } });
}

export async function listJobs(status?: JobStatus) {
  const jobs = await db.publicJob.findMany({ where: { AND: [publishedWhere(), status ? { jobStatus: status } : {}] } });
  const rank = { OPEN: 0, UPCOMING: 1, IN_PROGRESS: 2, CLOSED: 3 };
  return jobs.sort((a, b) => rank[a.jobStatus] - rank[b.jobStatus] || (b.deadline?.getTime() ?? 0) - (a.deadline?.getTime() ?? 0));
}

export function getJob(slug: string) {
  return db.publicJob.findFirst({ where: { AND: [{ slug }, publishedWhere()] }, include: { area: true, documents: { orderBy: docOrder } } });
}

// ─── Plenos ────────────────────────────────────────────────
export function listSessions(take = 50) {
  return db.municipalSession.findMany({ where: publishedWhere(), orderBy: { date: "desc" }, take });
}

export function getSession(slug: string) {
  return db.municipalSession.findFirst({ where: { AND: [{ slug }, publishedWhere()] }, include: { documents: { orderBy: docOrder } } });
}

// ─── Trámites ──────────────────────────────────────────────
export function procedureCategories() {
  return db.category.findMany({
    where: { scope: "PROCEDURE" },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { procedures: { where: publishedWhere() } } } },
  });
}

export function listProcedures(category?: string) {
  return db.procedure.findMany({
    where: { AND: [publishedWhere(), category ? { category: { slug: category } } : {}] },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { title: "asc" }],
    include: { category: true },
  });
}

export function featuredProcedures(take = 8) {
  return db.procedure.findMany({ where: { AND: [publishedWhere(), { featured: true }] }, orderBy: { sortOrder: "asc" }, take, include: { category: true } });
}

export function getProcedure(slug: string) {
  return db.procedure.findFirst({ where: { AND: [{ slug }, publishedWhere()] }, include: { category: true, area: true, documents: { orderBy: docOrder } } });
}

// ─── Áreas ─────────────────────────────────────────────────
export function listAreas() {
  return db.area.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}

export function getArea(slug: string) {
  return db.area.findUnique({
    where: { slug },
    include: {
      procedures: { where: publishedWhere(), orderBy: { title: "asc" }, include: { category: true } },
      pages: { where: publishedWhere(), orderBy: { sortOrder: "asc" } },
      grants: { where: publishedWhere(), take: 6 },
    },
  });
}

// ─── Páginas ───────────────────────────────────────────────
export function getPage(path: string) {
  return db.page.findFirst({
    where: { AND: [{ path }, publishedWhere()] },
    include: { image: { select: { url: true, alt: true, width: true, height: true, credit: true } }, documents: { orderBy: docOrder }, area: true },
  });
}

export function listSectionPages(section: string) {
  return db.page.findMany({ where: { AND: [{ section }, publishedWhere()] }, orderBy: [{ sortOrder: "asc" }, { title: "asc" }], include: { image: imageSelect } });
}

// ─── Documentos ────────────────────────────────────────────
export function documentCategories() {
  return db.category.findMany({ where: { scope: "DOCUMENT" }, orderBy: { sortOrder: "asc" }, include: { _count: { select: { documents: true } } } });
}

export function listDocuments(category?: string | string[]) {
  const slugs = Array.isArray(category) ? category : category ? [category] : null;
  return db.document.findMany({
    where: slugs ? { category: { slug: { in: slugs } } } : {},
    orderBy: [{ category: { sortOrder: "asc" } }, ...docOrder],
    include: { category: true },
  });
}

// ─── Destacados ────────────────────────────────────────────
export function listFeatured(kind?: "BANNER" | "HIGHLIGHT") {
  return db.featuredContent.findMany({ where: { AND: [publishedWhere(), kind ? { kind } : {}] }, orderBy: { position: "asc" }, include: { image: imageSelect } });
}

// ─── Configuración ─────────────────────────────────────────
export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await db.setting.findUnique({ where: { key } });
  return (row?.value as T) ?? fallback;
}
