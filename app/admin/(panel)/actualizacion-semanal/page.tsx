import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/dates";
import { createWeeklyAction } from "../../actions";
import { EmptyState } from "@/components/ui/States";

export const metadata = { title: "Actualización semanal" };

export default async function WeeklyListPage() {
  const updates = await db.weeklyUpdate.findMany({ orderBy: { createdAt: "desc" }, take: 30, include: { createdBy: { select: { name: true } }, _count: { select: { news: true, events: true, alerts: true, grants: true, jobs: true, sessions: true } } } });
  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-h1 font-medium text-forest-900">Actualización semanal</h1>
          <p className="mt-2 max-w-2xl text-ink-2">Un único formulario para todo lo que cambia cada semana: avisos, noticias, agenda, convocatorias, empleo, plenos, cortes y destacados de portada.</p>
        </div>
        <form action={createWeeklyAction}>
          <button className="inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-forest-700 px-5 font-semibold text-snow hover:bg-forest-600">
            <ClipboardList aria-hidden className="size-5" /> Empezar la actualización de esta semana
          </button>
        </form>
      </div>
      {updates.length === 0 ? (
        <EmptyState title="Todavía no hay actualizaciones semanales" description="Pulsa «Empezar la actualización de esta semana» para crear la primera." />
      ) : (
        <ul className="divide-y divide-stone-200 rounded-[10px] border border-stone-200 bg-white">
          {updates.map((u) => {
            const total = Object.values(u._count).reduce((a, b) => a + b, 0);
            return (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <Link href={`/admin/actualizacion-semanal/${u.id}`} className="text-lg font-semibold text-forest-700 hover:underline">
                    {u.weekLabel}
                  </Link>
                  <p className="text-[0.9375rem] text-muted">
                    {total} contenidos · creada por {u.createdBy?.name ?? "—"} · {u.status === "PUBLISHED" ? `publicada el ${formatDate(u.publishedAt, "medium")}` : "borrador"}
                  </p>
                </div>
                <span className={u.status === "PUBLISHED" ? "rounded-[4px] bg-ok-50 px-2 py-0.5 text-sm font-semibold text-ok" : "rounded-[4px] bg-stone-100 px-2 py-0.5 text-sm font-semibold text-ink-2"}>
                  {u.status === "PUBLISHED" ? "Publicada" : "Borrador"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
