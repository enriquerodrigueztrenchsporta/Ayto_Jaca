import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { statusOnPublish } from "@/lib/content/visibility";
import { parseLocalInput, toDateInput, toDateTimeInput } from "@/lib/dates";
import { buildSearchText, slugify } from "@/lib/text";
import { documentKindFromUrl } from "@/lib/labels";
import type { PublicationStatus } from "@/lib/generated/prisma/enums";
import { formSchema, type FormValues } from "./schema";
import { getResource, type Resource } from "./resources";

export type Actor = { id: string; email: string };
export type SaveIntent = "draft" | "publish" | "save";

/** Acceso genérico a los delegados de Prisma: todos los modelos editables comparten estas operaciones. */
type Delegate = {
  findUnique(args: unknown): Promise<Record<string, unknown> | null>;
  findFirst(args: unknown): Promise<Record<string, unknown> | null>;
  findMany(args: unknown): Promise<Record<string, unknown>[]>;
  count(args?: unknown): Promise<number>;
  create(args: unknown): Promise<Record<string, unknown>>;
  update(args: unknown): Promise<Record<string, unknown>>;
  delete(args: unknown): Promise<Record<string, unknown>>;
};
export function delegate(resource: Resource): Delegate {
  return (db as unknown as Record<string, Delegate>)[resource.model];
}

export class ValidationError extends Error {
  constructor(public issues: Record<string, string>) {
    super("Revisa los campos marcados.");
  }
}

// ─── Conversión registro ⇄ formulario ──────────────────────
export function toFormValues(resource: Resource, record: Record<string, unknown>): FormValues {
  const v: FormValues = {};
  for (const f of resource.fields) {
    const raw = record[f.name];
    switch (f.type) {
      case "checkbox":
        v[f.name] = Boolean(raw);
        break;
      case "date":
        v[f.name] = raw instanceof Date ? toDateInput(raw) : "";
        break;
      case "datetime":
        v[f.name] = raw instanceof Date ? toDateTimeInput(raw) : "";
        break;
      case "number":
        v[f.name] = raw === null || raw === undefined ? "" : String(raw);
        break;
      case "keywords":
        v[f.name] = Array.isArray(raw) ? (raw as string[]).join(", ") : "";
        break;
      case "documents":
        v[f.name] = ((record.documents as Array<{ id: string; title: string; url: string }>) ?? []).map((d) => ({ id: d.id, title: d.title, url: d.url }));
        break;
      case "links":
        v[f.name] = Array.isArray(raw) ? (raw as Array<{ label: string; url: string }>).map((l) => ({ label: l.label, url: l.url })) : [];
        break;
      default:
        v[f.name] = raw === null || raw === undefined ? "" : String(raw);
    }
  }
  return v;
}

function toData(resource: Resource, values: FormValues) {
  const data: Record<string, unknown> = {};
  for (const f of resource.fields) {
    const raw = values[f.name];
    switch (f.type) {
      case "documents":
        break;
      case "links":
        data[f.name] = (raw as Array<{ label: string; url: string }>) ?? [];
        break;
      case "checkbox":
        data[f.name] = Boolean(raw);
        break;
      case "date":
        data[f.name] = parseLocalInput(raw as string, f.name === "deadline" || f.name === "recurrenceEnd" ? "end" : "start");
        break;
      case "datetime":
        data[f.name] = parseLocalInput(raw as string);
        break;
      case "number":
        data[f.name] = raw === "" ? (f.name === "sortOrder" || f.name === "position" ? 0 : null) : Number(raw);
        break;
      case "keywords":
        data[f.name] = String(raw ?? "").split(",").map((k) => k.trim()).filter(Boolean);
        break;
      case "category":
      case "area":
      case "media":
        data[f.name] = raw ? String(raw) : null;
        break;
      default: {
        const s = String(raw ?? "").trim();
        data[f.name] = s === "" && !f.required ? null : s;
      }
    }
  }
  // Campos con valor por defecto no anulable
  for (const k of ["body", "description"]) if (resource.model !== "area" && k in data && data[k] === null) data[k] = "";
  const text = resource.fields.filter((f) => ["text", "textarea", "markdown", "keywords"].includes(f.type)).map((f) => String(values[f.name] ?? ""));
  if (resource.model !== "featuredContent" && resource.model !== "area") data.searchText = buildSearchText(...text);
  return data;
}

function issuesOf(error: { issues: Array<{ path: PropertyKey[]; message: string }> }) {
  const out: Record<string, string> = {};
  for (const i of error.issues) out[i.path.map(String).join(".")] ??= i.message;
  return out;
}

async function uniqueValue(resource: Resource, field: "slug" | "path", base: string, excludeId?: string) {
  const d = delegate(resource);
  let candidate = base;
  for (let n = 2; n < 200; n++) {
    const found = await d.findFirst({ where: { [field]: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) }, select: { id: true } });
    if (!found) return candidate;
    candidate = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

async function documentsWrite(rows: Array<{ id?: string; title: string; url: string }>, context: string, isUpdate: boolean) {
  const ids: string[] = [];
  for (const r of rows) {
    const payload = { title: r.title, url: r.url, kind: documentKindFromUrl(r.url), isExternal: !r.url.startsWith("/uploads/"), description: context, searchText: buildSearchText(r.title, context) };
    if (r.id) {
      await db.document.update({ where: { id: r.id }, data: payload });
      ids.push(r.id);
    } else {
      ids.push((await db.document.create({ data: payload })).id);
    }
  }
  const refs = ids.map((id) => ({ id }));
  return isUpdate ? { set: refs } : { connect: refs };
}

// ─── Guardar ───────────────────────────────────────────────
export async function saveItem({ resourceKey, id, values, intent, actor, weeklyUpdateId }: { resourceKey: string; id?: string | null; values: FormValues; intent: SaveIntent; actor: Actor; weeklyUpdateId?: string | null }) {
  const resource = getResource(resourceKey);
  if (!resource) throw new Error("Tipo de contenido desconocido");
  const parsed = formSchema(resource).safeParse(values);
  if (!parsed.success) throw new ValidationError(issuesOf(parsed.error));
  const clean = parsed.data as FormValues;
  const d = delegate(resource);
  const existing = id ? await d.findUnique({ where: { id } }) : null;
  if (id && !existing) throw new Error("El contenido no existe");

  const data = toData(resource, clean);
  const title = String(clean[resource.titleField] ?? "");

  if (resource.slugField === "slug" && !existing) data.slug = await uniqueValue(resource, "slug", slugify(title));
  if (resource.slugField === "path") {
    const wanted = String(clean.path || "").trim().replace(/^\/+|\/+$/g, "") || `${clean.section}/${slugify(title)}`;
    const normalized = wanted.split("/").map((s) => slugify(s)).join("/");
    data.path = await uniqueValue(resource, "path", normalized, existing ? String(existing.id) : undefined);
  }

  if (resource.publishable) {
    const current = existing?.status as PublicationStatus | undefined;
    const publishAt = (data.publishAt as Date | null) ?? null;
    let status: PublicationStatus;
    if (intent === "draft") status = "DRAFT";
    else if (intent === "publish") status = statusOnPublish(publishAt);
    else status = current === "PUBLISHED" || current === "SCHEDULED" ? statusOnPublish(publishAt) : (current ?? "DRAFT");
    data.status = status;
  }
  if (weeklyUpdateId && ["news", "event", "alert", "grant", "publicJob", "municipalSession"].includes(resource.model)) data.weeklyUpdateId = weeklyUpdateId;

  if (resource.fields.some((f) => f.type === "documents")) {
    data.documents = await documentsWrite((clean.documents as Array<{ id?: string; title: string; url: string }>) ?? [], title, Boolean(existing));
  }

  const saved = existing ? await d.update({ where: { id }, data }) : await d.create({ data });
  const action = !existing ? "CREATE" : intent === "publish" ? (data.status === "SCHEDULED" ? "SCHEDULE" : "PUBLISH") : "UPDATE";
  await audit({ action, entityType: resource.model, entityId: String(saved.id), entityTitle: title, user: actor, details: { status: (data.status as string) ?? null } });
  if (!existing && intent === "publish") {
    await audit({ action: data.status === "SCHEDULED" ? "SCHEDULE" : "PUBLISH", entityType: resource.model, entityId: String(saved.id), entityTitle: title, user: actor });
  }
  return saved;
}

// ─── Cambios de estado ─────────────────────────────────────
export async function changeStatus({ resourceKey, id, action, actor }: { resourceKey: string; id: string; action: "archive" | "restore" | "publish"; actor: Actor }) {
  const resource = getResource(resourceKey);
  if (!resource?.publishable) throw new Error("Este contenido no admite estados");
  const d = delegate(resource);
  const item = await d.findUnique({ where: { id } });
  if (!item) throw new Error("El contenido no existe");
  let status: PublicationStatus;
  if (action === "archive") status = "ARCHIVED";
  else if (action === "restore") status = "DRAFT";
  else status = statusOnPublish((item.publishAt as Date | null) ?? null);
  const extra = action === "publish" && item.expiresAt && (item.expiresAt as Date) <= new Date() ? { expiresAt: null } : {};
  await d.update({ where: { id }, data: { status, ...extra } });
  await audit({ action: action === "archive" ? "ARCHIVE" : action === "restore" ? "RESTORE" : status === "SCHEDULED" ? "SCHEDULE" : "PUBLISH", entityType: resource.model, entityId: id, entityTitle: String(item[resource.titleField] ?? ""), user: actor });
  return status;
}

export async function deleteItem({ resourceKey, id, actor }: { resourceKey: string; id: string; actor: Actor }) {
  const resource = getResource(resourceKey);
  if (!resource) throw new Error("Tipo de contenido desconocido");
  const d = delegate(resource);
  const item = await d.findUnique({ where: { id } });
  if (!item) return;
  if (resource.publishable && item.status !== "DRAFT") throw new Error("Solo se pueden eliminar borradores. Archiva el contenido publicado.");
  await d.delete({ where: { id } });
  await audit({ action: "DELETE", entityType: resource.model, entityId: id, entityTitle: String(item[resource.titleField] ?? ""), user: actor });
}

export async function markVerified({ resourceKey, id, actor }: { resourceKey: string; id: string; actor: Actor }) {
  const resource = getResource(resourceKey);
  if (!resource || !resource.fields.some((f) => f.name === "lastVerifiedAt")) throw new Error("Este contenido no tiene verificación");
  const d = delegate(resource);
  const item = await d.update({ where: { id }, data: { lastVerifiedAt: new Date() } });
  await audit({ action: "VERIFY", entityType: resource.model, entityId: id, entityTitle: String(item[resource.titleField] ?? ""), user: actor });
}

/** Carga un registro con sus documentos para editar. */
export async function loadForEdit(resource: Resource, id: string) {
  const include = resource.fields.some((f) => f.type === "documents") ? { documents: { orderBy: { title: "asc" } } } : undefined;
  return delegate(resource).findUnique({ where: { id }, ...(include ? { include } : {}) });
}
