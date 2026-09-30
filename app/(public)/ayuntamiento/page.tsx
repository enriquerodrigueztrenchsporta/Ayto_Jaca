import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/public/PageHeader";
import { SessionCard } from "@/components/public/cards";
import { listSessions } from "@/lib/queries/public";
import { pageMetadata } from "@/lib/seo";
import { EXTERNAL } from "@/lib/site";

export const metadata = pageMetadata({ title: "Ayuntamiento", description: "Corporación municipal, organización, áreas y servicios, plenos, participación y contacto del Ayuntamiento de Jaca.", path: "/ayuntamiento" });

const LINKS = [
  { href: "/ayuntamiento/corporacion", title: "Corporación municipal", text: "Alcaldía, grupos municipales y concejalías delegadas." },
  { href: "/ayuntamiento/organizacion", title: "Organización", text: "Junta de Gobierno Local y comisiones informativas." },
  { href: "/ayuntamiento/areas", title: "Áreas y servicios", text: "Qué hace cada área, cómo contactar y sus trámites." },
  { href: "/plenos", title: "Plenos", text: "Convocatorias, órdenes del día y retransmisión." },
  { href: "/ayuntamiento/participacion", title: "Participación ciudadana", text: "Consejos, consultas públicas y presupuestos participativos." },
  { href: "/avisos?tipo=bandos", title: "Bandos", text: "Bandos de Alcaldía vigentes." },
  { href: "/contacto", title: "Contacto y directorio", text: "Teléfonos, correos y direcciones verificados." },
  { href: "/transparencia", title: "Transparencia", text: "Portal oficial, normativa y contratación." },
  { href: EXTERNAL.tablon, title: "Tablón de anuncios", text: "Edictos oficiales en la Sede Electrónica." },
];

export default async function AyuntamientoPage() {
  const [last] = await listSessions(1);
  return (
    <>
      <PageHeader title="Ayuntamiento" eyebrow="Tu Ayuntamiento" intro="Cómo se organiza el Ayuntamiento de Jaca, quién lo forma y cómo participar en las decisiones municipales." crumbs={[{ label: "Ayuntamiento" }]} />
      <div className="container-site grid gap-10 py-10 md:py-14 lg:grid-cols-3">
        <ul className="grid gap-px self-start overflow-hidden rounded-[10px] border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:col-span-2">
          {LINKS.map((l) => {
            const ext = /^https?:/.test(l.href);
            const cls = "group flex h-full items-start justify-between gap-4 bg-white p-6 hover:bg-forest-50";
            const inner = (
              <>
                <span>
                  <span className="block text-lg font-semibold text-ink group-hover:text-forest-700 group-hover:underline">{l.title}</span>
                  <span className="mt-1 block text-[0.9375rem] text-muted">{l.text}</span>
                </span>
                <ArrowRight aria-hidden className="mt-1 size-5 shrink-0 text-earth" />
              </>
            );
            return (
              <li key={l.href}>
                {ext ? (
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}<span className="sr-only">(abre sitio externo)</span></a>
                ) : (
                  <Link href={l.href} className={cls}>{inner}</Link>
                )}
              </li>
            );
          })}
        </ul>
        <div>
          <h2 className="mb-4 font-serif text-h3 font-medium">Último pleno</h2>
          {last && <SessionCard item={last} highlight />}
        </div>
      </div>
    </>
  );
}
