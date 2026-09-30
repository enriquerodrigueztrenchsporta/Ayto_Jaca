import Link from "next/link";
import { PageHeader } from "@/components/public/PageHeader";
import { GrantCard } from "@/components/public/cards";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/States";
import { grantCounts, listGrants } from "@/lib/queries/public";
import { GRANT_STATUS_LABEL } from "@/lib/labels";
import { pageMetadata, param, type SearchParams } from "@/lib/seo";
import type { GrantStatus } from "@/lib/generated/prisma/enums";

export const metadata = pageMetadata({ title: "Subvenciones y ayudas", description: "Convocatorias de subvenciones y ayudas del Ayuntamiento de Jaca: próximas, abiertas, cerradas y concedidas.", path: "/convocatorias" });

const STATUS: Record<string, GrantStatus> = { proxima: "UPCOMING", abierta: "OPEN", cerrada: "CLOSED", concedida: "AWARDED" };

export default async function GrantsPage({ searchParams }: { searchParams: SearchParams }) {
  const estado = param(await searchParams, "estado");
  const status = estado ? STATUS[estado] : undefined;
  const [grants, counts] = await Promise.all([listGrants(status), grantCounts()]);
  const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
  return (
    <>
      <PageHeader
        title="Subvenciones y ayudas"
        eyebrow="Convocatorias"
        intro="Consulta qué convocatorias están abiertas, a quién se dirigen y hasta cuándo puedes presentar la solicitud."
        crumbs={[{ label: "Trámites", href: "/tramites" }, { label: "Subvenciones y ayudas" }]}
      />
      <div className="container-site py-10 md:py-14">
        <FilterBar
          label="Filtrar por estado"
          className="mb-8"
          options={[
            { label: "Todas", href: "/convocatorias", active: !status, count: total },
            ...Object.entries(STATUS).map(([slug, s]) => ({ label: GRANT_STATUS_LABEL[s] + "s", href: `/convocatorias?estado=${slug}`, active: status === s, count: counts[s] ?? 0 })),
          ]}
        />
        {grants.length ? (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {grants.map((g) => (
              <li key={g.id}>
                <GrantCard item={g} headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No hay convocatorias en este estado" action={{ href: "/convocatorias", label: "Ver todas" }} />
        )}
        <p className="mt-12 max-w-3xl text-[0.9375rem] text-muted">
          Todas las convocatorias se publican también en la Base de Datos Nacional de Subvenciones y en los boletines oficiales. Las solicitudes se presentan en la{" "}
          <Link href="/tramites?categoria=ayudas-y-subvenciones" className="link">Sede Electrónica</Link>.
        </p>
      </div>
    </>
  );
}
