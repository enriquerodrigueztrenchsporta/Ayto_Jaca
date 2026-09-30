import { db } from "@/lib/db";
import { startOfDay } from "@/lib/dates";

export type LifecycleResult = {
  scheduledToPublished: number;
  expiredArchived: number;
  alertsArchived: number;
  eventsArchived: number;
};

const MODELS = ["news", "event", "alert", "grant", "publicJob", "municipalSession", "procedure", "page", "featuredContent"] as const;

/**
 * Tarea de mantenimiento automático del contenido:
 *  1. Programado cuya fecha ha llegado → Publicado.
 *  2. Publicado con fecha de caducidad pasada → Archivado (nunca se borra).
 *  3. Avisos cuya fecha de fin ha pasado → Archivados.
 *  4. Eventos ya celebrados (sin recurrencia vigente) → Archivados.
 *
 * Se ejecuta desde /api/cron/lifecycle (cron del servidor) y al abrir el panel de administración.
 */
export async function runLifecycle(now: Date = new Date()): Promise<LifecycleResult> {
  let scheduledToPublished = 0;
  let expiredArchived = 0;

  for (const model of MODELS) {
    // Prisma no permite indexar delegados de forma tipada; todos comparten estos campos.
    const delegate = db[model] as unknown as {
      updateMany(args: unknown): Promise<{ count: number }>;
    };
    const published = await delegate.updateMany({
      where: { status: "SCHEDULED", publishAt: { lte: now }, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
      data: { status: "PUBLISHED" },
    });
    const archived = await delegate.updateMany({
      where: { status: { in: ["PUBLISHED", "SCHEDULED"] }, expiresAt: { lte: now } },
      data: { status: "ARCHIVED" },
    });
    scheduledToPublished += published.count;
    expiredArchived += archived.count;
  }

  const alerts = await db.alert.updateMany({
    where: { status: { in: ["PUBLISHED", "SCHEDULED"] }, endsAt: { lt: now } },
    data: { status: "ARCHIVED" },
  });

  const today = startOfDay(now);
  const events = await db.event.updateMany({
    where: {
      status: { in: ["PUBLISHED", "SCHEDULED"] },
      OR: [
        { recurrence: "NONE", endDate: { lt: today } },
        { recurrence: "NONE", endDate: null, startDate: { lt: today } },
        { recurrence: { not: "NONE" }, recurrenceEnd: { lt: today } },
      ],
    },
    data: { status: "ARCHIVED" },
  });

  return { scheduledToPublished, expiredArchived, alertsArchived: alerts.count, eventsArchived: events.count };
}
