import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/public/PageHeader";
import { ContactCard, GrantCard, ProcedureCard } from "@/components/public/cards";
import { SourceNote } from "@/components/public/SourceNote";
import { getArea } from "@/lib/queries/public";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const a = await getArea((await params).slug);
  if (!a) return {};
  return pageMetadata({ title: a.name, description: a.description ?? undefined, path: `/ayuntamiento/areas/${a.slug}` });
}

/** Caso E: "Quiero contactar con Urbanismo" → área, contacto, trámites y ubicación. */
export default async function AreaPage({ params }: Props) {
  const a = await getArea((await params).slug);
  if (!a) notFound();
  return (
    <>
      <PageHeader title={a.name} eyebrow="Área municipal" intro={a.description ?? undefined} crumbs={[{ label: "Ayuntamiento", href: "/ayuntamiento" }, { label: "Áreas", href: "/ayuntamiento/areas" }, { label: a.name }]} />
      <div className="container-site grid gap-12 py-10 md:py-14 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-8">
          <section aria-labelledby="tramites">
            <h2 id="tramites" className="mb-4 font-serif text-h2 font-medium">Trámites de esta área</h2>
            {a.procedures.length ? (
              <ul className="grid gap-4 sm:grid-cols-2">
                {a.procedures.map((p) => (
                  <li key={p.id}>
                    <ProcedureCard item={p} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink-2">
                Esta área no tiene trámites específicos publicados. Puedes dirigirte a ella mediante la <Link href="/tramites/instancia-general" className="link">Instancia general</Link>.
              </p>
            )}
          </section>
          {a.grants.length > 0 && (
            <section aria-labelledby="ayudas">
              <h2 id="ayudas" className="mb-4 font-serif text-h2 font-medium">Convocatorias</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {a.grants.map((g) => (
                  <li key={g.id}><GrantCard item={g} /></li>
                ))}
              </ul>
            </section>
          )}
          {a.pages.length > 0 && (
            <section aria-labelledby="info">
              <h2 id="info" className="mb-4 font-serif text-h2 font-medium">Más información</h2>
              <ul className="space-y-2">
                {a.pages.map((p) => (
                  <li key={p.id}><Link href={`/${p.path}`} className="link text-lg">{p.title}</Link></li>
                ))}
              </ul>
            </section>
          )}
          <SourceNote sourceUrl={a.sourceUrl} sourceName={a.sourceName} lastVerifiedAt={a.lastVerifiedAt} />
        </div>
        <aside className="space-y-4 lg:col-span-4">
          <ContactCard item={{ name: "Contacto", phone: a.phone, email: a.email, address: a.address, schedule: a.schedule, pending: a.pendingFields }} />
          {a.mapUrl && (
            <a href={a.mapUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-[4px] border-[1.5px] border-forest-700 font-semibold text-forest-700 hover:bg-forest-50">
              Ver ubicación en OpenStreetMap <ExternalLink aria-hidden className="size-4" /><span className="sr-only">(abre sitio externo)</span>
            </a>
          )}
          {a.webUrl && (
            <a href={a.webUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-forest-700 font-semibold text-snow hover:bg-forest-600">
              Web del servicio <ExternalLink aria-hidden className="size-4" /><span className="sr-only">(abre sitio externo)</span>
            </a>
          )}
        </aside>
      </div>
    </>
  );
}
