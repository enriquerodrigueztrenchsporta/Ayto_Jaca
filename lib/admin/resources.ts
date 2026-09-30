/**
 * Configuración declarativa de los tipos de contenido editables en el panel.
 * Es código compartido cliente/servidor: NO importar aquí nada de base de datos.
 */
export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "url"
  | "date"
  | "datetime"
  | "number"
  | "checkbox"
  | "select"
  | "category"
  | "area"
  | "media"
  | "documents"
  | "keywords"
  | "links";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: Array<{ value: string; label: string }>;
  scope?: "NEWS" | "EVENT" | "PROCEDURE" | "DOCUMENT" | "PAGE";
  group?: "principal" | "detalle" | "publicacion" | "fuente";
  placeholder?: string;
  max?: number;
};

export type ResourceKey = "noticias" | "agenda" | "avisos" | "convocatorias" | "empleo" | "plenos" | "tramites" | "documentos" | "destacados" | "paginas" | "areas";

export type Resource = {
  key: ResourceKey;
  model: "news" | "event" | "alert" | "grant" | "publicJob" | "municipalSession" | "procedure" | "document" | "featuredContent" | "page" | "area";
  label: string;
  singular: string;
  /** Artículo para mensajes ("la noticia", "el evento"). */
  article: "el" | "la";
  titleField: string;
  slugField?: "slug" | "path";
  publishable: boolean;
  fields: Field[];
  listColumns: Array<{ name: string; label: string; type?: "date" | "datetime" | "badge" }>;
  orderBy: Record<string, "asc" | "desc">;
  publicPath?: (item: Record<string, unknown>) => string | null;
};

const PRIORITY = [
  { value: "NORMAL", label: "Normal" },
  { value: "IMPORTANT", label: "Importante" },
  { value: "URGENT", label: "Urgente" },
];
const ALERT_KIND = [
  { value: "GENERAL", label: "Aviso general" },
  { value: "CORTE", label: "Corte de servicio" },
  { value: "OBRA", label: "Obras" },
  { value: "MOVILIDAD", label: "Movilidad y tráfico" },
  { value: "BANDO", label: "Bando" },
  { value: "PLAZO", label: "Plazo" },
  { value: "CIERRE", label: "Cierre" },
  { value: "SERVICIO", label: "Cambio de servicio" },
];
const GRANT_STATUS = [
  { value: "UPCOMING", label: "Próxima" },
  { value: "OPEN", label: "Abierta" },
  { value: "CLOSED", label: "Cerrada" },
  { value: "AWARDED", label: "Concedida" },
];
const JOB_STATUS = [
  { value: "UPCOMING", label: "Próximo" },
  { value: "OPEN", label: "Plazo abierto" },
  { value: "IN_PROGRESS", label: "Plazo de solicitudes cerrado" },
  { value: "CLOSED", label: "Finalizado" },
];
const SESSION_TYPE = [
  { value: "ORDINARIA", label: "Pleno ordinario" },
  { value: "EXTRAORDINARIA", label: "Pleno extraordinario" },
  { value: "URGENTE", label: "Pleno extraordinario y urgente" },
  { value: "JUNTA_GOBIERNO", label: "Junta de Gobierno Local" },
  { value: "COMISION", label: "Comisión informativa" },
  { value: "OTRA", label: "Otra sesión" },
];
const RECURRENCE = [
  { value: "NONE", label: "No se repite" },
  { value: "DAILY", label: "Cada día" },
  { value: "WEEKLY", label: "Cada semana" },
  { value: "MONTHLY", label: "Cada mes" },
];
const DOC_KIND = [
  { value: "PDF", label: "PDF" },
  { value: "DOC", label: "Documento de texto" },
  { value: "SPREADSHEET", label: "Hoja de cálculo" },
  { value: "IMAGE", label: "Imagen" },
  { value: "LINK", label: "Enlace" },
  { value: "OTHER", label: "Otro" },
];
const SECTIONS = [
  { value: "ciudad", label: "Ciudad" },
  { value: "cultura", label: "Cultura" },
  { value: "deportes", label: "Deportes" },
  { value: "turismo", label: "Turismo" },
  { value: "ayuntamiento", label: "Ayuntamiento" },
  { value: "desarrollo-economico", label: "Desarrollo económico" },
];

export const OPTIONS = { PRIORITY, ALERT_KIND, GRANT_STATUS, JOB_STATUS, SESSION_TYPE, RECURRENCE, DOC_KIND, SECTIONS };

const publication: Field[] = [
  { name: "publishAt", label: "Publicar a partir de", type: "datetime", group: "publicacion", help: "Déjalo vacío para publicar en cuanto pulses «Publicar». Si pones una fecha futura, quedará programado." },
  { name: "expiresAt", label: "Retirar automáticamente el", type: "datetime", group: "publicacion", help: "Al llegar esta fecha el contenido se archiva solo (no se borra)." },
];
const source: Field[] = [
  { name: "sourceName", label: "Nombre de la fuente", type: "text", group: "fuente", placeholder: "jaca.es, BOPH, Sede Electrónica…" },
  { name: "sourceUrl", label: "Enlace a la fuente oficial", type: "url", group: "fuente" },
  { name: "lastVerifiedAt", label: "Fecha de la última verificación", type: "date", group: "fuente", help: "El panel avisará cuando pasen 90 días sin verificar." },
];
const demo: Field = { name: "isDemo", label: "Es un contenido de demostración (se mostrará la etiqueta DEMO)", type: "checkbox", group: "publicacion" };

export const RESOURCES: Record<ResourceKey, Resource> = {
  noticias: {
    key: "noticias", model: "news", label: "Noticias", singular: "noticia", article: "la", titleField: "title", slugField: "slug", publishable: true,
    fields: [
      { name: "title", label: "Titular", type: "text", required: true, max: 200 },
      { name: "excerpt", label: "Entradilla", type: "textarea", required: true, help: "Una o dos frases que resumen la noticia. Se muestra en las tarjetas.", max: 400 },
      { name: "body", label: "Cuerpo", type: "markdown", help: "Puedes usar **negrita**, listas con guion y enlaces [texto](https://…)." },
      { name: "categoryId", label: "Categoría", type: "category", scope: "NEWS" },
      { name: "date", label: "Fecha de la noticia", type: "datetime", required: true },
      { name: "imageId", label: "Imagen", type: "media", group: "detalle" },
      { name: "imageAlt", label: "Texto alternativo de la imagen", type: "text", group: "detalle", help: "Describe la imagen para personas que no pueden verla." },
      { name: "author", label: "Autoría (opcional)", type: "text", group: "detalle" },
      { name: "links", label: "Enlaces relacionados", type: "links", group: "detalle" },
      { name: "documents", label: "Documentos adjuntos", type: "documents", group: "detalle" },
      { name: "featured", label: "Destacar en la portada", type: "checkbox", group: "publicacion" },
      ...publication, demo, ...source.slice(0, 2),
    ],
    listColumns: [{ name: "date", label: "Fecha", type: "date" }, { name: "featured", label: "Portada", type: "badge" }],
    orderBy: { date: "desc" },
    publicPath: (i) => `/actualidad/noticias/${i.slug}`,
  },
  agenda: {
    key: "agenda", model: "event", label: "Agenda", singular: "evento", article: "el", titleField: "title", slugField: "slug", publishable: true,
    fields: [
      { name: "title", label: "Nombre del evento", type: "text", required: true, max: 200 },
      { name: "startDate", label: "Fecha de inicio", type: "datetime", required: true },
      { name: "endDate", label: "Fecha de fin", type: "datetime", help: "Solo si dura varios días." },
      { name: "timeText", label: "Horario (texto)", type: "text", placeholder: "20:30 h · de 10 a 14 h" },
      { name: "categoryId", label: "Categoría", type: "category", scope: "EVENT" },
      { name: "location", label: "Lugar", type: "text", placeholder: "Palacio de Congresos" },
      { name: "address", label: "Dirección", type: "text" },
      { name: "description", label: "Descripción", type: "markdown", required: true },
      { name: "organizer", label: "Organiza", type: "text", group: "detalle" },
      { name: "price", label: "Precio", type: "text", group: "detalle", placeholder: "Gratuito · 10 €" },
      { name: "bookingUrl", label: "Reserva / entradas", type: "url", group: "detalle" },
      { name: "url", label: "Más información (enlace)", type: "url", group: "detalle" },
      { name: "imageId", label: "Imagen", type: "media", group: "detalle" },
      { name: "imageAlt", label: "Texto alternativo de la imagen", type: "text", group: "detalle" },
      { name: "recurrence", label: "Repetición", type: "select", options: RECURRENCE, group: "detalle" },
      { name: "recurrenceEnd", label: "Se repite hasta", type: "date", group: "detalle" },
      { name: "featured", label: "Destacar en la portada", type: "checkbox", group: "publicacion" },
      ...publication, demo, ...source.slice(0, 2),
    ],
    listColumns: [{ name: "startDate", label: "Inicio", type: "datetime" }, { name: "featured", label: "Portada", type: "badge" }],
    orderBy: { startDate: "desc" },
    publicPath: (i) => `/agenda/${i.slug}`,
  },
  avisos: {
    key: "avisos", model: "alert", label: "Avisos", singular: "aviso", article: "el", titleField: "title", publishable: true,
    fields: [
      { name: "title", label: "Título", type: "text", required: true, max: 200 },
      { name: "summary", label: "Descripción corta", type: "textarea", required: true, max: 400 },
      { name: "body", label: "Descripción completa", type: "textarea" },
      { name: "priority", label: "Prioridad", type: "select", options: PRIORITY, required: true },
      { name: "kind", label: "Tipo de aviso", type: "select", options: ALERT_KIND, required: true },
      { name: "startsAt", label: "Fecha de inicio", type: "datetime", required: true },
      { name: "endsAt", label: "Fecha de fin", type: "datetime", help: "El aviso deja de mostrarse automáticamente después de esta fecha." },
      { name: "areaId", label: "Área", type: "area" },
      { name: "url", label: "Enlace", type: "url" },
      { name: "zone", label: "Zona afectada", type: "text", group: "detalle" },
      { name: "affectation", label: "Afectación", type: "text", group: "detalle" },
      { name: "alternative", label: "Alternativa", type: "text", group: "detalle" },
      { name: "mapUrl", label: "Mapa (enlace, opcional)", type: "url", group: "detalle", help: "Por ejemplo, un enlace de OpenStreetMap." },
      { name: "documents", label: "Documentos adjuntos", type: "documents", group: "detalle" },
      { name: "showOnHome", label: "Mostrar en la portada", type: "checkbox", group: "publicacion" },
      ...publication, demo, source[1],
    ],
    listColumns: [{ name: "priority", label: "Prioridad", type: "badge" }, { name: "startsAt", label: "Inicio", type: "date" }, { name: "endsAt", label: "Fin", type: "date" }],
    orderBy: { startsAt: "desc" },
    publicPath: (i) => `/avisos#aviso-${i.id}`,
  },
  convocatorias: {
    key: "convocatorias", model: "grant", label: "Subvenciones", singular: "convocatoria", article: "la", titleField: "title", slugField: "slug", publishable: true,
    fields: [
      { name: "title", label: "Título", type: "text", required: true, max: 250 },
      { name: "grantStatus", label: "Estado", type: "select", options: GRANT_STATUS, required: true },
      { name: "openingDate", label: "Fecha de apertura", type: "date" },
      { name: "deadline", label: "Fecha límite", type: "datetime" },
      { name: "deadlineText", label: "Plazo (texto, si no hay fecha exacta)", type: "text" },
      { name: "beneficiaries", label: "Destinatarios", type: "text" },
      { name: "summary", label: "Resumen", type: "textarea", required: true, max: 500 },
      { name: "body", label: "Información detallada", type: "markdown" },
      { name: "officialUrl", label: "Enlace oficial", type: "url" },
      { name: "sedeUrl", label: "Trámite en la Sede Electrónica", type: "url" },
      { name: "areaId", label: "Área responsable", type: "area" },
      { name: "documents", label: "Documentación (bases, anexos, extractos)", type: "documents", group: "detalle" },
      ...publication, demo, ...source,
    ],
    listColumns: [{ name: "grantStatus", label: "Estado", type: "badge" }, { name: "deadline", label: "Fecha límite", type: "date" }],
    orderBy: { updatedAt: "desc" },
    publicPath: (i) => `/convocatorias/${i.slug}`,
  },
  empleo: {
    key: "empleo", model: "publicJob", label: "Empleo público", singular: "proceso selectivo", article: "el", titleField: "title", slugField: "slug", publishable: true,
    fields: [
      { name: "title", label: "Título", type: "text", required: true, max: 250 },
      { name: "jobStatus", label: "Estado", type: "select", options: JOB_STATUS, required: true },
      { name: "staffType", label: "Tipo de personal", type: "text", placeholder: "Personal funcionario, laboral, bolsa…" },
      { name: "positions", label: "Número de plazas", type: "number" },
      { name: "openingDate", label: "Inicio del plazo", type: "date" },
      { name: "deadline", label: "Fin del plazo", type: "datetime" },
      { name: "summary", label: "Resumen", type: "textarea", required: true, max: 500 },
      { name: "body", label: "Información detallada", type: "markdown" },
      { name: "officialUrl", label: "Enlace oficial", type: "url" },
      { name: "areaId", label: "Área", type: "area" },
      { name: "documents", label: "Bases, publicaciones y resoluciones", type: "documents", group: "detalle" },
      ...publication, demo, ...source,
    ],
    listColumns: [{ name: "jobStatus", label: "Estado", type: "badge" }, { name: "deadline", label: "Fin del plazo", type: "date" }],
    orderBy: { updatedAt: "desc" },
    publicPath: (i) => `/empleo-publico/${i.slug}`,
  },
  plenos: {
    key: "plenos", model: "municipalSession", label: "Plenos", singular: "sesión", article: "la", titleField: "title", slugField: "slug", publishable: true,
    fields: [
      { name: "title", label: "Título", type: "text", required: true, placeholder: "Pleno ordinario de 20 de octubre de 2026" },
      { name: "sessionType", label: "Tipo de sesión", type: "select", options: SESSION_TYPE, required: true },
      { name: "date", label: "Fecha y hora", type: "datetime", required: true },
      { name: "timeText", label: "Hora (texto)", type: "text", placeholder: "9:30 h" },
      { name: "location", label: "Lugar", type: "text", placeholder: "Salón de Plenos · Casa Consistorial" },
      { name: "streamingUrl", label: "Enlace de retransmisión", type: "url" },
      { name: "agenda", label: "Orden del día", type: "markdown" },
      { name: "documents", label: "Documentos (convocatoria, actas…)", type: "documents", group: "detalle" },
      ...publication, demo, ...source.slice(0, 2),
    ],
    listColumns: [{ name: "date", label: "Fecha", type: "datetime" }, { name: "sessionType", label: "Tipo", type: "badge" }],
    orderBy: { date: "desc" },
    publicPath: (i) => `/plenos/${i.slug}`,
  },
  tramites: {
    key: "tramites", model: "procedure", label: "Trámites", singular: "trámite", article: "el", titleField: "title", slugField: "slug", publishable: true,
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "summary", label: "Resumen en lenguaje claro", type: "textarea", required: true, max: 400 },
      { name: "categoryId", label: "Categoría", type: "category", scope: "PROCEDURE" },
      { name: "areaId", label: "Área responsable", type: "area" },
      { name: "sedeUrl", label: "Enlace directo a la Sede Electrónica", type: "url" },
      { name: "online", label: "Se puede hacer online", type: "checkbox" },
      { name: "requiresCertificate", label: "Requiere certificado digital o Cl@ve", type: "checkbox" },
      { name: "keywords", label: "Palabras clave y sinónimos", type: "keywords", help: "Separadas por comas. Ej.: empadronarme, mudanza, padrón" },
      { name: "description", label: "¿En qué consiste?", type: "markdown", group: "detalle" },
      { name: "whoCanApply", label: "¿Quién puede solicitarlo?", type: "markdown", group: "detalle" },
      { name: "documentation", label: "Documentación necesaria", type: "markdown", group: "detalle" },
      { name: "requirements", label: "Requisitos", type: "markdown", group: "detalle" },
      { name: "deadline", label: "Plazo", type: "markdown", group: "detalle" },
      { name: "cost", label: "Coste o tasa", type: "markdown", group: "detalle" },
      { name: "howToApply", label: "Cómo hacerlo online", type: "markdown", group: "detalle" },
      { name: "inPerson", label: "Cómo hacerlo en persona", type: "markdown", group: "detalle" },
      { name: "contact", label: "Contacto específico", type: "text", group: "detalle" },
      { name: "documents", label: "Impresos y documentos", type: "documents", group: "detalle" },
      { name: "featured", label: "Trámite destacado (portada)", type: "checkbox", group: "publicacion" },
      { name: "sortOrder", label: "Orden", type: "number", group: "publicacion" },
      ...publication, ...source,
    ],
    listColumns: [{ name: "online", label: "Online", type: "badge" }, { name: "lastVerifiedAt", label: "Verificado", type: "date" }],
    orderBy: { title: "asc" },
    publicPath: (i) => `/tramites/${i.slug}`,
  },
  documentos: {
    key: "documentos", model: "document", label: "Documentos", singular: "documento", article: "el", titleField: "title", publishable: false,
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "url", label: "Enlace al archivo", type: "url", required: true, help: "Sube un PDF desde «Medios» y pega aquí su enlace, o usa el enlace oficial existente." },
      { name: "kind", label: "Tipo", type: "select", options: DOC_KIND, required: true },
      { name: "categoryId", label: "Categoría", type: "category", scope: "DOCUMENT" },
      { name: "description", label: "Contexto", type: "text", help: "Ej.: Ordenanzas fiscales 2026, Convocatoria de cultura…" },
      { name: "documentDate", label: "Fecha del documento", type: "date" },
      { name: "fileSize", label: "Tamaño (bytes)", type: "number" },
      ...source,
    ],
    listColumns: [{ name: "kind", label: "Tipo", type: "badge" }, { name: "documentDate", label: "Fecha", type: "date" }],
    orderBy: { updatedAt: "desc" },
    publicPath: (i) => String(i.url),
  },
  destacados: {
    key: "destacados", model: "featuredContent", label: "Destacados", singular: "destacado", article: "el", titleField: "title", publishable: true,
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "url", label: "Enlace", type: "text", required: true, help: "Ruta interna (/agenda) o dirección completa (https://…)." },
      { name: "kind", label: "Tipo", type: "select", options: [{ value: "HIGHLIGHT", label: "Destacado" }, { value: "BANNER", label: "Banner" }], required: true },
      { name: "imageId", label: "Imagen", type: "media" },
      { name: "imageAlt", label: "Texto alternativo", type: "text" },
      { name: "position", label: "Orden", type: "number" },
      ...publication,
    ],
    listColumns: [{ name: "kind", label: "Tipo", type: "badge" }, { name: "position", label: "Orden" }],
    orderBy: { position: "asc" },
    publicPath: () => "/",
  },
  paginas: {
    key: "paginas", model: "page", label: "Páginas", singular: "página", article: "la", titleField: "title", slugField: "path", publishable: true,
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "section", label: "Sección", type: "select", options: SECTIONS, required: true },
      { name: "path", label: "Dirección (URL)", type: "text", help: "Se genera sola a partir de la sección y el título. Ej.: ciudad/movilidad" },
      { name: "summary", label: "Resumen", type: "textarea" },
      { name: "body", label: "Contenido", type: "markdown" },
      { name: "imageId", label: "Imagen principal", type: "media", group: "detalle" },
      { name: "areaId", label: "Área de contacto", type: "area", group: "detalle" },
      { name: "documents", label: "Documentos", type: "documents", group: "detalle" },
      { name: "sortOrder", label: "Orden", type: "number", group: "publicacion" },
      ...publication, ...source,
    ],
    listColumns: [{ name: "section", label: "Sección", type: "badge" }, { name: "path", label: "Dirección" }],
    orderBy: { path: "asc" },
    publicPath: (i) => `/${i.path}`,
  },
  areas: {
    key: "areas", model: "area", label: "Áreas y contactos", singular: "área", article: "el", titleField: "name", slugField: "slug", publishable: false,
    fields: [
      { name: "name", label: "Nombre del área o servicio", type: "text", required: true },
      { name: "description", label: "Qué hace", type: "textarea" },
      { name: "phone", label: "Teléfono", type: "text" },
      { name: "email", label: "Correo electrónico", type: "text" },
      { name: "address", label: "Dirección", type: "text" },
      { name: "schedule", label: "Horario", type: "text" },
      { name: "webUrl", label: "Web del servicio", type: "url" },
      { name: "mapUrl", label: "Mapa (OpenStreetMap)", type: "url" },
      { name: "pendingFields", label: "Datos pendientes de validar", type: "keywords", help: "Separados por comas. Se muestran como pendientes de validación." },
      { name: "sortOrder", label: "Orden", type: "number" },
      ...source,
    ],
    listColumns: [{ name: "phone", label: "Teléfono" }, { name: "lastVerifiedAt", label: "Verificado", type: "date" }],
    orderBy: { sortOrder: "asc" },
    publicPath: (i) => `/ayuntamiento/areas/${i.slug}`,
  },
};

export const RESOURCE_LIST = Object.values(RESOURCES);

export function getResource(key: string): Resource | null {
  return (RESOURCES as Record<string, Resource>)[key] ?? null;
}

/** Nombre del segmento de previsualización para cada modelo. */
export const PREVIEW_TYPE: Record<Resource["model"], string> = {
  news: "noticias", event: "agenda", alert: "avisos", grant: "convocatorias", publicJob: "empleo", municipalSession: "plenos",
  procedure: "tramites", document: "documentos", featuredContent: "destacados", page: "paginas", area: "areas",
};
