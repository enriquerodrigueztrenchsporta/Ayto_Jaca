import Link from "next/link";
import { BadgeEuro, Briefcase, Building2, ExternalLink, FileSignature, HandCoins, Landmark, MessageSquareText, UserRoundCheck } from "lucide-react";
import { EXTERNAL } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

const ITEMS = [
  { label: "Sede Electrónica", hint: "Trámites online con certificado o Cl@ve", href: EXTERNAL.sede, icon: Landmark, external: true },
  { label: "Padrón", hint: "Empadronamiento y certificados", href: "/tramites?categoria=padron-y-certificados", icon: UserRoundCheck },
  { label: "Instancia general", hint: "Cualquier solicitud al Ayuntamiento", href: "/tramites/instancia-general", icon: FileSignature },
  { label: "Tributos y pagos", hint: "Domiciliaciones, IBI, plusvalía", href: "/tramites?categoria=tributos-y-pagos", icon: BadgeEuro },
  { label: "Urbanismo", hint: "Obras, licencias y actividades", href: "/tramites?categoria=urbanismo-y-obras", icon: Building2 },
  { label: "Subvenciones", hint: "Convocatorias abiertas", href: "/convocatorias?estado=abierta", icon: HandCoins },
  { label: "Empleo público", hint: "Procesos selectivos", href: "/empleo-publico", icon: Briefcase },
  { label: "Contacto y quejas", hint: "Teléfonos, áreas y sugerencias", href: "/contacto", icon: MessageSquareText },
];

export function QuickAccess({ procedureCount }: { procedureCount: number }) {
  return (
    <section aria-labelledby="quick-title" className="container-site py-16 md:py-20">
      <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-2">Accesos rápidos</p>
          <h2 id="quick-title" className="font-serif text-h2 font-medium">Lo que más se hace</h2>
        </div>
        <Link href="/tramites" className="font-semibold text-forest-700 underline underline-offset-4">
          Ver los {procedureCount} trámites
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-stone-200 bg-stone-200 md:grid-cols-4">
        {ITEMS.map((it, i) => {
          const Icon = it.icon;
          const content = (
            <>
              <Icon aria-hidden className="size-7 text-earth transition-colors group-hover:text-forest-700" strokeWidth={1.6} />
              <span className="mt-4 flex items-center gap-1.5 text-lg font-semibold leading-tight text-ink group-hover:text-forest-700">
                {it.label}
                {it.external && <ExternalLink aria-hidden className="size-4" />}
              </span>
              <span className="mt-1 text-[0.9375rem] leading-snug text-muted">{it.hint}</span>
              {it.external && <span className="sr-only">(abre sitio externo)</span>}
            </>
          );
          const cls = "group flex h-full flex-col bg-white p-5 transition-colors hover:bg-forest-50 md:p-7";
          return (
            <li key={it.label}>
              <Reveal delay={i * 0.03} className="h-full">
                {it.external ? (
                  <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>
                    {content}
                  </a>
                ) : (
                  <Link href={it.href} className={cls}>
                    {content}
                  </Link>
                )}
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
