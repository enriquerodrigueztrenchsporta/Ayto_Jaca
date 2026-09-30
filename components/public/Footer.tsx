import Link from "next/link";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import { EXTERNAL, FOOTER_LINKS, NAV, SITE, SOCIAL } from "@/lib/site";
import { OroelLine } from "@/components/ui/OroelLine";
import { Wordmark } from "./Wordmark";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="mt-auto bg-forest-900 text-stone-300">
      <OroelLine className="h-10 text-forest-700" strokeWidth={2} />
      <div className="container-site grid gap-12 py-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Wordmark inverted />
          <address className="mt-6 space-y-3 not-italic">
            <p className="flex items-start gap-2">
              <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-mist" />
              <span>
                {SITE.address.street}
                <br />
                {SITE.address.postalCode} {SITE.address.city} ({SITE.address.province})
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone aria-hidden className="size-5 shrink-0 text-mist" />
              <a href={SITE.phoneHref} className="font-semibold text-snow hover:underline">{SITE.phone}</a>
            </p>
          </address>
          <a
            href={EXTERNAL.sede}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-sand px-5 font-semibold text-forest-900 hover:bg-snow"
          >
            Sede Electrónica <ExternalLink aria-hidden className="size-4" /><span className="sr-only">(abre sitio externo)</span>
          </a>
        </div>
        <nav aria-label="Secciones" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
          {NAV.slice(0, 6).map((s) => (
            <div key={s.label}>
              <p className="mb-3 font-semibold text-snow">{s.label}</p>
              <ul className="space-y-2 text-[0.9375rem]">
                {s.links.filter((l) => !l.external).slice(0, 4).map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-snow hover:underline">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="lg:col-span-3">
          <p className="mb-1 font-serif text-2xl text-snow">Avisos en tu correo</p>
          <p className="mb-4 text-[0.9375rem]">Cortes, obras, plazos y agenda, una vez por semana.</p>
          <NewsletterForm />
          <p className="mb-2 mt-8 font-semibold text-snow">Redes oficiales</p>
          <ul className="space-y-2 text-[0.9375rem]">
            {SOCIAL.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-snow hover:underline">
                  {s.label} <ExternalLink aria-hidden className="size-3.5" /><span className="sr-only">(abre sitio externo)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-forest-700">
        <div className="container-site flex flex-col gap-4 py-6 text-[0.9375rem] lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_LINKS.map((l) => (
              <li key={l.label}>
                {l.external ? (
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-snow hover:underline">{l.label}<span className="sr-only"> (abre sitio externo)</span></a>
                ) : (
                  <Link href={l.href} className="hover:text-snow hover:underline">{l.label}</Link>
                )}
              </li>
            ))}
            <li><Link href="/creditos" className="hover:text-snow hover:underline">Créditos fotográficos</Link></li>
          </ul>
          <p className="text-mist">© {new Date().getFullYear()} {SITE.name}</p>
        </div>
      </div>
    </footer>
  );
}
