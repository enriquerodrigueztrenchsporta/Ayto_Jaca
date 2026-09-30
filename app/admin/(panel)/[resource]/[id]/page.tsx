import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, ExternalLink } from "lucide-react";
import { getResource, PREVIEW_TYPE } from "@/lib/admin/resources";
import { loadForEdit, toFormValues } from "@/lib/admin/service";
import { loadLookups } from "@/lib/admin/lookups";
import { EditorForm } from "@/components/admin/EditorForm";
import { PublicationStatus } from "@/components/admin/PublicationStatus";
import { formatDate, formatDateTime } from "@/lib/dates";
import { db } from "@/lib/db";
import type { Publishable } from "@/lib/content/visibility";

type Props = { params: Promise<{ resource: string; id: string }> };

export async function generateMetadata({ params }: Props) {
  const { resource: key } = await params;
  const r = getResource(key);
  return { title: r ? `Editar ${r.singular}` : "Editar" };
}

const VERIFY_DAYS = 90;

export default async function EditResourcePage({ params }: Props) {
  const { resource: key, id } = await params;
  const resource = getResource(key);
  if (!resource) notFound();
  const item = await loadForEdit(resource, id);
  if (!item) notFound();
  const history = await db.auditLog.findMany({ where: { entityType: resource.model, entityId: id }, orderBy: { createdAt: "desc" }, take: 8 });
  const lastVerified = item.lastVerifiedAt as Date | null | undefined;
  const stale = resource.fields.some((f) => f.name === "lastVerifiedAt") && (!lastVerified || Date.now() - lastVerified.getTime() > VERIFY_DAYS * 86400000);
  const publicHref = resource.publicPath?.(item);

  return (
    <div className="max-w-6xl">
      <Link href={`/admin/${resource.key}`} className="mb-4 inline-flex items-center gap-1.5 font-semibold text-forest-700 hover:underline">
        <ArrowLeft aria-hidden className="size-4" /> {resource.label}
      </Link>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-h2 font-medium text-forest-900">{String(item[resource.titleField] ?? "")}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[0.9375rem] text-muted">
            {resource.publishable && <PublicationStatus item={item as unknown as Publishable} />}
            {item.updatedAt instanceof Date && <span>Última modificación: {formatDateTime(item.updatedAt)}</span>}
          </div>
        </div>
        {publicHref && item.status === "PUBLISHED" && (
          <a href={publicHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-forest-700 hover:underline">
            Ver en la web <ExternalLink aria-hidden className="size-4" />
          </a>
        )}
      </div>
      {stale && (
        <p role="status" className="mb-6 flex items-start gap-2 rounded-[8px] border border-important/30 bg-important-50 px-4 py-3 font-semibold text-important">
          <AlertTriangle aria-hidden className="mt-0.5 size-5 shrink-0" />
          {lastVerified ? `Este dato no se verifica desde hace más de ${VERIFY_DAYS} días (última verificación: ${formatDate(lastVerified, "medium")}).` : "Este dato no tiene fecha de verificación."} Comprueba la fuente oficial y pulsa «Marcar como verificado hoy».
        </p>
      )}
      <EditorForm
        resourceKey={resource.key}
        id={id}
        initialValues={toFormValues(resource, item)}
        lookups={await loadLookups()}
        status={resource.publishable ? (item.status as "DRAFT") : undefined}
        previewHref={resource.publishable ? `/preview/${PREVIEW_TYPE[resource.model]}/${id}` : null}
      />
      {history.length > 0 && (
        <section aria-labelledby="hist" className="mt-10 max-w-3xl">
          <h2 id="hist" className="mb-3 font-serif text-h3 font-medium">Historial</h2>
          <ol className="space-y-1 text-[0.9375rem] text-ink-2">
            {history.map((h) => (
              <li key={h.id}>
                {formatDateTime(h.createdAt)} · <strong>{h.action}</strong> · {h.userEmail ?? "sistema"}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
