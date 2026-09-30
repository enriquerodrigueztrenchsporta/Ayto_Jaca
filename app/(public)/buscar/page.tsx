import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/public/PageHeader";
import { SearchBox } from "@/components/public/SearchBox";
import { EmptyState } from "@/components/ui/States";
import { getSearchProvider } from "@/lib/search";
import { formatDate } from "@/lib/dates";
import { pageMetadata, param, type SearchParams } from "@/lib/seo";

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const q = param(await searchParams, "q");
  return pageMetadata({ title: q ? `Buscar: ${q}` : "Buscar", path: "/buscar", noindex: true });
}

const SUGGESTIONS = ["empadronarme", "pagar una tasa", "licencia de obra", "bonificación IBI", "presentar una instancia", "subvención", "certificado", "factura electrónica"];

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const q = (param(await searchParams, "q") ?? "").trim().slice(0, 120);
  const res = q ? await getSearchProvider().search(q, { limitPerType: 8 }) : null;

  return (
    <>
      <PageHeader title="Buscar en la web" crumbs={[{ label: "Buscar" }]} tone="snow">
        <SearchBox defaultValue={q} label="Qué estás buscando" hideLabel size="lg" />
      </PageHeader>
      <div className="container-site py-10 md:py-14">
        {!q && (
          <div>
            <h2 className="font-serif text-h3">Búsquedas frecuentes</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <Link href={`/buscar?q=${encodeURIComponent(s)}`} className="inline-flex min-h-11 items-center rounded-full border border-stone-300 bg-white px-4 font-semibold text-ink-2 hover:border-forest-700 hover:text-forest-700">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {res && (
          <>
            <p role="status" aria-live="polite" className="mb-8 text-lg text-ink-2">
              {res.total ? (
                <>
                  {res.total} resultados para <strong className="text-ink">«{q}»</strong>, agrupados por tipo.
                </>
              ) : (
                <>Sin resultados para «{q}».</>
              )}
            </p>
            {res.total === 0 && (
              <EmptyState
                title="No hemos encontrado resultados"
                description="Revisa la ortografía, usa palabras más generales o explora los trámites por categoría."
                action={{ href: "/tramites", label: "Ver todos los trámites" }}
              />
            )}
            {res.groups.length > 1 && (
              <nav aria-label="Tipos de resultado" className="mb-10 flex flex-wrap gap-2">
                {res.groups.map((g) => (
                  <a key={g.type} href={`#grupo-${g.type}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-300 bg-white px-4 font-semibold text-ink-2 hover:border-forest-700">
                    {g.label} <span className="text-muted">{g.results.length}</span>
                  </a>
                ))}
              </nav>
            )}
            <div className="space-y-12">
              {res.groups.map((g) => (
                <section key={g.type} id={`grupo-${g.type}`} aria-labelledby={`h-${g.type}`}>
                  <h2 id={`h-${g.type}`} className="mb-4 border-b border-stone-200 pb-2 font-serif text-h3 font-medium">
                    {g.label}
                  </h2>
                  <ul className="divide-y divide-stone-200">
                    {g.results.map((r) => (
                      <li key={r.id} className="py-4">
                        <h3 className="text-lg font-semibold">
                          {r.external ? (
                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-forest-700 hover:underline">
                              {r.title} <ExternalLink aria-hidden className="size-4" />
                              <span className="sr-only">(abre sitio externo)</span>
                            </a>
                          ) : (
                            <Link href={r.url} className="text-forest-700 hover:underline">
                              {r.title}
                            </Link>
                          )}
                        </h3>
                        <p className="mt-1 text-ink-2">{r.summary}</p>
                        {r.date && <p className="mt-1 text-[0.9375rem] text-muted">{formatDate(new Date(r.date), "medium")}</p>}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
