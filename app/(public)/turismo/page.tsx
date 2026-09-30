import Image from "next/image";
import Link from "next/link";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { EventCard } from "@/components/public/cards";
import { img } from "@/lib/images";
import { listSectionPages, listUpcomingEvents } from "@/lib/queries/public";
import { pageMetadata } from "@/lib/seo";
import { EXTERNAL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Turismo en Jaca",
  description: "Visita Jaca: Catedral románica, Ciudadela, Camino de Santiago, naturaleza pirenaica, gastronomía y Oficina de Turismo.",
  path: "/turismo",
  image: "/images/ciudadela.jpg",
});

/** Portal turístico con personalidad propia dentro del mismo sistema de diseño (Caso F). */
export default async function TurismoPage() {
  const [pages, events] = await Promise.all([listSectionPages("turismo"), listUpcomingEvents({ category: "turismo" })]);
  const cultureEvents = events.length ? events : (await listUpcomingEvents({ category: "cultura" })).slice(0, 3);
  const photo = img("ciudadela");
  return (
    <>
      <section className="relative isolate overflow-hidden bg-forest-900 text-snow">
        <Image src={photo.file} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-70" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(18,41,31,.95)_0%,rgba(18,41,31,.35)_70%)]" />
        <div className="container-site pb-14 pt-6 md:pb-20">
          <div className="[&_a]:!text-stone-300 [&_nav]:text-stone-300 [&_span]:!text-snow">
            <Breadcrumbs items={[{ label: "Turismo" }]} />
          </div>
          <p className="eyebrow mt-24 !text-sand md:mt-40">Visita Jaca</p>
          <h1 className="mt-3 max-w-3xl font-serif text-display font-medium">
            La capital del Pirineo <span className="italic text-mist">aragonés</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-stone-300">Primera capital del Reino de Aragón y primera ciudad del Camino de Santiago en la península, entre la Peña Oroel y las cumbres de Collarada.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/turismo/planifica-tu-viaje" className="inline-flex min-h-12 items-center rounded-[4px] bg-sand px-5 font-semibold text-forest-900 hover:bg-snow">
              Planifica tu viaje
            </Link>
            <a href={EXTERNAL.visitJaca} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-[4px] border border-mist/60 px-5 font-semibold hover:bg-forest-800">
              visitjaca.es <ExternalLink aria-hidden className="size-4" /><span className="sr-only">(abre sitio externo)</span>
            </a>
          </div>
        </div>
        <p className="container-site pb-3 text-right text-[0.75rem] text-stone-300">{photo.credit}</p>
      </section>

      <div className="container-site py-12 md:py-16">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pages.filter((p) => p.path !== "turismo/oficina-de-turismo").map((p) => (
            <li key={p.id} className="group relative overflow-hidden rounded-[10px] border border-stone-200 bg-white hover:border-forest-700">
              {p.image && (
                <div className="relative aspect-[3/2]">
                  <Image src={p.image.url} alt="" fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100" />
                </div>
              )}
              <div className="p-6">
                <h2 className="font-serif text-h3 font-medium">
                  <Link href={`/${p.path}`} className="card-link group-hover:text-forest-700">
                    {p.title}
                  </Link>
                </h2>
                {p.summary && <p className="mt-2 text-[0.9375rem] text-ink-2">{p.summary}</p>}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-10 lg:grid-cols-3">
          <section aria-labelledby="t-agenda" className="lg:col-span-2">
            <h2 id="t-agenda" className="mb-6 font-serif text-h2 font-medium">Qué hacer estos días</h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {cultureEvents.slice(0, 4).map((e) => (
                <li key={e.id}>
                  <EventCard item={e} />
                </li>
              ))}
            </ul>
            <Link href="/agenda" className="link mt-6 inline-block font-semibold">Toda la agenda</Link>
          </section>
          <aside aria-labelledby="t-oficina" className="rounded-[10px] bg-forest-900 p-7 text-snow">
            <h2 id="t-oficina" className="font-serif text-h3">Oficina de Turismo</h2>
            <p className="mt-3 flex gap-2 text-stone-300"><MapPin aria-hidden className="mt-1 size-4 shrink-0 text-mist" /> Plaza de San Pedro, 11-13 (junto a la Catedral)</p>
            <p className="mt-2 flex gap-2"><Phone aria-hidden className="mt-1 size-4 shrink-0 text-mist" /> <a href="tel:+34974360098" className="font-semibold hover:underline">974 360 098</a></p>
            <p className="mt-3 text-[0.9375rem] text-stone-300">Atención en español, francés e inglés. Visitas guiadas a la ciudad y al Fuerte de Rapitán.</p>
            <Link href="/turismo/oficina-de-turismo" className="mt-6 inline-flex min-h-12 items-center rounded-[4px] bg-sand px-5 font-semibold text-forest-900 hover:bg-snow">
              Horarios y folletos
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
