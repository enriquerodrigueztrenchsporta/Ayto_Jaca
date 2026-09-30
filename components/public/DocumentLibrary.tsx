import { DocumentCard } from "./cards";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/States";
import { documentCategories, listDocuments } from "@/lib/queries/public";
import { normalize } from "@/lib/text";

/** Biblioteca documental filtrable por categoría y texto. */
export async function DocumentLibrary({ basePath, category, q, onlyCategories }: { basePath: string; category?: string; q?: string; onlyCategories?: string[] }) {
  const cats = (await documentCategories()).filter((c) => (onlyCategories ? onlyCategories.includes(c.slug) : true) && c._count.documents > 0);
  const selected = category && cats.some((c) => c.slug === category) ? category : undefined;
  let docs = await listDocuments(selected ?? (onlyCategories ? cats.map((c) => c.slug) : undefined));
  if (q) {
    const nq = normalize(q);
    docs = docs.filter((d) => d.searchText.includes(nq) || normalize(d.title).includes(nq));
  }
  const grouped = new Map<string, typeof docs>();
  for (const d of docs) grouped.set(d.category?.name ?? "Otros", [...(grouped.get(d.category?.name ?? "Otros") ?? []), d]);

  return (
    <div>
      <form action={basePath} role="search" className="mb-6 flex max-w-xl gap-2">
        {selected && <input type="hidden" name="categoria" value={selected} />}
        <label htmlFor="doc-q" className="sr-only">Buscar documentos</label>
        <input id="doc-q" name="q" defaultValue={q} placeholder="Buscar por título…" className="h-12 min-w-0 flex-1 rounded-[4px] border border-stone-300 bg-white px-4" />
        <button className="h-12 rounded-[4px] bg-forest-700 px-5 font-semibold text-snow hover:bg-forest-600">Buscar</button>
      </form>
      <FilterBar
        label="Categorías de documentos"
        className="mb-8"
        options={[{ label: "Todos", href: basePath, active: !selected }, ...cats.map((c) => ({ label: c.name, href: `${basePath}?categoria=${c.slug}`, active: selected === c.slug, count: c._count.documents }))]}
      />
      <p role="status" className="mb-6 text-ink-2">{docs.length} documentos</p>
      {docs.length ? (
        <div className="space-y-10">
          {[...grouped.entries()].map(([name, items]) => (
            <section key={name} aria-label={name}>
              <h2 className="mb-4 font-serif text-h3 font-medium">{name}</h2>
              <ul className="grid gap-3 lg:grid-cols-2">
                {items.map((d) => (
                  <li key={d.id}>
                    <DocumentCard doc={d} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState title="No hay documentos que coincidan" action={{ href: basePath, label: "Ver todos" }} />
      )}
    </div>
  );
}
