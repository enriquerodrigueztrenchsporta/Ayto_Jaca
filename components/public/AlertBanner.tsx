import Link from "next/link";
import { AlertOctagon, AlertTriangle, ArrowRight, Info, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/dates";
import { ALERT_KIND_LABEL, PRIORITY_LABEL, PRIORITY_TONE } from "@/lib/labels";
import type { AlertKind, AlertPriority } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/cn";

export type AlertData = {
  id: string;
  title: string;
  summary: string;
  body?: string | null;
  priority: AlertPriority;
  kind: AlertKind;
  startsAt: Date;
  endsAt?: Date | null;
  url?: string | null;
  zone?: string | null;
  affectation?: string | null;
  alternative?: string | null;
  mapUrl?: string | null;
  area?: { name: string } | null;
  isDemo?: boolean;
};

const ICON = { URGENT: AlertOctagon, IMPORTANT: AlertTriangle, NORMAL: Info };
const BORDER = { URGENT: "border-l-urgent", IMPORTANT: "border-l-important", NORMAL: "border-l-slate" };
const ICON_COLOR = { URGENT: "text-urgent", IMPORTANT: "text-important", NORMAL: "text-slate" };

function period(a: AlertData) {
  if (a.endsAt) return `Del ${formatDate(a.startsAt, "day-month")} al ${formatDate(a.endsAt, "medium")}`;
  return `Desde el ${formatDate(a.startsAt, "medium")}`;
}

/** Aviso con prioridad visible (texto + icono + color) y vigencia. */
export function AlertItem({ alert, detailed = false }: { alert: AlertData; detailed?: boolean }) {
  const Icon = ICON[alert.priority];
  return (
    <article id={`aviso-${alert.id}`} className={cn("rounded-[8px] border border-l-4 border-stone-200 bg-white p-5", BORDER[alert.priority])}>
      <div className="flex items-start gap-3">
        <Icon aria-hidden className={cn("mt-0.5 size-6 shrink-0", ICON_COLOR[alert.priority])} />
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <Badge tone={PRIORITY_TONE[alert.priority]}>{PRIORITY_LABEL[alert.priority]}</Badge>
            <span className="text-[0.9375rem] font-semibold text-ink-2">{ALERT_KIND_LABEL[alert.kind]}</span>
            {alert.isDemo && <Badge tone="demo">Demo</Badge>}
          </div>
          <h3 className="text-lg font-semibold leading-snug text-ink">{alert.title}</h3>
          <p className="mt-1 text-ink-2">{alert.summary}</p>
          <p className="mt-2 text-[0.9375rem] text-muted">
            {period(alert)}
            {alert.area && <> · {alert.area.name}</>}
          </p>
          {detailed && (alert.zone || alert.affectation || alert.alternative) && (
            <dl className="mt-4 grid gap-3 rounded-[6px] bg-stone-100 p-4 text-[0.9375rem] sm:grid-cols-3">
              {alert.zone && (
                <div>
                  <dt className="font-semibold text-ink">Zona</dt>
                  <dd className="text-ink-2">{alert.zone}</dd>
                </div>
              )}
              {alert.affectation && (
                <div>
                  <dt className="font-semibold text-ink">Afectación</dt>
                  <dd className="text-ink-2">{alert.affectation}</dd>
                </div>
              )}
              {alert.alternative && (
                <div>
                  <dt className="font-semibold text-ink">Alternativa</dt>
                  <dd className="text-ink-2">{alert.alternative}</dd>
                </div>
              )}
            </dl>
          )}
          {detailed && alert.body && <p className="mt-3 whitespace-pre-line text-ink-2">{alert.body}</p>}
          <div className="mt-3 flex flex-wrap gap-4">
            {alert.url && (
              <a href={alert.url} className="inline-flex items-center gap-1 font-semibold text-forest-700 hover:underline" {...(/^https?:/.test(alert.url) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                Más información <ArrowRight aria-hidden className="size-4" />
              </a>
            )}
            {detailed && alert.mapUrl && (
              <a href={alert.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-forest-700 hover:underline">
                <MapPin aria-hidden className="size-4" /> Ver en el mapa<span className="sr-only"> (abre sitio externo)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function AlertStrip({ alerts }: { alerts: AlertData[] }) {
  if (!alerts.length) return null;
  const top = alerts[0];
  return (
    <div className={cn("border-b", top.priority === "URGENT" ? "border-urgent/30 bg-urgent-50" : "border-important/20 bg-important-50")}>
      <div className="container-site flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-ink">
          <AlertTriangle aria-hidden className={cn("mt-0.5 size-5 shrink-0", ICON_COLOR[top.priority])} />
          <span>
            <strong>{PRIORITY_LABEL[top.priority]}:</strong> {top.title}
          </span>
        </p>
        <Link href="/avisos" className="shrink-0 font-semibold text-forest-700 underline underline-offset-4">
          {alerts.length > 1 ? `Ver los ${alerts.length} avisos` : "Ver aviso"}
        </Link>
      </div>
    </div>
  );
}
