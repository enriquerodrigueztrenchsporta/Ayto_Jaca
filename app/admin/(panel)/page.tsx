import Link from "next/link";
import { AlertTriangle, ArrowRight, Bell, CalendarDays, CalendarRange, ClipboardList, FilePen, HandCoins, Hourglass, Newspaper } from "lucide-react";
import { runLifecycle } from "@/lib/content/lifecycle";
import { staleItems, VERIFY_DAYS, weekStats } from "@/lib/admin/dashboard";
import { db } from "@/lib/db";
import { formatDate, formatDateTime, weekLabel } from "@/lib/dates";
import { CHECKLIST } from "@/lib/weekly/service";
import { AUDIT_LABEL } from "@/lib/labels";
import { createWeeklyAction } from "../actions";
import { LifecycleButton } from "./LifecycleButton";

export const metadata = { title: "Resumen" };

export default async function DashboardPage() {
  // Ordena estados (programado → publicado, caducado → archivado) al abrir el panel.
  await runLifecycle();
  const [stats, stale, recent, weekly] = await Promise.all([
    weekStats(),
    staleItems(),
    db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    db.weeklyUpdate.findFirst({ orderBy: { createdAt: "desc" } }),
  ]);
  const checklist = (weekly?.checklist ?? {}) as Record<string, boolean>;
  const done = CHECKLIST.filter((c) => checklist[c]).length;

  const cards = [
    { label: "Avisos activos", value: stats.activeAlerts, href: "/admin/avisos?estado=PUBLISHED", icon: Bell },
    { label: "Noticias publicadas esta semana", value: stats.newsThisWeek, href: "/admin/noticias", icon: Newspaper },
    { label: "Eventos en los próximos 14 días", value: stats.upcomingEvents, href: "/admin/agenda", icon: CalendarDays },
    { label: "Convocatorias abiertas", value: stats.openGrants, href: "/admin/convocatorias", icon: HandCoins },
    { label: "Contenidos pendientes de revisión", value: stats.pendingReview, href: "#pendientes", icon: FilePen, note: `${stats.drafts} borradores · ${stats.stale} sin verificar` },
    { label: "Contenidos que caducan esta semana", value: stats.expiringThisWeek, href: "/admin/avisos", icon: Hourglass },
  ];

  return (
    <div className="max-w-6xl space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{weekLabel(new Date())}</p>
          <h1 className="mt-1 font-serif text-h1 font-medium text-forest-900">Esta semana</h1>
        </div>
        <LifecycleButton />
      </div>

      <section aria-label="Indicadores de la semana">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <li key={c.label}>
              <Link href={c.href} className="group flex h-full items-start gap-4 rounded-[10px] border border-stone-200 bg-white p-5 hover:border-forest-700">
                <c.icon aria-hidden className="mt-1 size-6 shrink-0 text-earth" />
                <span>
                  <span className="block font-serif text-4xl text-forest-900">{c.value}</span>
                  <span className="block font-semibold text-ink group-hover:text-forest-700">{c.label}</span>
                  {c.note && <span className="text-sm text-muted">{c.note}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="semanal" className="grid gap-6 rounded-[10px] bg-forest-900 p-6 text-snow md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div>
          <h2 id="semanal" className="flex items-center gap-2 font-serif text-h2">
            <CalendarRange aria-hidden className="size-7 text-sand" /> Actualización semanal
          </h2>
          <p className="mt-2 max-w-2xl text-stone-300">
            Avisos, noticias, agenda, convocatorias, empleo, plenos y movilidad en un único formulario. Revisa, previsualiza y publica todo de una vez.
          </p>
          {weekly && (
            <p className="mt-3 text-[0.9375rem] text-mist">
              Última: {weekly.weekLabel} · {weekly.status === "PUBLISHED" ? `publicada el ${formatDate(weekly.publishedAt, "medium")}` : "borrador en curso"} · checklist {done}/{CHECKLIST.length}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {weekly && weekly.status === "DRAFT" && (
            <Link href={`/admin/actualizacion-semanal/${weekly.id}`} className="inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-sand px-5 font-semibold text-forest-900 hover:bg-snow">
              Continuar borrador <ArrowRight aria-hidden className="size-4" />
            </Link>
          )}
          <form action={createWeeklyAction}>
            <button className="inline-flex min-h-12 items-center gap-2 rounded-[4px] border border-mist/60 px-5 font-semibold hover:bg-forest-800">
              <ClipboardList aria-hidden className="size-5" /> Nueva actualización
            </button>
          </form>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section id="pendientes" aria-labelledby="verif" className="rounded-[10px] border border-stone-200 bg-white p-6">
          <h2 id="verif" className="flex items-center gap-2 font-serif text-h3 font-medium">
            <AlertTriangle aria-hidden className="size-5 text-important" /> Datos a verificar
          </h2>
          <p className="mt-1 text-sm text-muted">Trámites, contactos y subvenciones que no se verifican desde hace más de {VERIFY_DAYS} días.</p>
          {stale.length ? (
            <ul className="mt-4 divide-y divide-stone-200">
              {stale.map((s) => (
                <li key={s.href} className="py-2.5">
                  <Link href={s.href} className="font-semibold text-forest-700 hover:underline">{s.title}</Link>
                  <p className="text-sm text-important">
                    {s.type} · {s.lastVerifiedAt ? `Este dato no se verifica desde hace ${Math.floor((Date.now() - s.lastVerifiedAt.getTime()) / 86400000)} días` : "Sin fecha de verificación"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-[6px] bg-ok-50 px-4 py-3 font-semibold text-ok">Todo verificado en los últimos {VERIFY_DAYS} días.</p>
          )}
        </section>
        <section aria-labelledby="recientes" className="rounded-[10px] border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 id="recientes" className="font-serif text-h3 font-medium">Últimos cambios</h2>
            <Link href="/admin/historial" className="text-sm font-semibold text-forest-700 hover:underline">Ver historial</Link>
          </div>
          <ol className="mt-4 space-y-2.5 text-[0.9375rem]">
            {recent.map((r) => (
              <li key={r.id} className="flex flex-wrap gap-x-2">
                <span className="text-muted">{formatDateTime(r.createdAt)}</span>
                <span className="font-semibold">{AUDIT_LABEL[r.action]}</span>
                <span className="text-ink-2">{r.entityTitle}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
