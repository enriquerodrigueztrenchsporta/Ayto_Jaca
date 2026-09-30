import { notFound } from "next/navigation";
import { PageHeader } from "@/components/public/PageHeader";
import { AlertItem, type AlertData } from "@/components/public/AlertBanner";
import { DocumentList, EventCard, GrantCard, JobCard, NewsCard, ProcedureCard, SessionCard } from "@/components/public/cards";
import { PublicationStatus } from "@/components/admin/PublicationStatus";
import { Prose } from "@/components/ui/Prose";
import { getResource } from "@/lib/admin/resources";
import { delegate } from "@/lib/admin/service";
import { formatDateTime } from "@/lib/dates";
import type { Publishable } from "@/lib/content/visibility";

type Props = { params: Promise<{ type: string; id: string }> };

/** Previsualiza cualquier contenido (incluidos borradores) tal y como se verá en la web. */
export default async function PreviewItemPage({ params }: Props) {
  const { type, id } = await params;
  const resource = getResource(type);
  if (!resource) notFound();
  const include: Record<string, unknown> = {};
  if (resource.fields.some((f) => f.type === "documents")) include.documents = true;
  if (resource.fields.some((f) => f.name === "categoryId")) include.category = true;
  if (resource.fields.some((f) => f.name === "imageId")) include.image = true;
  if (resource.fields.some((f) => f.name === "areaId")) include.area = true;
  const item = await delegate(resource).findUnique({ where: { id }, include });
  if (!item) notFound();
  // El registro tiene la forma del modelo correspondiente; se pasa a la tarjeta de ese modelo.
  const i = item as never;
  const body = (item.body ?? item.description ?? item.agenda ?? "") as string;
  const docs = (item.documents ?? []) as Parameters<typeof DocumentList>[0]["docs"];

  let card: React.ReactNode = null;
  switch (resource.model) {
    case "news": card = <NewsCard item={i} />; break;
    case "event": card = <EventCard item={i} />; break;
    case "alert": card = <AlertItem alert={item as unknown as AlertData} detailed />; break;
    case "grant": card = <GrantCard item={i} />; break;
    case "publicJob": card = <JobCard item={i} />; break;
    case "municipalSession": card = <SessionCard item={i} />; break;
    case "procedure": card = <ProcedureCard item={i} />; break;
  }

  return (
    <>
      <PageHeader title={String(item[resource.titleField] ?? "")} eyebrow={`Vista previa · ${resource.singular}`} intro={(item.excerpt ?? item.summary ?? undefined) as string | undefined} crumbs={[{ label: "Vista previa" }]}>
        <div className="flex flex-wrap items-center gap-3 text-[0.9375rem] text-muted">
          <PublicationStatus item={item as unknown as Publishable} />
          {item.publishAt instanceof Date && <span>Se publica: {formatDateTime(item.publishAt)}</span>}
          {item.expiresAt instanceof Date && <span>Se retira: {formatDateTime(item.expiresAt)}</span>}
        </div>
      </PageHeader>
      <div className="container-site grid gap-12 py-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Prose markdown={body} />
          <DocumentList docs={docs} />
        </div>
        {card && (
          <aside className="lg:col-span-4">
            <p className="mb-3 font-semibold text-muted">Así aparecerá en los listados y en la portada:</p>
            {card}
          </aside>
        )}
      </div>
    </>
  );
}
