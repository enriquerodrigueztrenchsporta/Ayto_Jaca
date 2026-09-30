import Link from "next/link";
import { FileText, Home, Phone } from "lucide-react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { DemoBanner } from "@/components/public/DemoBanner";
import { SearchBox } from "@/components/public/SearchBox";
import { OroelLine } from "@/components/ui/OroelLine";
import { SITE } from "@/lib/site";

export const metadata = { title: "Página no encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <DemoBanner />
      <Header />
      <main id="contenido" className="flex-1">
        <div className="container-site py-16 md:py-24">
          <p className="eyebrow">Error 404</p>
          <h1 className="mt-3 max-w-2xl font-serif text-h1 font-medium text-forest-900">No encontramos esta página</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-2">Puede que la dirección haya cambiado con la nueva web. Busca lo que necesitas o elige un acceso rápido.</p>
          <div className="mt-8 max-w-2xl">
            <SearchBox label="Buscar en la web" />
          </div>
          <ul className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            <li>
              <Link href="/" className="flex min-h-14 items-center gap-3 rounded-[8px] border border-stone-200 bg-white px-5 font-semibold hover:border-forest-700">
                <Home aria-hidden className="size-5 text-earth" /> Portada
              </Link>
            </li>
            <li>
              <Link href="/tramites" className="flex min-h-14 items-center gap-3 rounded-[8px] border border-stone-200 bg-white px-5 font-semibold hover:border-forest-700">
                <FileText aria-hidden className="size-5 text-earth" /> Trámites
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="flex min-h-14 items-center gap-3 rounded-[8px] border border-stone-200 bg-white px-5 font-semibold hover:border-forest-700">
                <Phone aria-hidden className="size-5 text-earth" /> Contacto
              </Link>
            </li>
          </ul>
          <p className="mt-8 text-ink-2">
            ¿Prefieres llamar? Atención general: <a href={SITE.phoneHref} className="font-semibold text-forest-700">{SITE.phone}</a>
          </p>
          <OroelLine className="mt-16 h-16 text-stone-300" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
