import { PageHeader } from "@/components/public/PageHeader";
import { AlertItem } from "@/components/public/AlertBanner";
import { EmptyState } from "@/components/ui/States";
import { FilterBar } from "@/components/ui/FilterBar";
import { listActiveAlerts } from "@/lib/queries/public";
import { pageMetadata, param, type SearchParams } from "@/lib/seo";
import { ALERT_KIND_LABEL } from "@/lib/labels";

export const metadata = pageMetadata({ title: "Avisos", description: "Cortes, obras, cambios de tráfico, plazos, bandos y cambios de servicio vigentes en Jaca.", path: "/avisos" });

const GROUPS: Record<string, string[]> = {
  movilidad: ["MOVILIDAD", "OBRA", "CORTE"],
  plazos: ["PLAZO"],
  servicios: ["SERVICIO", "CIERRE", "GENERAL"],
  bandos: ["BANDO"],
};

export default async function AlertsPage({ searchParams }: { searchParams: SearchParams }) {
  const tipo = param(await searchParams, "tipo");
  const all = await listActiveAlerts();
  const alerts = tipo && GROUPS[tipo] ? all.filter((a) => GROUPS[tipo].includes(a.kind)) : all;
  return (
    <>
      <PageHeader
        title="Avisos"
        eyebrow="Qué necesitas saber hoy"
        intro="Avisos vigentes ordenados por prioridad. Cuando un aviso caduca deja de mostrarse automáticamente."
        crumbs={[{ label: "Actualidad", href: "/actualidad" }, { label: "Avisos" }]}
      />
      <div className="container-site py-10 md:py-14">
        <FilterBar
          label="Filtrar avisos"
          className="mb-8"
          options={[
            { label: "Todos", href: "/avisos", active: !tipo, count: all.length },
            { label: "Cortes, obras y movilidad", href: "/avisos?tipo=movilidad", active: tipo === "movilidad" },
            { label: "Plazos", href: "/avisos?tipo=plazos", active: tipo === "plazos" },
            { label: "Servicios y cierres", href: "/avisos?tipo=servicios", active: tipo === "servicios" },
            { label: ALERT_KIND_LABEL.BANDO + "s", href: "/avisos?tipo=bandos", active: tipo === "bandos" },
          ]}
        />
        {alerts.length ? (
          <ul className="grid max-w-4xl gap-4">
            {alerts.map((a) => (
              <li key={a.id}>
                <AlertItem alert={a} detailed />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No hay avisos vigentes de este tipo" description="Cuando se publique un corte, obra o plazo relevante aparecerá aquí." action={{ href: "/avisos", label: "Ver todos los avisos" }} />
        )}
      </div>
    </>
  );
}
