import Link from "next/link";
import { ArrowRight, ExternalLink, FileSearch, Gavel, HandCoins, Landmark, Scale, ScrollText } from "lucide-react";
import { PageHeader } from "@/components/public/PageHeader";
import { pageMetadata } from "@/lib/seo";
import { EXTERNAL } from "@/lib/site";

export const metadata = pageMetadata({ title: "Transparencia", description: "Portal de Transparencia, normativa municipal, contratación, subvenciones y derecho de acceso a la información pública.", path: "/transparencia" });

const ITEMS = [
  { href: EXTERNAL.transparency, icon: Landmark, title: "Portal de Transparencia", text: "Información institucional, económica, presupuestaria y de personal publicada conforme a la normativa de transparencia." },
  { href: "/transparencia/normativa", icon: ScrollText, title: "Normativa municipal", text: "Ordenanzas, ordenanzas fiscales y precios públicos, reglamentos y protocolos." },
  { href: "/transparencia/contratacion", icon: Gavel, title: "Perfil del contratante", text: "Licitaciones del Pleno, la Junta de Gobierno y la Alcaldía." },
  { href: "/convocatorias", icon: HandCoins, title: "Subvenciones", text: "Convocatorias municipales abiertas, cerradas y concedidas." },
  { href: "/plenos", icon: Scale, title: "Plenos", text: "Convocatorias y órdenes del día de las sesiones plenarias." },
  { href: "/tramites/acceso-a-la-informacion-publica", icon: FileSearch, title: "Derecho de acceso", text: "Solicita información pública que no esté publicada." },
];

export default function TransparenciaPage() {
  return (
    <>
      <PageHeader title="Transparencia" eyebrow="Gobierno abierto" intro="Acceso a la información pública del Ayuntamiento de Jaca. La información oficial de transparencia se publica en el portal de la Sede Electrónica." crumbs={[{ label: "Transparencia" }]}>
        <a href={EXTERNAL.transparency} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-forest-700 px-5 font-semibold text-snow hover:bg-forest-600">
          Ir al Portal de Transparencia <ExternalLink aria-hidden className="size-4" /><span className="sr-only">(abre sitio externo)</span>
        </a>
      </PageHeader>
      <div className="container-site py-10 md:py-14">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((i) => {
            const ext = /^https?:/.test(i.href);
            const inner = (
              <>
                <i.icon aria-hidden className="size-8 text-earth" strokeWidth={1.5} />
                <span className="mt-4 flex items-center gap-2 text-xl font-semibold text-ink group-hover:text-forest-700">
                  {i.title} {ext ? <ExternalLink aria-hidden className="size-4" /> : <ArrowRight aria-hidden className="size-4" />}
                </span>
                <span className="mt-2 block text-ink-2">{i.text}</span>
              </>
            );
            const cls = "group block h-full rounded-[10px] border border-stone-200 bg-white p-7 hover:border-forest-700";
            return (
              <li key={i.href}>
                {ext ? <a href={i.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}<span className="sr-only">(abre sitio externo)</span></a> : <Link href={i.href} className={cls}>{inner}</Link>}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
