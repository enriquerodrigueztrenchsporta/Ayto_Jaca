import type { Recurrence } from "@/lib/generated/prisma/enums";
import { addDays, startOfDay } from "@/lib/dates";

export type EventTiming = {
  startDate: Date;
  endDate: Date | null;
  recurrence: Recurrence;
  recurrenceEnd: Date | null;
};

/**
 * Próxima fecha relevante de un evento a partir de `from`:
 *  - evento puntual o de varios días: su inicio (o `from` si ya está en curso);
 *  - evento recurrente: la siguiente repetición dentro de su periodo.
 * Devuelve null si el evento ya ha terminado.
 */
export function nextOccurrence(e: EventTiming, from: Date = new Date()): Date | null {
  const today = startOfDay(from);
  if (e.recurrence === "NONE") {
    const end = e.endDate ?? e.startDate;
    if (startOfDay(end) < today) return null;
    return e.startDate >= today ? e.startDate : today;
  }
  const limit = e.recurrenceEnd ?? addDays(today, 366);
  if (startOfDay(limit) < today) return null;
  let d = e.startDate;
  let guard = 0;
  while (startOfDay(d) < today && guard < 1000) {
    d = e.recurrence === "DAILY" ? addDays(d, 1) : e.recurrence === "WEEKLY" ? addDays(d, 7) : addMonth(d);
    guard++;
  }
  return startOfDay(d) <= startOfDay(limit) ? d : null;
}

function addMonth(d: Date): Date {
  const n = new Date(d);
  n.setUTCMonth(n.getUTCMonth() + 1);
  return n;
}

/** ¿Ocurre el evento en algún momento del intervalo [from, to]? */
export function occursBetween(e: EventTiming, from: Date, to: Date): boolean {
  const next = nextOccurrence(e, from);
  if (!next) return false;
  if (e.recurrence === "NONE") {
    const end = e.endDate ?? e.startDate;
    return e.startDate <= to && end >= startOfDay(from);
  }
  return next <= to;
}

/** Filtro Prisma para eventos que no han terminado (precalculado; se refina en memoria). */
export function notFinishedWhere(now: Date = new Date()) {
  const today = startOfDay(now);
  return {
    OR: [
      { recurrence: "NONE" as const, endDate: { gte: today } },
      { recurrence: "NONE" as const, endDate: null, startDate: { gte: today } },
      { recurrence: { not: "NONE" as const }, OR: [{ recurrenceEnd: null }, { recurrenceEnd: { gte: today } }] },
    ],
  };
}
