import { toDateTimeInput, weekLabel as buildWeekLabel } from "@/lib/dates";
import { emptyValues, type FormValues } from "@/lib/admin/schema";
import { RESOURCES } from "@/lib/admin/resources";

/** Parte del formulario semanal compartida entre cliente y servidor (sin acceso a base de datos). */
/** Colecciones del formulario semanal y el tipo de contenido que generan. */
export const WEEKLY_COLLECTIONS = {
  alerts: "avisos",
  news: "noticias",
  events: "agenda",
  grants: "convocatorias",
  jobs: "empleo",
  sessions: "plenos",
  mobility: "avisos",
} as const;
export type WeeklyCollection = keyof typeof WEEKLY_COLLECTIONS;

export type WeeklyItem = FormValues & { id?: string };
export type FeaturedSelection = { news: Record<string, boolean>; events: Record<string, boolean>; alerts: Record<string, boolean> };

export type WeeklyPayload = {
  week: { updateDate: string; weekLabel: string; notes: string };
  alerts: WeeklyItem[];
  news: WeeklyItem[];
  events: WeeklyItem[];
  grants: WeeklyItem[];
  jobs: WeeklyItem[];
  sessions: WeeklyItem[];
  mobility: WeeklyItem[];
  featured: FeaturedSelection;
};

export const CHECKLIST = [
  "Revisar avisos activos",
  "Retirar avisos caducados",
  "Añadir noticias",
  "Revisar agenda próximos 14 días",
  "Actualizar subvenciones y convocatorias",
  "Revisar empleo público",
  "Revisar plenos",
  "Revisar cortes / obras / movilidad",
  "Actualizar destacados",
  "Verificar enlaces rotos relevantes",
  "Previsualizar",
  "Publicar",
] as const;

export function emptyPayload(date: Date = new Date()): WeeklyPayload {
  const y = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(date);
  return {
    week: { updateDate: y, weekLabel: buildWeekLabel(date), notes: "" },
    alerts: [], news: [], events: [], grants: [], jobs: [], sessions: [], mobility: [],
    featured: { news: {}, events: {}, alerts: {} },
  };
}

/** Valores por defecto de un elemento nuevo de cada colección. */
export function newItem(collection: WeeklyCollection): WeeklyItem {
  const v = emptyValues(RESOURCES[WEEKLY_COLLECTIONS[collection]]);
  if (collection === "mobility") {
    v.kind = "MOVILIDAD";
    v.priority = "IMPORTANT";
  }
  const now = toDateTimeInput(new Date());
  if (collection === "news") v.date = now;
  if (collection === "alerts" || collection === "mobility") v.startsAt = now;
  if (collection === "sessions") v.location = "Salón de Plenos · Casa Consistorial, Calle Mayor, 24";
  if (collection === "grants") v.grantStatus = "OPEN";
  if (collection === "jobs") v.jobStatus = "OPEN";
  return v;
}

