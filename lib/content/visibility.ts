import type { PublicationStatus } from "@/lib/generated/prisma/enums";

/**
 * Reglas de publicación comunes a todos los contenidos.
 *
 * Un contenido es visible públicamente si:
 *  - su estado es PUBLISHED o SCHEDULED (programado),
 *  - su fecha de publicación (publishAt) ya ha llegado o no existe,
 *  - y su fecha de caducidad (expiresAt) no ha pasado.
 *
 * Así la web es correcta aunque la tarea programada de ciclo de vida no se haya ejecutado:
 * la tarea solo "ordena" los estados en la base de datos (SCHEDULED → PUBLISHED → ARCHIVED).
 */
export function publishedWhere(now: Date = new Date()) {
  return {
    status: { in: ["PUBLISHED", "SCHEDULED"] as PublicationStatus[] },
    AND: [
      { OR: [{ publishAt: null }, { publishAt: { lte: now } }] },
      { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
    ],
  };
}

export type Publishable = {
  status: PublicationStatus;
  publishAt: Date | null;
  expiresAt: Date | null;
};

/** Estado efectivo que ve el ciudadano en este momento. */
export function effectiveStatus(item: Publishable, now: Date = new Date()): PublicationStatus {
  if (item.status === "DRAFT" || item.status === "ARCHIVED") return item.status;
  if (item.expiresAt && item.expiresAt <= now) return "ARCHIVED";
  if (item.publishAt && item.publishAt > now) return "SCHEDULED";
  return "PUBLISHED";
}

export function isVisible(item: Publishable, now: Date = new Date()): boolean {
  return effectiveStatus(item, now) === "PUBLISHED";
}

/** Estado a guardar cuando el editor pulsa "Publicar". */
export function statusOnPublish(publishAt: Date | null | undefined, now: Date = new Date()): PublicationStatus {
  return publishAt && publishAt > now ? "SCHEDULED" : "PUBLISHED";
}

export const STATUS_LABEL: Record<PublicationStatus, string> = {
  DRAFT: "Borrador",
  SCHEDULED: "Programado",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
};
