import { RESOURCES, type Field } from "@/lib/admin/resources";
import type { WeeklyCollection } from "./shared";

/** Campos que se piden en cada paso del formulario semanal (subconjunto del recurso completo). */
const pick = (resource: keyof typeof RESOURCES, names: string[], overrides: Record<string, Partial<Field>> = {}): Field[] =>
  names.map((n) => {
    const f = RESOURCES[resource].fields.find((x) => x.name === n);
    if (!f) throw new Error(`Campo ${n} no existe en ${resource}`);
    return { ...f, group: undefined, ...(overrides[n] ?? {}) };
  });

export type CollectionStep = {
  kind: "collection";
  id: string;
  title: string;
  description: string;
  collection: WeeklyCollection;
  itemLabel: string;
  addLabel: string;
  fields: Field[];
};
export type Step = { kind: "week" | "featured" | "review"; id: string; title: string; description: string } | CollectionStep;

export const STEPS: Step[] = [
  { kind: "week", id: "semana", title: "Semana", description: "Fecha de la actualización y notas internas (no se publican)." },
  {
    kind: "collection", id: "avisos", title: "Avisos", collection: "alerts", itemLabel: "Aviso", addLabel: "Añadir aviso",
    description: "Cortes, cierres, plazos, alertas o cambios de servicio. Desaparecen solos en su fecha de fin.",
    fields: pick("avisos", ["title", "summary", "body", "priority", "kind", "startsAt", "endsAt", "url", "areaId", "showOnHome"], { body: { label: "Descripción completa" } }),
  },
  {
    kind: "collection", id: "noticias", title: "Noticias", collection: "news", itemLabel: "Noticia", addLabel: "Añadir noticia",
    description: "Titular, entradilla y cuerpo. Puedes adjuntar documentos e imagen.",
    fields: pick("noticias", ["title", "excerpt", "body", "categoryId", "date", "imageId", "imageAlt", "author", "sourceName", "sourceUrl", "links", "documents", "featured"], { sourceName: { label: "Fuente" } }),
  },
  {
    kind: "collection", id: "agenda", title: "Agenda", collection: "events", itemLabel: "Evento", addLabel: "Añadir evento",
    description: "Actividades de los próximos días. Los eventos pasados se archivan automáticamente.",
    fields: pick("agenda", ["title", "startDate", "endDate", "timeText", "location", "address", "description", "categoryId", "organizer", "price", "bookingUrl", "url", "imageId", "recurrence", "recurrenceEnd", "featured"]),
  },
  {
    kind: "collection", id: "convocatorias", title: "Convocatorias y subvenciones", collection: "grants", itemLabel: "Convocatoria", addLabel: "Añadir convocatoria",
    description: "Nuevas convocatorias o cambios de estado (próxima, abierta, cerrada, concedida).",
    fields: pick("convocatorias", ["title", "grantStatus", "openingDate", "deadline", "beneficiaries", "summary", "officialUrl", "sedeUrl", "areaId", "documents"]),
  },
  {
    kind: "collection", id: "empleo", title: "Empleo y procesos selectivos", collection: "jobs", itemLabel: "Proceso selectivo", addLabel: "Añadir proceso selectivo",
    description: "Oposiciones, bolsas de empleo y programas de formación.",
    fields: pick("empleo", ["title", "jobStatus", "staffType", "positions", "openingDate", "deadline", "summary", "officialUrl", "documents"]),
  },
  {
    kind: "collection", id: "plenos", title: "Plenos y actividad institucional", collection: "sessions", itemLabel: "Sesión", addLabel: "Añadir sesión",
    description: "Convocatorias de pleno con fecha, hora, lugar, retransmisión y orden del día.",
    fields: pick("plenos", ["title", "sessionType", "date", "timeText", "location", "streamingUrl", "agenda", "documents"]),
  },
  {
    kind: "collection", id: "movilidad", title: "Cortes, obras y movilidad", collection: "mobility", itemLabel: "Afección", addLabel: "Añadir corte u obra",
    description: "Cortes de calles, obras y cambios de tráfico. Se publican como avisos con zona, afectación y alternativa.",
    fields: pick("avisos", ["title", "kind", "zone", "startsAt", "endsAt", "affectation", "alternative", "summary", "mapUrl", "priority", "showOnHome"], {
      summary: { label: "Descripción breve para la portada" },
      zone: { required: true },
    }),
  },
  { kind: "featured", id: "destacados", title: "Destacados de portada", description: "Elige qué contenidos aparecen en la portada." },
  { kind: "review", id: "revision", title: "Revisión y publicación", description: "Comprueba el resumen, previsualiza y publica." },
];
