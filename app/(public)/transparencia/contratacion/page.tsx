import { ExternalLink, FileText } from "lucide-react";
import { PageHeader } from "@/components/public/PageHeader";
import { SourceNote } from "@/components/public/SourceNote";
import { pageMetadata } from "@/lib/seo";
import { EXTERNAL } from "@/lib/site";

export const metadata = pageMetadata({ title: "Perfil del contratante", description: "Licitaciones del Ayuntamiento de Jaca en la Plataforma de Contratación del Sector Público.", path: "/transparencia/contratacion" });

const PROFILES = [
  { title: "Pleno del Ayuntamiento de Jaca", href: EXTERNAL.contratacionPleno },
  { title: "Junta de Gobierno del Ayuntamiento de Jaca", href: EXTERNAL.contratacionJunta },
  { title: "Alcaldía del Ayuntamiento de Jaca", href: EXTERNAL.contratacionAlcaldia },
];

export default function ContratacionPage() {
  return (
    <>
      <PageHeader
        title="Perfil del contratante"
        eyebrow="Transparencia"
        intro="Los contratos públicos del Ayuntamiento licitados desde el 9 de marzo de 2018 se publican en la Plataforma de Contratación del Sector Público, según el órgano de contratación."
        crumbs={[{ label: "Transparencia", href: "/transparencia" }, { label: "Perfil del contratante" }]}
      />
      <div className="container-site py-10 md:py-14">
        <ul className="grid gap-5 md:grid-cols-3">
          {PROFILES.map((p) => (
            <li key={p.href}>
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col justify-between rounded-[10px] border border-stone-200 bg-white p-7 hover:border-forest-700">
                <span className="text-sm font-semibold uppercase tracking-wide text-earth">Órgano de contratación</span>
                <span className="mt-2 text-xl font-semibold text-ink group-hover:text-forest-700">{p.title}</span>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-forest-700">
                  Ver licitaciones <ExternalLink aria-hidden className="size-4" />
                </span>
                <span className="sr-only">(abre la Plataforma de Contratación del Sector Público)</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <a href="https://www.jaca.es/sites/default/files/declaracion_responsable_unica.pdf" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 rounded-[10px] border border-stone-200 bg-white p-6 hover:border-forest-700">
            <FileText aria-hidden className="size-7 shrink-0 text-earth" />
            <span>
              <span className="block font-semibold">Formulario normalizado del Documento Europeo Único de Contratación (DEUC)</span>
              <span className="text-[0.9375rem] text-muted">PDF · alojado en jaca.es</span>
            </span>
          </a>
          <div className="rounded-[10px] bg-stone-100 p-6 text-ink-2">
            <p className="font-semibold text-ink">Licitaciones anteriores al 9 de marzo de 2018</p>
            <p className="mt-1 text-[0.9375rem]">Se consultan en el antiguo perfil del contratante enlazado desde jaca.es. Recomendación: migrar su archivo histórico al Portal de Transparencia.</p>
          </div>
        </div>
        <SourceNote sourceUrl="https://www.jaca.es/perfil-de-contratante.html-0" sourceName="jaca.es — Perfil de Contratante" lastVerifiedAt={new Date("2026-09-30")} />
      </div>
    </>
  );
}
