import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "./PageHeader";
import { ContactCard, DocumentList } from "./cards";
import { SourceNote } from "./SourceNote";
import { Prose } from "@/components/ui/Prose";
import { getPage, listSectionPages } from "@/lib/queries/public";
import { pageMetadata } from "@/lib/seo";
import { PENDING } from "@/lib/site";

export const SECTION_LABEL: Record<string, { label: string; href: string }> = {
  ciudad: { label: "Ciudad", href: "/ciudad" },
  cultura: { label: "Cultura", href: "/cultura" },
  deportes: { label: "Deportes", href: "/deportes" },
  turismo: { label: "Turismo", href: "/turismo" },
  ayuntamiento: { label: "Ayuntamiento", href: "/ayuntamiento" },
  "desarrollo-economico": { label: "Desarrollo económico", href: "/desarrollo-economico" },
};

export async function cmsPageMetadata(section: string, segments: string[]) {
  const page = await getPage([section, ...segments].join("/"));
  if (!page) return {};
  return pageMetadata({ title: page.title, description: page.summary ?? undefined, path: `/${page.path}`, image: page.image?.url });
}

/** Página de contenido gestionada desde el panel (modelo Page). */
export async function CmsPage({ section, segments }: { section: string; segments: string[] }) {
  const page = await getPage([section, ...segments].join("/"));
  if (!page) notFound();
  const siblings = (await listSectionPages(section)).filter((p) => p.id !== page.id);
  const sec = SECTION_LABEL[section];
  const body = page.body.replace(/>\s*Pendiente de validaci[oó]n[^\n]*/gi, (m) => m.replace(/Pendiente de validación( por el Ayuntamiento)?/i, `**${PENDING}**`));

  return (
    <>
      <PageHeader title={page.title} intro={page.summary ?? undefined} eyebrow={sec?.label} crumbs={[...(sec ? [{ label: sec.label, href: sec.href }] : []), { label: page.title }]} />
      <div className="container-site grid gap-12 py-10 md:py-14 lg:grid-cols-12">
        <article className="lg:col-span-8">
          {page.image && (
            <figure className="mb-10">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[10px] bg-stone-100">
                <Image src={page.image.url} alt={page.image.alt} fill sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" priority />
              </div>
              {page.image.credit && <figcaption className="mt-2 text-[0.8125rem] text-muted">Foto: {page.image.credit} · Wikimedia Commons</figcaption>}
            </figure>
          )}
          <Prose markdown={body} />
          <DocumentList docs={page.documents} />
          <SourceNote sourceUrl={page.sourceUrl} sourceName={page.sourceName} lastVerifiedAt={page.lastVerifiedAt} />
        </article>
        <aside className="space-y-6 lg:col-span-4">
          {page.area && (
            <ContactCard
              item={{ name: page.area.name, phone: page.area.phone, email: page.area.email, address: page.area.address, schedule: page.area.schedule, href: `/ayuntamiento/areas/${page.area.slug}`, pending: page.area.pendingFields }}
            />
          )}
          {siblings.length > 0 && sec && (
            <nav aria-label={`Más en ${sec.label}`} className="rounded-[10px] border border-stone-200 bg-white p-6">
              <p className="mb-3 font-semibold text-ink">Más en {sec.label}</p>
              <ul className="space-y-2">
                {siblings.map((s) => (
                  <li key={s.id}>
                    <Link href={`/${s.path}`} className="link">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
      </div>
    </>
  );
}
