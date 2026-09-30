import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { statusOnPublish } from "@/lib/content/visibility";
import { parseLocalInput, startOfWeek } from "@/lib/dates";
import { saveItem, ValidationError, type Actor } from "@/lib/admin/service";
import type { Prisma } from "@/lib/generated/prisma/client";
import { CHECKLIST, emptyPayload, newItem, WEEKLY_COLLECTIONS, type WeeklyCollection, type WeeklyItem, type WeeklyPayload } from "./shared";

export * from "./shared";

export async function createWeeklyUpdate(actor: Actor, date: Date = new Date()) {
  const payload = emptyPayload(date);
  const w = await db.weeklyUpdate.create({
    data: {
      weekStart: startOfWeek(date),
      weekLabel: payload.week.weekLabel,
      updateDate: date,
      payload: payload as unknown as Prisma.InputJsonValue,
      checklist: {},
      createdById: actor.id,
    },
  });
  await audit({ action: "WEEKLY_SAVE", entityType: "WeeklyUpdate", entityId: w.id, entityTitle: w.weekLabel, user: actor, details: { created: true } });
  return w;
}

/**
 * Guarda el borrador: cada elemento se valida y se guarda como contenido real en estado BORRADOR
 * vinculado a esta actualización. Así el borrador sobrevive, aparece en los listados y puede previsualizarse.
 */
export async function saveWeeklyDraft(weeklyId: string, payload: WeeklyPayload, actor: Actor) {
  const weekly = await db.weeklyUpdate.findUnique({ where: { id: weeklyId } });
  if (!weekly) throw new Error("Actualización semanal no encontrada");
  if (weekly.status === "PUBLISHED") throw new Error("Esta actualización ya se publicó. Crea una nueva o edita el contenido desde su sección.");

  const issues: Record<string, string> = {};
  const next: WeeklyPayload = { ...payload };
  const keptIds = new Set<string>();

  for (const collection of Object.keys(WEEKLY_COLLECTIONS) as WeeklyCollection[]) {
    const items = payload[collection] ?? [];
    const saved: WeeklyItem[] = [];
    for (const [index, item] of items.entries()) {
      const { id, ...values } = item;
      const base = newItem(collection);
      try {
        const row = await saveItem({ resourceKey: WEEKLY_COLLECTIONS[collection], id: id ?? null, values: { ...base, ...values }, intent: "draft", actor, weeklyUpdateId: weeklyId });
        keptIds.add(String(row.id));
        saved.push({ ...item, id: String(row.id) });
      } catch (err) {
        if (err instanceof ValidationError) {
          for (const [k, msg] of Object.entries(err.issues)) issues[`${collection}.${index}.${k}`] = msg;
          saved.push(item);
        } else throw err;
      }
    }
    next[collection] = saved;
  }

  // Borradores eliminados del formulario → se eliminan (nunca se borra contenido publicado).
  const models = ["news", "event", "alert", "grant", "publicJob", "municipalSession"] as const;
  for (const m of models) {
    const d = db[m] as unknown as { deleteMany(a: unknown): Promise<unknown> };
    await d.deleteMany({ where: { weeklyUpdateId: weeklyId, status: "DRAFT", id: { notIn: [...keptIds] } } });
  }

  const updateDate = parseLocalInput(payload.week.updateDate) ?? weekly.updateDate;
  await db.weeklyUpdate.update({
    where: { id: weeklyId },
    data: {
      payload: next as unknown as Prisma.InputJsonValue,
      notes: payload.week.notes || null,
      weekLabel: payload.week.weekLabel || weekly.weekLabel,
      updateDate,
      weekStart: startOfWeek(updateDate),
    },
  });
  await audit({ action: "WEEKLY_SAVE", entityType: "WeeklyUpdate", entityId: weeklyId, entityTitle: payload.week.weekLabel, user: actor });
  if (Object.keys(issues).length) throw new ValidationError(issues);
  return next;
}

export async function weeklySummary(weeklyId: string) {
  const where = { weeklyUpdateId: weeklyId };
  const [news, events, alerts, grants, jobs, sessions] = await Promise.all([
    db.news.count({ where }),
    db.event.count({ where }),
    db.alert.count({ where }),
    db.grant.count({ where }),
    db.publicJob.count({ where }),
    db.municipalSession.count({ where }),
  ]);
  return { news, events, alerts, grants, jobs, sessions };
}

/** Publica todo lo preparado en la actualización semanal (respetando fechas programadas). */
export async function publishWeekly(weeklyId: string, actor: Actor) {
  const weekly = await db.weeklyUpdate.findUnique({ where: { id: weeklyId } });
  if (!weekly) throw new Error("Actualización semanal no encontrada");
  if (weekly.status === "PUBLISHED") throw new Error("Esta actualización ya se publicó.");
  const now = new Date();
  const where = { weeklyUpdateId: weeklyId, status: "DRAFT" as const };

  const models = ["news", "event", "alert", "grant", "publicJob", "municipalSession"] as const;
  for (const m of models) {
    const d = db[m] as unknown as {
      findMany(a: unknown): Promise<Array<{ id: string; publishAt: Date | null }>>;
      update(a: unknown): Promise<unknown>;
    };
    const drafts = await d.findMany({ where, select: { id: true, publishAt: true } });
    for (const item of drafts) await d.update({ where: { id: item.id }, data: { status: statusOnPublish(item.publishAt, now) } });
  }

  const payload = weekly.payload as unknown as WeeklyPayload | null;
  const featured = payload?.featured ?? { news: {}, events: {}, alerts: {} };
  for (const [id, on] of Object.entries(featured.news ?? {})) await db.news.updateMany({ where: { id }, data: { featured: on } });
  for (const [id, on] of Object.entries(featured.events ?? {})) await db.event.updateMany({ where: { id }, data: { featured: on } });
  for (const [id, on] of Object.entries(featured.alerts ?? {})) await db.alert.updateMany({ where: { id }, data: { showOnHome: on } });

  const counts = await weeklySummary(weeklyId);
  await db.weeklyUpdate.update({ where: { id: weeklyId }, data: { status: "PUBLISHED", publishedAt: now } });
  await audit({ action: "WEEKLY_PUBLISH", entityType: "WeeklyUpdate", entityId: weeklyId, entityTitle: weekly.weekLabel, user: actor, details: counts });
  return counts;
}

export async function saveChecklist(weeklyId: string, checklist: Record<string, boolean>) {
  const clean = Object.fromEntries(CHECKLIST.map((k) => [k, Boolean(checklist[k])]));
  await db.weeklyUpdate.update({ where: { id: weeklyId }, data: { checklist: clean } });
  return clean;
}
