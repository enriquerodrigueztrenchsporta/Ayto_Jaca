/**
 * Utilidades de fecha con zona horaria de Jaca (Europe/Madrid),
 * independientes de la zona horaria del servidor (los contenedores suelen ir en UTC).
 */
export const TZ = "Europe/Madrid";
const LOCALE = "es-ES";

type Parts = { year: number; month: number; day: number; hour: number; minute: number; weekday: number };

function parts(date: Date): Parts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  });
  const p = Object.fromEntries(fmt.formatToParts(date).map((x) => [x.type, x.value]));
  const weekdays: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    hour: Number(p.hour),
    minute: Number(p.minute),
    weekday: weekdays[p.weekday as string] ?? 1,
  };
}

/** Desfase (minutos) de Europe/Madrid respecto a UTC en un instante dado. */
function offsetMinutes(date: Date): number {
  const p = parts(date);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  return Math.round((asUtc - Math.floor(date.getTime() / 60000) * 60000) / 60000);
}

/** Crea un Date a partir de fecha/hora "de pared" en Jaca. */
export function madridDate(year: number, month: number, day: number, hour = 0, minute = 0): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const off = offsetMinutes(guess);
  const result = new Date(guess.getTime() - off * 60000);
  // Ajuste en cambios de horario
  const off2 = offsetMinutes(result);
  return off2 === off ? result : new Date(guess.getTime() - off2 * 60000);
}

/** Inicio del día (00:00 en Jaca) que contiene `date`. */
export function startOfDay(date: Date = new Date()): Date {
  const p = parts(date);
  return madridDate(p.year, p.month, p.day);
}

export function endOfDay(date: Date = new Date()): Date {
  const p = parts(date);
  return new Date(madridDate(p.year, p.month, p.day + 1).getTime() - 1);
}

export function addDays(date: Date, days: number): Date {
  const p = parts(date);
  return madridDate(p.year, p.month, p.day + days, p.hour, p.minute);
}

/** Lunes 00:00 de la semana que contiene `date`. */
export function startOfWeek(date: Date = new Date()): Date {
  const p = parts(date);
  return madridDate(p.year, p.month, p.day - (p.weekday - 1));
}

/** Viernes 00:00 → domingo 23:59 del fin de semana actual o próximo. */
export function weekendRange(now: Date = new Date()): { from: Date; to: Date } {
  const p = parts(now);
  const daysToFriday = p.weekday <= 5 ? 5 - p.weekday : -(p.weekday - 5);
  const friday = madridDate(p.year, p.month, p.day + daysToFriday);
  const from = p.weekday >= 5 ? startOfDay(now) : friday;
  const to = endOfDay(addDays(friday, 2));
  return { from, to };
}

/** Número de semana ISO. */
export function isoWeek(date: Date): number {
  const p = parts(date);
  const d = new Date(Date.UTC(p.year, p.month - 1, p.day));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function weekLabel(date: Date): string {
  const start = startOfWeek(date);
  const end = addDays(start, 6);
  return `Semana ${isoWeek(date)} · ${formatDate(start, "short-no-year")} – ${formatDate(end, "short")}`;
}

type DateStyle = "long" | "medium" | "short" | "short-no-year" | "weekday" | "day-month";

export function formatDate(date: Date | string | null | undefined, style: DateStyle = "medium"): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const opts: Record<DateStyle, Intl.DateTimeFormatOptions> = {
    long: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
    medium: { day: "numeric", month: "long", year: "numeric" },
    short: { day: "numeric", month: "short", year: "numeric" },
    "short-no-year": { day: "numeric", month: "short" },
    weekday: { weekday: "long" },
    "day-month": { day: "numeric", month: "long" },
  };
  return new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, ...opts[style] }).format(d).replace(/\.$/, "");
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(date);
}

export function formatDateTime(date: Date | null | undefined): string {
  if (!date) return "";
  return `${formatDate(date, "medium")}, ${formatTime(date)}`;
}

/** Partes para el bloque de fecha de las tarjetas de agenda. */
export function dateBlock(date: Date) {
  return {
    day: new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, day: "numeric" }).format(date),
    month: new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, month: "short" }).format(date).replace(".", ""),
    weekday: new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, weekday: "short" }).format(date).replace(".", ""),
  };
}

/** "YYYY-MM-DD" en hora de Jaca, para <input type="date">. */
export function toDateInput(date: Date | null | undefined): string {
  if (!date) return "";
  const p = parts(date);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

/** "YYYY-MM-DDTHH:mm" en hora de Jaca, para <input type="datetime-local">. */
export function toDateTimeInput(date: Date | null | undefined): string {
  if (!date) return "";
  const p = parts(date);
  return `${toDateInput(date)}T${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
}

/** Interpreta "YYYY-MM-DD" o "YYYY-MM-DDTHH:mm" como hora de Jaca. */
export function parseLocalInput(value: string | null | undefined, defaultTime: "start" | "end" = "start"): Date | null {
  if (!value) return null;
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  if (h !== undefined) return madridDate(+y, +mo, +d, +h, +mi);
  return defaultTime === "end" ? new Date(madridDate(+y, +mo, +d + 1).getTime() - 1000) : madridDate(+y, +mo, +d);
}

export function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / 86400000);
}
