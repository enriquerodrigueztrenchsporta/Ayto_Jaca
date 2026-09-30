import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { DocumentList, NewsCard } from "@/components/public/cards";
import { SourceNote } from "@/components/public/SourceNote";
import { Badge } from "@/components/ui/Badge";
import { Prose } from "@/components/ui/Prose";
import { JsonLd } from "@/components/ui/JsonLd";
import { getNews, listNews } from "@/lib/queries/public";
import { formatDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/env";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const n = await getNews((await params).slug);
  if (!n) return {};
  return pageMetadata({ title: n.title, description: n.excerpt, path: `/actualidad/noticias/${n.slug}`, type: "article", image: n.image?.url });
}

export default async function NewsDetailPage({ params }: Props) {
  const n = await getNews((await params).slug);
  if (!n) notFound();
  const related = (await listNews({ category: n.category?.slug, pageSize: 4 })).items.filter((x) => x.id !== n.id).slice(0, 3);
  const links = (Array.isArray(n.links) ? n.links : []) as Array<{ label: string; url: string }>;

  return (
    <article>
      <header className="border-b border-stone-200 bg-stone-100">
        <div className="container-site pb-10 pt-6">
          <Breadcrumbs items={[{ label: "Actualidad", href: "/actualidad" }, { label: "Noticias", href: "/actualidad/noticias" }, { label: n.title }]} />
          <div className="mx-auto mt-10 max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-muted">
              {n.category && (
                <Link href={`/actualidad/noticias?categoria=${n.category.slug}`}>
                  <Badge tone="earth">{n.category.name}</Badge>
                </Link>
              )}
              <time dateTime={n.date.toISOString()}>{formatDate(n.date, "long")}</time>
              {n.isDemo && <Badge tone="demo">Demo</Badge>}
            </div>
            <h1 className="font-serif text-h1 font-medium text-forest-900">{n.title}</h1>
            <p className="mt-5 text-xl leading-relaxed text-ink-2">{n.excerpt}</p>
            {n.author && <p className="mt-4 text-muted">Por {n.author}</p>}
          </div>
        </div>
      </header>
      {n.image && (
        <figure className="container-site mt-10">
          <div className="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-[10px] bg-stone-100">
            <Image src={n.image.url} alt={n.imageAlt ?? n.image.alt} fill priority sizes="(min-width: 1024px) 900px, 100vw" className="object-cover" />
          </div>
          {n.image.credit && <figcaption className="mx-auto mt-2 max-w-4xl text-[0.875rem] text-muted">Foto: {n.image.credit}{n.image.license ? ` · ${n.image.license}` : ""}</figcaption>}
        </figure>
      )}
      <div className="container-site py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <Prose markdown={n.body} />
          {links.length > 0 && (
            <section aria-labelledby="enlaces" className="mt-10">
              <h2 id="enlaces" className="mb-3 font-serif text-h3 font-medium">Enlaces</h2>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1.5 font-semibold">
                      {l.label} <ExternalLink aria-hidden className="size-4" /><span className="sr-only">(abre sitio externo)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <DocumentList docs={n.documents} />
          <SourceNote sourceUrl={n.sourceUrl} sourceName={n.sourceName} lastVerifiedAt={n.lastVerifiedAt} />
        </div>
      </div>
      {related.length > 0 && (
        <aside aria-labelledby="relacionadas" className="border-t border-stone-200 bg-white py-14">
          <div className="container-site">
            <h2 id="relacionadas" className="mb-6 font-serif text-h2 font-medium">Más noticias</h2>
            <ul className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <NewsCard item={r} />
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: n.title,
          description: n.excerpt,
          datePublished: n.date.toISOString(),
          dateModified: n.updatedAt.toISOString(),
          mainEntityOfPage: `${siteUrl()}/actualidad/noticias/${n.slug}`,
          ...(n.image ? { image: [`${siteUrl()}${n.image.url}`] } : {}),
          publisher: { "@type": "GovernmentOrganization", name: SITE.name },
          author: { "@type": "GovernmentOrganization", name: n.author ?? SITE.name },
        }}
      />
    </article>
  );
}
