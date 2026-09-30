import Image from "next/image";
import Link from "next/link";
import { Bell, CalendarDays, ExternalLink, FileText } from "lucide-react";
import { SearchBox } from "@/components/public/SearchBox";
import { img } from "@/lib/images";
import { EXTERNAL } from "@/lib/site";
import { formatDate } from "@/lib/dates";

export function Hero({ alertCount }: { alertCount: number }) {
  const photo = img("hero-oroel");
  const chip = "inline-flex min-h-11 items-center gap-2 rounded-full border border-snow/35 bg-forest-900/35 px-4 font-semibold text-snow backdrop-blur-[2px] hover:bg-snow hover:text-forest-900";
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-forest-900">
      <Image src={photo.file} alt="" fill priority sizes="100vw" className="-z-10 object-cover object-[35%_40%] opacity-80" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(18,41,31,.92)_0%,rgba(18,41,31,.72)_45%,rgba(18,41,31,.25)_100%)]" />
      <div className="container-site pb-14 pt-14 md:pb-20 md:pt-24">
        <p className="eyebrow !text-sand">
          Ayuntamiento de Jaca · <span className="font-medium normal-case tracking-normal text-stone-300">{formatDate(new Date(), "long")}</span>
        </p>
        <h1 id="hero-title" className="mt-4 max-w-3xl font-serif text-display font-medium text-snow">
          Jaca, a un clic.
          <span className="block italic text-mist">Trámites, servicios y vida de la ciudad.</span>
        </h1>
        <div className="mt-10 max-w-3xl">
          <SearchBox size="lg" tone="dark" label="¿Qué necesitas hacer?" />
          <p className="mt-3 text-[0.9375rem] text-stone-300">
            Prueba con «empadronarme», «licencia de obra», «bonificación IBI» o «factura electrónica».
          </p>
        </div>
        <nav aria-label="Accesos principales" className="mt-8 flex flex-wrap gap-3">
          <a href={EXTERNAL.sede} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sand px-5 font-semibold text-forest-900 hover:bg-snow">
            Sede Electrónica <ExternalLink aria-hidden className="size-4" />
            <span className="sr-only">(abre sitio externo)</span>
          </a>
          <Link href="/tramites" className={chip}>
            <FileText aria-hidden className="size-4" /> Trámites
          </Link>
          <Link href="/agenda" className={chip}>
            <CalendarDays aria-hidden className="size-4" /> Agenda
          </Link>
          <Link href="/avisos" className={chip}>
            <Bell aria-hidden className="size-4" /> Avisos
            {alertCount > 0 && <span className="rounded-full bg-sand px-2 text-sm text-forest-900">{alertCount}</span>}
          </Link>
        </nav>
      </div>
      <p className="container-site pb-3 text-right text-[0.75rem] text-stone-300/90">
        <a href={photo.sourceUrl} className="hover:underline" target="_blank" rel="noopener noreferrer">
          {photo.credit}
        </a>
      </p>
    </section>
  );
}
