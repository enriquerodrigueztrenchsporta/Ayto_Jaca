import { notFound } from "next/navigation";
import { Briefcase, Clock, Users } from "lucide-react";
import { PageHeader } from "@/components/public/PageHeader";
import { DocumentList } from "@/components/public/cards";
import { SourceNote } from "@/components/public/SourceNote";
import { Badge } from "@/components/ui/Badge";
import { Prose } from "@/components/ui/Prose";
import { getJob } from "@/lib/queries/public";
import { formatDate, formatDateTime } from "@/lib/dates";
import { JOB_STATUS_LABEL, JOB_STATUS_TONE } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo";
import { EXTERNAL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const j = await getJob((await params).slug);
  if (!j) return {};
  return pageMetadata({ title: j.title, description: j.summary, path: `/empleo-publico/${j.slug}` });
}

export default async function JobPage({ params }: Props) {
  const j = await getJob((await params).slug);
  if (!j) notFound();
  return (
    <>
      <PageHeader title={j.title} eyebrow="Empleo público" intro={j.summary} crumbs={[{ label: "Empleo público", href: "/empleo-publico" }, { label: j.title }]}>
        <div className="flex flex-wrap gap-2">
          <Badge tone={JOB_STATUS_TONE[j.jobStatus]}>{JOB_STATUS_LABEL[j.jobStatus]}</Badge>
          {j.isDemo && <Badge tone="demo">Demo</Badge>}
        </div>
      </PageHeader>
      <div className="container-site py-10 md:py-14">
        <div className="max-w-3xl">
          <dl className="grid gap-5 rounded-[10px] border border-stone-200 bg-white p-6 sm:grid-cols-3">
            <div className="flex gap-3">
              <Clock aria-hidden className="mt-0.5 size-5 text-earth" />
              <div>
                <dt className="font-semibold text-muted">Plazo de instancias</dt>
                <dd>{j.openingDate && `Del ${formatDate(j.openingDate, "day-month")} `}{j.deadline && `al ${formatDateTime(j.deadline)}`}</dd>
              </div>
            </div>
            {j.staffType && (
              <div className="flex gap-3">
                <Briefcase aria-hidden className="mt-0.5 size-5 text-earth" />
                <div>
                  <dt className="font-semibold text-muted">Tipo</dt>
                  <dd>{j.staffType}</dd>
                </div>
              </div>
            )}
            {j.positions && (
              <div className="flex gap-3">
                <Users aria-hidden className="mt-0.5 size-5 text-earth" />
                <div>
                  <dt className="font-semibold text-muted">Plazas</dt>
                  <dd>{j.positions}</dd>
                </div>
              </div>
            )}
          </dl>
          {j.body && <Prose markdown={j.body} className="mt-8" />}
          <p className="mt-8 text-ink-2">
            Las instancias se presentan en el Registro del Ayuntamiento o en la{" "}
            <a href={EXTERNAL.sede} target="_blank" rel="noopener noreferrer" className="link">Sede Electrónica</a> (Instancia general), con el modelo de instancia de la convocatoria. Consulte siempre las bases oficiales.
          </p>
          <DocumentList docs={j.documents} title="Bases, publicaciones y resoluciones" />
          <SourceNote sourceUrl={j.sourceUrl} sourceName={j.sourceName} lastVerifiedAt={j.lastVerifiedAt} />
        </div>
      </div>
    </>
  );
}
