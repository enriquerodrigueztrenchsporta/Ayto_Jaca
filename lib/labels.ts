import type { AlertKind, AlertPriority, DocumentKind, GrantStatus, JobStatus, Recurrence, SessionType } from "@/lib/generated/prisma/enums";

export const PRIORITY_LABEL: Record<AlertPriority, string> = { NORMAL: "Normal", IMPORTANT: "Importante", URGENT: "Urgente" };
export const PRIORITY_TONE = { NORMAL: "slate", IMPORTANT: "important", URGENT: "urgent" } as const;

export const ALERT_KIND_LABEL: Record<AlertKind, string> = {
  GENERAL: "Aviso",
  CORTE: "Corte de servicio",
  OBRA: "Obras",
  MOVILIDAD: "Movilidad y tráfico",
  BANDO: "Bando",
  PLAZO: "Plazo",
  CIERRE: "Cierre",
  SERVICIO: "Cambio de servicio",
};

export const GRANT_STATUS_LABEL: Record<GrantStatus, string> = { UPCOMING: "Próxima", OPEN: "Abierta", CLOSED: "Cerrada", AWARDED: "Concedida" };
export const GRANT_STATUS_TONE = { UPCOMING: "slate", OPEN: "ok", CLOSED: "neutral", AWARDED: "forest" } as const;

export const JOB_STATUS_LABEL: Record<JobStatus, string> = { UPCOMING: "Próximo", OPEN: "Plazo abierto", IN_PROGRESS: "En desarrollo", CLOSED: "Finalizado" };
export const JOB_STATUS_TONE = { UPCOMING: "slate", OPEN: "ok", IN_PROGRESS: "important", CLOSED: "neutral" } as const;

export const SESSION_TYPE_LABEL: Record<SessionType, string> = {
  ORDINARIA: "Pleno ordinario",
  EXTRAORDINARIA: "Pleno extraordinario",
  URGENTE: "Pleno extraordinario y urgente",
  JUNTA_GOBIERNO: "Junta de Gobierno Local",
  COMISION: "Comisión informativa",
  OTRA: "Otra sesión",
};

export const RECURRENCE_LABEL: Record<Recurrence, string> = { NONE: "No se repite", DAILY: "Cada día", WEEKLY: "Cada semana", MONTHLY: "Cada mes" };

export const DOCUMENT_KIND_LABEL: Record<DocumentKind, string> = { PDF: "PDF", DOC: "Documento de texto", SPREADSHEET: "Hoja de cálculo", IMAGE: "Imagen", LINK: "Enlace", OTHER: "Archivo" };

export function documentKindFromUrl(url: string): DocumentKind {
  const u = url.toLowerCase().split("?")[0];
  if (u.endsWith(".pdf")) return "PDF";
  if (/\.(docx?|odt|rtf)$/.test(u)) return "DOC";
  if (/\.(xlsx?|ods|csv)$/.test(u)) return "SPREADSHEET";
  if (/\.(jpe?g|png|webp|gif)$/.test(u)) return "IMAGE";
  return "LINK";
}

export const AUDIT_LABEL: Record<string, string> = {
  CREATE: "Creado",
  UPDATE: "Modificado",
  PUBLISH: "Publicado",
  SCHEDULE: "Programado",
  ARCHIVE: "Archivado",
  RESTORE: "Recuperado",
  DELETE: "Eliminado",
  LOGIN: "Inicio de sesión",
  LOGIN_FAILED: "Intento de acceso fallido",
  WEEKLY_SAVE: "Actualización semanal guardada",
  WEEKLY_PUBLISH: "Actualización semanal publicada",
  UPLOAD: "Archivo subido",
  VERIFY: "Verificado",
  SETTINGS: "Configuración",
};
