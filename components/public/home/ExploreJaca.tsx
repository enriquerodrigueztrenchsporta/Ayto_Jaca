import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { img } from "@/lib/images";
import { cn } from "@/lib/cn";

const TILES = [
  { key: "ciudadela", title: "Patrimonio", text: "Catedral, Ciudadela y casco histórico BIC", href: "/turismo/monumentos-y-museos", span: "md:col-span-2 md:row-span-2" },
  { key: "vista-oroel", title: "Naturaleza", text: "Oroel, San Juan de la Peña y el valle", href: "/turismo/naturaleza", span: "" },
  { key: "crismon", title: "Románico", text: "El crismón y la ruta jacobea", href: "/turismo/romanico", span: "" },
  { key: "calle-mayor", title: "Cultura y fiestas", text: "Primer Viernes de Mayo, Santa Orosia", href: "/cultura/fiestas-y-tradiciones", span: "" },
  { key: "puente-san-miguel", title: "Camino de Santiago", text: "Primera ciudad del Camino aragonés", href: "/cultura/camino-de-santiago", span: "" },
];

/** Bloque visual de turismo, cultura y patrimonio (Caso F: "Soy turista"). */
export function ExploreJaca() {
  return (
    <section aria-labelledby="explore-title" className="bg-forest-900 py-16 text-snow md:py-24">
      <div className="container-site">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow !text-sand mb-2">Explora Jaca</p>
            <h2 id="explore-title" className="font-serif text-h1 font-medium">
              Dos mil años de historia <span className="italic text-mist">a la sombra del Oroel</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/turismo" className="inline-flex min-h-12 items-center rounded-[4px] bg-sand px-5 font-semibold text-forest-900 hover:bg-snow">
              Soy visitante
            </Link>
            <Link href="/turismo/oficina-de-turismo" className="inline-flex min-h-12 items-center rounded-[4px] border border-mist/50 px-5 font-semibold text-snow hover:bg-forest-800">
              Oficina de Turismo
            </Link>
          </div>
        </div>
        <ul className="grid auto-rows-[220px] gap-4 md:grid-cols-4 md:auto-rows-[240px]">
          {TILES.map((t) => {
            const photo = img(t.key);
            return (
              <li key={t.key} className={cn("group relative overflow-hidden rounded-[10px]", t.span)}>
                <Image src={photo.file} alt={photo.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100" />
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(18,41,31,.92)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-serif text-2xl text-snow">
                    <Link href={t.href} className="card-link">
                      {t.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-[0.9375rem] text-stone-300">{t.text}</p>
                </div>
                <ArrowUpRight aria-hidden className="absolute right-4 top-4 size-6 text-snow opacity-0 transition-opacity group-hover:opacity-100" />
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[0.75rem] text-stone-300">
          Fotografías: Wikimedia Commons con licencias libres ·{" "}
          <Link href="/creditos" className="underline">
            ver autorías
          </Link>
        </p>
      </div>
    </section>
  );
}
