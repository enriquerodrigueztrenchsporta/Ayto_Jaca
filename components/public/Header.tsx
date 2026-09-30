import Link from "next/link";
import { ExternalLink, Phone } from "lucide-react";
import { NAV, EXTERNAL, SITE } from "@/lib/site";
import { Wordmark } from "./Wordmark";
import { MegaMenu } from "./MegaMenu";
import { MobileNavigation } from "./MobileNavigation";
import { HeaderSearch } from "./HeaderSearch";

export function Header() {
  return (
    <header className="relative z-40 border-b border-stone-200 bg-snow">
      <div className="hidden bg-forest-900 text-[0.9375rem] text-stone-300 md:block">
        <div className="container-site flex h-10 items-center justify-between">
          <p className="flex items-center gap-2">
            <Phone aria-hidden className="size-4 text-mist" />
            <span>
              Atención general <a href={SITE.phoneHref} className="font-semibold text-snow hover:underline">{SITE.phone}</a>
            </span>
          </p>
          <ul className="flex items-center gap-6">
            <li><Link href="/contacto" className="hover:text-snow hover:underline">Contacto</Link></li>
            <li><Link href="/avisos" className="hover:text-snow hover:underline">Avisos</Link></li>
            <li><Link href="/transparencia" className="hover:text-snow hover:underline">Transparencia</Link></li>
            <li>
              <a href={EXTERNAL.sede} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-sand hover:text-snow">
                Sede Electrónica <ExternalLink aria-hidden className="size-3.5" /><span className="sr-only">(abre sitio externo)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-site flex h-20 items-center justify-between gap-4">
        <Wordmark />
        <MegaMenu sections={NAV} />
        <div className="flex items-center gap-2">
          <HeaderSearch />
          <a
            href={EXTERNAL.sede}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center gap-2 rounded-[4px] bg-forest-700 px-4 font-semibold text-snow hover:bg-forest-600 lg:inline-flex xl:hidden 2xl:inline-flex"
          >
            Sede <ExternalLink aria-hidden className="size-4" />
            <span className="sr-only">Electrónica (abre sitio externo)</span>
          </a>
          <MobileNavigation sections={NAV} />
        </div>
      </div>
    </header>
  );
}
