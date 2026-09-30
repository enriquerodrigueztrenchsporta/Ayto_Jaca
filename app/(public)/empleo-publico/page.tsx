import { PageHeader } from "@/components/public/PageHeader";
import { JobCard } from "@/components/public/cards";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/States";
import { listJobs } from "@/lib/queries/public";
import { JOB_STATUS_LABEL } from "@/lib/labels";
import { pageMetadata, param, type SearchParams } from "@/lib/seo";
import type { JobStatus } from "@/lib/generated/prisma/enums";

export const metadata = pageMetadata({ title: "Empleo público", description: "Procesos selectivos, oposiciones y bolsas de empleo del Ayuntamiento de Jaca.", path: "/empleo-publico" });

const STATUS: Record<string, JobStatus> = { abierto: "OPEN", proximo: "UPCOMING", "en-curso": "IN_PROGRESS", finalizado: "CLOSED" };

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }) {
  const estado = param(await searchParams, "estado");
  const status = estado ? STATUS[estado] : undefined;
  const [all, jobs] = await Promise.all([listJobs(), listJobs(status)]);
  return (
    <>
      <PageHeader title="Empleo público" eyebrow="Procesos selectivos" intro="Plazas, bolsas de trabajo y programas de formación convocados por el Ayuntamiento, con sus bases y publicaciones oficiales." crumbs={[{ label: "Trámites", href: "/tramites" }, { label: "Empleo público" }]} />
      <div className="container-site py-10 md:py-14">
        <FilterBar
          label="Filtrar por estado"
          className="mb-8"
          options={[
            { label: "Todos", href: "/empleo-publico", active: !status, count: all.length },
            ...Object.entries(STATUS).map(([slug, s]) => ({ label: JOB_STATUS_LABEL[s], href: `/empleo-publico?estado=${slug}`, active: status === s, count: all.filter((j) => j.jobStatus === s).length })),
          ]}
        />
        {jobs.length ? (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((j) => (
              <li key={j.id}>
                <JobCard item={j} headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No hay procesos en este estado" description="Cuando se convoque una nueva plaza aparecerá aquí con su plazo." action={{ href: "/empleo-publico", label: "Ver todos" }} />
        )}
      </div>
    </>
  );
}
