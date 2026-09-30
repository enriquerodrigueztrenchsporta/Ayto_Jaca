import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Plus, Search } from "lucide-react";
import { getResource } from "@/lib/admin/resources";
import { delegate } from "@/lib/admin/service";
import { PublicationStatus } from "@/components/admin/PublicationStatus";
import { EmptyState } from "@/components/ui/States";
import { FilterBar } from "@/components/ui/FilterBar";
import { formatDate, formatDateTime } from "@/lib/dates";
import { normalize } from "@/lib/text";
import { param, type SearchParams } from "@/lib/seo";
import type { Publishable } from "@/lib/content/visibility";

type Props = { params: Promise<{ resource: string }>; searchParams: SearchParams };

export async function generateMetadata({ params }: Props) {
  const r = getResource((await params).resource);
  return { title: r?.label ?? "Contenido" };
}

const STATUS_FILTERS = [
  { key: "", label: "Todos" },
  { key: "DRAFT", label: "Borradores" },
  { key: "SCHEDULED", label: "Programados" },
  { key: "PUBLISHED", label: "Publicados" },
  { key: "ARCHIVED", label: "Archivados" },
];

export default async function ResourceListPage({ params, searchParams }: Props) {
  const resource = getResource((await params).resource);
  if (!resource) notFound();
  const sp = await searchParams;
  const status = param(sp, "estado") ?? "";
  const q = param(sp, "q")?.trim() ?? "";
  const d = delegate(resource);
  const where: Record<string, unknown> = {};
  if (resource.publishable && status) where.status = status;
  if (q) {
    const hasSearch = !["featuredContent", "area"].includes(resource.model);
    Object.assign(where, hasSearch ? { searchText: { contains: normalize(q) } } : { [resource.titleField]: { contains: q, mode: "insensitive" } });
  }
  const [items, total] = await Promise.all([d.findMany({ where, orderBy: resource.orderBy, take: 300 }), d.count({ where: {} })]);
  const base = `/admin/${resource.key}`;

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-h1 font-medium text-forest-900">{resource.label}</h1>
          <p className="mt-1 text-ink-2">{total} en total</p>
        </div>
        <Link href={`${base}/nuevo`} className="inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-forest-700 px-5 font-semibold text-snow hover:bg-forest-600">
          <Plus aria-hidden className="size-5" /> Añadir {resource.singular}
        </Link>
      </div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {resource.publishable ? (
          <FilterBar label="Filtrar por estado" options={STATUS_FILTERS.map((s) => ({ label: s.label, href: s.key ? `${base}?estado=${s.key}` : base, active: status === s.key }))} />
        ) : (
          <span />
        )}
        <form action={base} role="search" className="flex gap-2">
          {status && <input type="hidden" name="estado" value={status} />}
          <label htmlFor="admin-q" className="sr-only">Buscar en {resource.label}</label>
          <input id="admin-q" name="q" defaultValue={q} placeholder="Buscar…" className="min-h-11 w-56 rounded-[4px] border border-stone-300 bg-white px-3" />
          <button className="inline-flex min-h-11 items-center gap-1.5 rounded-[4px] border border-stone-300 bg-white px-3 font-semibold hover:bg-stone-100">
            <Search aria-hidden className="size-4" /> Buscar
          </button>
        </form>
      </div>

      {items.length === 0 ? (
        <EmptyState title="No hay contenidos con estos filtros" action={{ href: `${base}/nuevo`, label: `Añadir ${resource.singular}` }} />
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-stone-200 bg-white" role="region" aria-label={`Listado de ${resource.label}`} tabIndex={0}>
          <table className="w-full min-w-[720px] text-left">
            <caption className="sr-only">{resource.label}</caption>
            <thead className="bg-stone-100 text-[0.9375rem]">
              <tr>
                <th scope="col" className="px-4 py-3">Título</th>
                {resource.publishable && <th scope="col" className="px-4 py-3">Estado</th>}
                {resource.listColumns.map((c) => (
                  <th key={c.name} scope="col" className="px-4 py-3">{c.label}</th>
                ))}
                <th scope="col" className="px-4 py-3">Actualizado</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Ver en la web</span></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const id = String(item.id);
                const publicHref = resource.publicPath?.(item);
                return (
                  <tr key={id} className="border-t border-stone-200 align-top">
                    <th scope="row" className="max-w-md px-4 py-3 font-semibold">
                      <Link href={`${base}/${id}`} className="text-forest-700 hover:underline">
                        {String(item[resource.titleField] ?? "(sin título)")}
                      </Link>
                      {Boolean(item.isDemo) && <span className="ml-2 rounded bg-ink px-1.5 text-xs text-sand">DEMO</span>}
                    </th>
                    {resource.publishable && (
                      <td className="px-4 py-3">
                        <PublicationStatus item={item as unknown as Publishable} />
                      </td>
                    )}
                    {resource.listColumns.map((c) => {
                      const v = item[c.name];
                      let text = "—";
                      if (v instanceof Date) text = c.type === "datetime" ? formatDateTime(v) : formatDate(v, "short");
                      else if (typeof v === "boolean") text = v ? "Sí" : "No";
                      else if (v !== null && v !== undefined && v !== "") text = String(v);
                      return (
                        <td key={c.name} className="px-4 py-3 text-[0.9375rem] text-ink-2">{text}</td>
                      );
                    })}
                    <td className="px-4 py-3 text-[0.9375rem] text-muted">{item.updatedAt instanceof Date ? formatDate(item.updatedAt, "short") : "—"}</td>
                    <td className="px-4 py-3">
                      {publicHref && (
                        <a href={publicHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-forest-700 hover:underline">
                          Ver <ExternalLink aria-hidden className="size-3.5" />
                          <span className="sr-only">{String(item[resource.titleField])} en la web</span>
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
