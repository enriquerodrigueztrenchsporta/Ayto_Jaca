import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { listSectionPages } from "@/lib/queries/public";
import { OroelLine } from "@/components/ui/OroelLine";

export type HubLink = { title: string; text: string; href: string };

/** Portada de sección: páginas gestionadas + accesos a servicios propios o externos. */
export async function SectionHub({ section, title, eyebrow, intro, extra = [], children }: { section: string; title: string; eyebrow?: string; intro: string; extra?: HubLink[]; children?: React.ReactNode }) {
  const pages = await listSectionPages(section);
  return (
    <>
      <PageHeader title={title} eyebrow={eyebrow} intro={intro} crumbs={[{ label: title }]} />
      <div className="container-site py-10 md:py-14">
        {children}
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((p) => (
            <li key={p.id} className="group relative flex flex-col overflow-hidden rounded-[10px] border border-stone-200 bg-white transition-colors hover:border-forest-700">
              {p.image ? (
                <div className="relative aspect-[16/9] bg-stone-100">
                  <Image src={p.image.url} alt="" fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" />
                </div>
              ) : (
                <div aria-hidden className="flex aspect-[16/9] items-end bg-stone-100 px-6 pb-4 text-stone-300">
                  <OroelLine className="h-10" />
                </div>
              )}
              <div className="flex-1 p-6">
                <h2 className="font-serif text-h3 font-medium">
                  <Link href={`/${p.path}`} className="card-link group-hover:text-forest-700 group-hover:underline">
                    {p.title}
                  </Link>
                </h2>
                {p.summary && <p className="mt-2 text-[0.9375rem] text-ink-2">{p.summary}</p>}
              </div>
            </li>
          ))}
          {extra.map((e) => {
            const external = /^https?:/.test(e.href);
            return (
              <li key={e.href} className="group relative flex flex-col justify-between rounded-[10px] border border-stone-200 bg-stone-100 p-6 transition-colors hover:border-forest-700">
                <div>
                  <h2 className="font-serif text-h3 font-medium">
                    {external ? (
                      <a href={e.href} target="_blank" rel="noopener noreferrer" className="card-link inline-flex items-center gap-2 group-hover:text-forest-700">
                        {e.title} <ExternalLink aria-hidden className="size-5" />
                        <span className="sr-only">(abre sitio externo)</span>
                      </a>
                    ) : (
                      <Link href={e.href} className="card-link group-hover:text-forest-700 group-hover:underline">
                        {e.title}
                      </Link>
                    )}
                  </h2>
                  <p className="mt-2 text-[0.9375rem] text-ink-2">{e.text}</p>
                </div>
                <ArrowUpRight aria-hidden className="mt-6 size-6 self-end text-earth" />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
