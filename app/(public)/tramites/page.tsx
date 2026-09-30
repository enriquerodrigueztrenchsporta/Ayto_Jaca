import { ExternalLink, Info } from "lucide-react";
import { PageHeader } from "@/components/public/PageHeader";
import { SearchBox } from "@/components/public/SearchBox";
import { ProcedureCard } from "@/components/public/cards";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/States";
import { listProcedures, procedureCategories } from "@/lib/queries/public";
import { getSearchProvider } from "@/lib/search";
import { pageMetadata, param, type SearchParams } from "@/lib/seo";
import { EXTERNAL } from "@/lib/site";
import { db } from "@/lib/db";

export const metadata = pageMetadata({
  title: "Trámites y servicios",
  description: "Buscador de trámites del Ayuntamiento de Jaca: qué necesitas, plazos, documentación y acceso directo a la Sede Electrónica.",
  path: "/tramites",
});

export default async function TramitesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = param(sp, "q")?.trim() ?? "";
  const categoria = param(sp, "categoria");
  const categories = await procedureCategories();
  const active = categories.find((c) => c.slug === categoria);

  let procedures = await listProcedures(active?.slug);
  if (q) {
    const res = await getSearchProvider().search(q, { types: ["procedure"], limitPerType: 40 });
    const ids = res.groups[0]?.results.map((r) => r.id) ?? [];
    const found = await db.procedure.findMany({ where: { id: { in: ids } }, include: { category: true } });
    procedures = ids.map((id) => found.find((p) => p.id === id)!).filter(Boolean);
  }

  const total = categories.reduce((n, c) => n + c._count.procedures, 0);
  return (
    <>
      <PageHeader
        title="Trámites y servicios"
        eyebrow="Qué necesitas hacer"
        intro="Busca con tus propias palabras: te decimos quién puede hacerlo, qué documentación necesitas y te llevamos directamente a la Sede Electrónica."
        crumbs={[{ label: "Trámites" }]}
      >
        <SearchBox scope="procedures" defaultValue={q} label="Buscar un trámite" hideLabel placeholder="Por ejemplo: empadronarme, licencia de obra, bonificación IBI…" />
      </PageHeader>

      <div className="container-site py-10 md:py-14">
        <FilterBar
          label="Categorías de trámites"
          className="mb-8"
          options={[
            { label: "Todos", href: "/tramites", active: !active && !q, count: total },
            ...categories.filter((c) => c._count.procedures > 0).map((c) => ({ label: c.name, href: `/tramites?categoria=${c.slug}`, active: active?.id === c.id, count: c._count.procedures })),
          ]}
        />

        <h2 className="sr-only">Resultados</h2>
        <p className="mb-6 text-ink-2" role="status" aria-live="polite">
          {q ? (
            <>
              {procedures.length} {procedures.length === 1 ? "trámite encontrado" : "trámites encontrados"} para <strong>«{q}»</strong>
            </>
          ) : active ? (
            <>
              {procedures.length} trámites en <strong>{active.name}</strong>
            </>
          ) : (
            <>{procedures.length} trámites disponibles</>
          )}
        </p>

        {procedures.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {procedures.map((p) => (
              <li key={p.id}>
                <ProcedureCard item={p} headingLevel="h3" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No hemos encontrado ese trámite"
            description="Prueba con otras palabras o busca en toda la web. También puedes presentar cualquier solicitud con la Instancia general."
            action={{ href: `/buscar?q=${encodeURIComponent(q)}`, label: "Buscar en toda la web" }}
          />
        )}

        <aside className="mt-14 grid gap-6 rounded-[10px] border border-stone-200 bg-white p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-8">
          <Info aria-hidden className="size-8 text-slate" />
          <div>
            <h2 className="font-semibold text-ink">¿Cómo funciona la Sede Electrónica?</h2>
            <p className="mt-1 text-ink-2">
              Necesitas certificado digital o Cl@ve para firmar. Si no lo tienes, muchos trámites pueden iniciarse con tu correo electrónico y firmarse en las oficinas municipales en los 10 días siguientes.
            </p>
          </div>
          <a href={EXTERNAL.sedeCatalog} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-forest-700 px-5 font-semibold text-snow hover:bg-forest-600">
            Catálogo de la Sede <ExternalLink aria-hidden className="size-4" />
            <span className="sr-only">(abre sitio externo)</span>
          </a>
        </aside>
      </div>
    </>
  );
}
