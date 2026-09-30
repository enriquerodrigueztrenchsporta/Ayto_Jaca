import { PageHeader } from "@/components/public/PageHeader";
import { NewsCard } from "@/components/public/cards";
import { FilterBar } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/States";
import { listNews, newsCategories } from "@/lib/queries/public";
import { pageMetadata, param, type SearchParams } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Noticias", description: "Noticias del Ayuntamiento de Jaca: actividad institucional, bandos, cultura, deporte y turismo.", path: "/actualidad/noticias" });

export default async function NewsListPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const categoria = param(sp, "categoria");
  const page = Math.max(1, Number(param(sp, "pagina") ?? 1) || 1);
  const [cats, { items, totalPages, total }] = await Promise.all([newsCategories(), listNews({ category: categoria, page })]);
  const href = (p: number) => `/actualidad/noticias?${new URLSearchParams({ ...(categoria ? { categoria } : {}), ...(p > 1 ? { pagina: String(p) } : {}) })}`;

  return (
    <>
      <PageHeader title="Noticias" eyebrow="Actualidad" intro="Todas las noticias municipales en un único lugar, filtrables por tema." crumbs={[{ label: "Actualidad", href: "/actualidad" }, { label: "Noticias" }]} />
      <div className="container-site py-10 md:py-14">
        <FilterBar
          label="Filtrar noticias por categoría"
          className="mb-8"
          options={[{ label: "Todas", href: "/actualidad/noticias", active: !categoria }, ...cats.map((c) => ({ label: c.name, href: `/actualidad/noticias?categoria=${c.slug}`, active: c.slug === categoria }))]}
        />
        <p className="sr-only" role="status">{total} noticias</p>
        {items.length ? (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((n, i) => (
              <li key={n.id} className={i === 0 && page === 1 && !categoria ? "md:col-span-2" : undefined}>
                <NewsCard item={n} variant={i === 0 && page === 1 && !categoria ? "feature" : "default"} headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No hay noticias en esta categoría" action={{ href: "/actualidad/noticias", label: "Ver todas las noticias" }} />
        )}
        <Pagination page={page} totalPages={totalPages} hrefFor={href} />
      </div>
    </>
  );
}
