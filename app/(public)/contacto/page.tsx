import Link from "next/link";
import { ExternalLink, MessageSquareText } from "lucide-react";
import { PageHeader } from "@/components/public/PageHeader";
import { ContactCard } from "@/components/public/cards";
import { SourceNote } from "@/components/public/SourceNote";
import { listAreas } from "@/lib/queries/public";
import { USEFUL_PHONES, USEFUL_PHONES_SOURCE } from "@/data/seed/areas";
import { pageMetadata } from "@/lib/seo";
import { EXTERNAL, PENDING, SITE } from "@/lib/site";

export const metadata = pageMetadata({ title: "Contacto y teléfonos", description: "Dirección, teléfono general, directorio de áreas municipales y teléfonos de interés de Jaca.", path: "/contacto" });

export default async function ContactPage() {
  const areas = await listAreas();
  return (
    <>
      <PageHeader title="Contacto" eyebrow="Estamos para ayudarte" intro="Cómo contactar con el Ayuntamiento y con cada uno de sus servicios." crumbs={[{ label: "Contacto" }]} />
      <div className="container-site space-y-14 py-10 md:py-14">
        <section aria-labelledby="general" className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[10px] bg-forest-900 p-7 text-snow lg:col-span-1">
            <h2 id="general" className="font-serif text-h3">Ayuntamiento de Jaca</h2>
            <address className="mt-4 space-y-2 not-italic text-stone-300">
              <p>{SITE.address.street}<br />{SITE.address.postalCode} {SITE.address.city} ({SITE.address.province})</p>
              <p>Teléfono: <a href={SITE.phoneHref} className="font-semibold text-snow hover:underline">{SITE.phone}</a></p>
              <p className="text-[0.9375rem]">Horario de atención: <span className="text-sand">{PENDING}</span></p>
            </address>
            <a href={`https://www.openstreetmap.org/search?query=${encodeURIComponent("Calle Mayor 24, 22700 Jaca")}`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 font-semibold text-sand underline underline-offset-4">
              Ver en OpenStreetMap <ExternalLink aria-hidden className="size-4" /><span className="sr-only">(abre sitio externo)</span>
            </a>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
            <div className="rounded-[10px] border border-stone-200 bg-white p-6">
              <MessageSquareText aria-hidden className="size-7 text-earth" />
              <h2 className="mt-3 font-semibold text-ink">Quejas y sugerencias</h2>
              <p className="mt-1 text-[0.9375rem] text-ink-2">Registra tu queja o sugerencia en la Sede Electrónica: queda constancia y recibirás respuesta.</p>
              <a href={EXTERNAL.sugerencias} target="_blank" rel="noopener noreferrer" className="link mt-3 inline-block font-semibold">Enviar en la Sede<span className="sr-only"> (abre sitio externo)</span></a>
            </div>
            <div className="rounded-[10px] border border-stone-200 bg-white p-6">
              <h2 className="font-semibold text-ink">Emergencias</h2>
              <p className="mt-2 font-serif text-4xl text-urgent"><a href="tel:112">112</a></p>
              <p className="mt-2 text-[0.9375rem] text-ink-2">Policía Local: <a href="tel:092" className="font-semibold text-forest-700">092</a> · <a href="tel:+34974357225" className="font-semibold text-forest-700">974 357 225</a></p>
            </div>
          </div>
        </section>

        <section aria-labelledby="areas">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="areas" className="font-serif text-h2 font-medium">Áreas y servicios</h2>
            <Link href="/ayuntamiento/areas" className="link font-semibold">Ver fichas completas</Link>
          </div>
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => (
              <li key={a.id}>
                <ContactCard item={{ name: a.name, phone: a.phone, email: a.email, address: a.address, schedule: a.schedule, href: `/ayuntamiento/areas/${a.slug}`, pending: a.pendingFields }} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="telefonos">
          <h2 id="telefonos" className="mb-6 font-serif text-h2 font-medium">Teléfonos de interés</h2>
          <div className="overflow-x-auto rounded-[10px] border border-stone-200 bg-white" tabIndex={0} role="region" aria-label="Tabla de teléfonos de interés">
            <table className="w-full min-w-[480px] text-left">
              <caption className="sr-only">Teléfonos de interés en Jaca</caption>
              <thead className="bg-stone-100">
                <tr>
                  <th scope="col" className="px-5 py-3">Servicio</th>
                  <th scope="col" className="px-5 py-3">Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {USEFUL_PHONES.map((p) => (
                  <tr key={p.name} className="border-t border-stone-200">
                    <th scope="row" className="px-5 py-3 font-normal">{p.name}</th>
                    <td className="px-5 py-3 font-semibold text-forest-700">{p.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SourceNote sourceUrl={USEFUL_PHONES_SOURCE} sourceName="jaca.es — Teléfonos de interés" lastVerifiedAt={new Date("2026-09-30")} />
        </section>
      </div>
    </>
  );
}
