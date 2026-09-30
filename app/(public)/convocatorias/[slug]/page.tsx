import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ExternalLink, Users } from "lucide-react";
import { PageHeader } from "@/components/public/PageHeader";
import { DocumentList } from "@/components/public/cards";
import { SourceNote } from "@/components/public/SourceNote";
import { Badge } from "@/components/ui/Badge";
import { Prose } from "@/components/ui/Prose";
import { getGrant } from "@/lib/queries/public";
import { formatDate, formatDateTime } from "@/lib/dates";
import { GRANT_STATUS_LABEL, GRANT_STATUS_TONE } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const g = await getGrant((await params).slug);
  if (!g) return {};
  return pageMetadata({ title: g.title, description: g.summary, path: `/convocatorias/${g.slug}` });
}

export default async function GrantPage({ params }: Props) {
  const g = await getGrant((await params).slug);
  if (!g) notFound();
  return (
    <>
      <PageHeader title={g.title} eyebrow="Subvención" intro={g.summary} crumbs={[{ label: "Subvenciones y ayudas", href: "/convocatorias" }, { label: g.title }]}>
        <div className="flex flex-wrap gap-2">
          <Badge tone={GRANT_STATUS_TONE[g.grantStatus]}>{GRANT_STATUS_LABEL[g.grantStatus]}</Badge>
          {g.isDemo && <Badge tone="demo">Demo</Badge>}
        </div>
      </PageHeader>
      <div className="container-site grid gap-12 py-10 md:py-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <dl className="grid gap-5 rounded-[10px] border border-stone-200 bg-white p-6 sm:grid-cols-2">
            <div className="flex gap-3">
              <Clock aria-hidden className="mt-0.5 size-5 text-earth" />
              <div>
                <dt className="font-semibold text-muted">Plazo</dt>
                <dd>
                  {g.openingDate && <>Desde el {formatDate(g.openingDate, "medium")}<br /></>}
                  {g.deadline ? <>Hasta el {formatDateTime(g.deadline)}</> : g.deadlineText ?? "Consultar en la convocatoria"}
                </dd>
              </div>
            </div>
            {g.beneficiaries && (
              <div className="flex gap-3">
                <Users aria-hidden className="mt-0.5 size-5 text-earth" />
                <div>
                  <dt className="font-semibold text-muted">Destinatarios</dt>
                  <dd>{g.beneficiaries}</dd>
                </div>
              </div>
            )}
          </dl>
          {g.body && <Prose markdown={g.body} className="mt-8" />}
          <DocumentList docs={g.documents} title="Bases, extractos y anexos" />
          <SourceNote sourceUrl={g.sourceUrl} sourceName={g.sourceName} lastVerifiedAt={g.lastVerifiedAt} />
        </div>
        <aside className="space-y-4 lg:col-span-4">
          {g.sedeUrl && g.grantStatus === "OPEN" && (
            <div className="rounded-[10px] bg-forest-900 p-6 text-snow">
              <p className="font-serif text-2xl">Presenta tu solicitud</p>
              <p className="mt-2 text-[0.9375rem] text-stone-300">La tramitación (solicitud, subsanación, justificación…) se realiza en la Sede Electrónica.</p>
              <a href={g.sedeUrl} target="_blank" rel="noopener noreferrer" className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-sand px-5 font-semibold text-forest-900 hover:bg-snow">
                Ir a la Sede <ExternalLink aria-hidden className="size-4" /><span className="sr-only">(abre sitio externo)</span>
              </a>
            </div>
          )}
          {g.area && (
            <div className="rounded-[10px] border border-stone-200 bg-white p-6">
              <p className="font-semibold text-muted">Área responsable</p>
              <Link href={`/ayuntamiento/areas/${g.area.slug}`} className="link mt-1 inline-block font-semibold">{g.area.name}</Link>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
