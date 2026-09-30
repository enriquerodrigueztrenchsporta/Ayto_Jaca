import { notFound } from "next/navigation";
import Link from "next/link";
import { Building, ExternalLink, KeyRound, Mail, MapPin, Monitor, Phone } from "lucide-react";
import { PageHeader } from "@/components/public/PageHeader";
import { DocumentList } from "@/components/public/cards";
import { SourceNote } from "@/components/public/SourceNote";
import { Badge } from "@/components/ui/Badge";
import { Prose } from "@/components/ui/Prose";
import { getProcedure } from "@/lib/queries/public";
import { pageMetadata } from "@/lib/seo";
import { PENDING, SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = await getProcedure(slug);
  if (!p) return {};
  return pageMetadata({ title: p.title, description: p.summary, path: `/tramites/${p.slug}` });
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-stone-200 py-8 first:border-t-0 first:pt-0">
      <h2 id={id} className="mb-3 font-serif text-h3 font-medium text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function ProcedurePage({ params }: Props) {
  const { slug } = await params;
  const p = await getProcedure(slug);
  if (!p) notFound();

  const sections = [
    { id: "que-es", title: "¿En qué consiste?", body: p.description },
    { id: "quien", title: "¿Quién puede solicitarlo?", body: p.whoCanApply },
    { id: "documentacion", title: "Documentación necesaria", body: p.documentation },
    { id: "requisitos", title: "Requisitos de la solicitud", body: p.requirements },
    { id: "plazo", title: "Plazo", body: p.deadline },
    { id: "coste", title: "Coste o tasa", body: p.cost },
    { id: "como", title: "Cómo hacerlo online", body: p.howToApply },
    { id: "presencial", title: "Cómo hacerlo en persona", body: p.inPerson },
  ].filter((s) => s.body);

  return (
    <>
      <PageHeader
        title={p.title}
        eyebrow={p.category?.name ?? "Trámite"}
        intro={p.summary}
        crumbs={[{ label: "Trámites", href: "/tramites" }, ...(p.category ? [{ label: p.category.name, href: `/tramites?categoria=${p.category.slug}` }] : []), { label: p.title }]}
      >
        <div className="flex flex-wrap gap-2">
          {p.online ? <Badge tone="ok"><Monitor aria-hidden className="size-3.5" /> Disponible online</Badge> : <Badge tone="slate">Solo presencial</Badge>}
          {p.requiresCertificate && <Badge tone="slate"><KeyRound aria-hidden className="size-3.5" /> Requiere certificado digital o Cl@ve</Badge>}
        </div>
      </PageHeader>

      <div className="container-site grid gap-12 py-10 md:py-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {sections.length > 2 && (
            <nav aria-label="En esta página" className="mb-10 rounded-[10px] bg-stone-100 p-5">
              <p className="mb-2 font-semibold text-ink">En esta página</p>
              <ul className="grid gap-1 sm:grid-cols-2">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="link">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          {sections.map((s) => (
            <Section key={s.id} id={s.id} title={s.title}>
              <Prose markdown={s.body!.replace(PENDING, `**${PENDING}**`)} />
            </Section>
          ))}
          <DocumentList docs={p.documents} title="Impresos y documentos relacionados" />
          <SourceNote sourceUrl={p.sourceUrl} sourceName={p.sourceName} lastVerifiedAt={p.lastVerifiedAt} />
        </div>

        <aside className="lg:col-span-4" aria-label="Hacer el trámite">
          <div className="sticky top-6 space-y-6">
            {p.sedeUrl && (
              <div className="rounded-[10px] bg-forest-900 p-6 text-snow">
                <p className="font-serif text-2xl">Hazlo online</p>
                <p className="mt-2 text-[0.9375rem] text-stone-300">Te llevamos a la ficha oficial de este trámite en la Sede Electrónica del Ayuntamiento.</p>
                <a
                  href={p.sedeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-sand px-5 font-semibold text-forest-900 hover:bg-snow"
                >
                  Hacer el trámite en la Sede <ExternalLink aria-hidden className="size-4" />
                  <span className="sr-only">(abre sitio externo)</span>
                </a>
              </div>
            )}
            <div className="rounded-[10px] border border-stone-200 bg-white p-6">
              <p className="flex items-center gap-2 font-semibold text-ink">
                <Building aria-hidden className="size-5 text-earth" /> Área responsable
              </p>
              {p.area ? (
                <>
                  <p className="mt-2">
                    <Link href={`/ayuntamiento/areas/${p.area.slug}`} className="link font-semibold">
                      {p.area.name}
                    </Link>
                  </p>
                  <ul className="mt-3 space-y-2 text-[0.9375rem] text-ink-2">
                    {p.area.phone && (
                      <li className="flex gap-2">
                        <Phone aria-hidden className="mt-0.5 size-4 text-muted" /> <a href={`tel:+34${p.area.phone.replace(/\D/g, "").slice(0, 9)}`} className="text-forest-700 hover:underline">{p.area.phone}</a>
                      </li>
                    )}
                    {p.area.email && (
                      <li className="flex gap-2 break-all">
                        <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-muted" /> <a href={`mailto:${p.area.email}`} className="text-forest-700 hover:underline">{p.area.email}</a>
                      </li>
                    )}
                    {p.area.address && (
                      <li className="flex gap-2">
                        <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-muted" /> {p.area.address}
                      </li>
                    )}
                  </ul>
                </>
              ) : (
                <p className="mt-2 text-ink-2">Atención general: {SITE.phone}</p>
              )}
            </div>
            <div className="rounded-[10px] border border-stone-200 bg-white p-6 text-[0.9375rem] text-ink-2">
              <p className="font-semibold text-ink">¿Dudas?</p>
              <p className="mt-1">
                Llama al <a href={SITE.phoneHref} className="font-semibold text-forest-700">{SITE.phone}</a> o consulta el{" "}
                <Link href="/contacto" className="link">directorio de contacto</Link>.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
