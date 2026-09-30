import Link from "next/link";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/dates";
import { AUDIT_LABEL } from "@/lib/labels";
import { PREVIEW_TYPE, RESOURCE_LIST } from "@/lib/admin/resources";
import { Pagination } from "@/components/ui/Pagination";
import { param, type SearchParams } from "@/lib/seo";

export const metadata = { title: "Historial de cambios" };

const PAGE = 50;
const MODEL_LABEL: Record<string, string> = Object.fromEntries(RESOURCE_LIST.map((r) => [r.model, r.singular]));

export default async function HistoryPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Math.max(1, Number(param(await searchParams, "pagina") ?? 1) || 1);
  const [rows, total] = await Promise.all([db.auditLog.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE, take: PAGE }), db.auditLog.count()]);
  return (
    <div className="max-w-6xl">
      <h1 className="font-serif text-h1 font-medium text-forest-900">Historial de cambios</h1>
      <p className="mt-2 text-ink-2">Registro de quién cambió qué y cuándo. No se guardan contraseñas ni datos personales de la ciudadanía.</p>
      <div className="mt-8 overflow-x-auto rounded-[10px] border border-stone-200 bg-white" role="region" aria-label="Historial" tabIndex={0}>
        <table className="w-full min-w-[720px] text-left text-[0.9375rem]">
          <caption className="sr-only">Historial de cambios del panel</caption>
          <thead className="bg-stone-100">
            <tr>
              <th scope="col" className="px-4 py-3">Fecha</th>
              <th scope="col" className="px-4 py-3">Usuario</th>
              <th scope="col" className="px-4 py-3">Cambio</th>
              <th scope="col" className="px-4 py-3">Contenido</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const key = PREVIEW_TYPE[r.entityType as keyof typeof PREVIEW_TYPE];
              return (
                <tr key={r.id} className="border-t border-stone-200">
                  <td className="whitespace-nowrap px-4 py-2.5 text-muted">{formatDateTime(r.createdAt)}</td>
                  <td className="px-4 py-2.5">{r.userEmail ?? "Sistema"}</td>
                  <td className="px-4 py-2.5 font-semibold">{AUDIT_LABEL[r.action] ?? r.action}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-muted">{MODEL_LABEL[r.entityType] ?? r.entityType}: </span>
                    {key && r.entityId && r.action !== "DELETE" ? (
                      <Link href={`/admin/${key}/${r.entityId}`} className="text-forest-700 hover:underline">{r.entityTitle}</Link>
                    ) : (
                      r.entityTitle
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PAGE))} hrefFor={(p) => `/admin/historial?pagina=${p}`} />
    </div>
  );
}
