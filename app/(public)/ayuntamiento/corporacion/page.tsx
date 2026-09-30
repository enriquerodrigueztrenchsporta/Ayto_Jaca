import { PageHeader } from "@/components/public/PageHeader";
import { SourceNote } from "@/components/public/SourceNote";
import { CORPORACION_SOURCE, CORPORACION_VERIFIED_AT, GRUPOS } from "@/data/corporacion";
import { pageMetadata } from "@/lib/seo";
import { slugify } from "@/lib/text";

export const metadata = pageMetadata({ title: "Corporación municipal", description: "Composición del Pleno del Ayuntamiento de Jaca: grupos municipales, Alcaldía y concejalías delegadas.", path: "/ayuntamiento/corporacion" });

export default function CorporacionPage() {
  const total = GRUPOS.reduce((n, g) => n + g.members.length, 0);
  return (
    <>
      <PageHeader
        title="Corporación municipal"
        eyebrow="Ayuntamiento"
        intro={`El Pleno del Ayuntamiento de Jaca está formado por ${total} concejales y concejalas, organizados en grupos municipales.`}
        crumbs={[{ label: "Ayuntamiento", href: "/ayuntamiento" }, { label: "Corporación municipal" }]}
      />
      <div className="container-site py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          {GRUPOS.map((g) => (
            <section key={g.name} aria-labelledby={slugify(g.name)} className="rounded-[10px] border border-stone-200 bg-white">
              <h2 id={slugify(g.name)} className="border-b border-stone-200 px-6 py-4 font-serif text-h3 font-medium">
                {g.name} <span className="text-base font-normal text-muted">· {g.members.length}</span>
              </h2>
              <ul className="divide-y divide-stone-200">
                {g.members.map((m) => (
                  <li key={m.name} className="px-6 py-4">
                    <p className="font-semibold text-ink">{m.name}</p>
                    <p className="text-[0.9375rem] text-ink-2">{m.role}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-[0.9375rem] text-muted">
          Información institucional objetiva. Las retribuciones, declaraciones de bienes y agendas se publican en el Portal de Transparencia.
        </p>
        <SourceNote sourceUrl={CORPORACION_SOURCE} sourceName="jaca.es — Gobierno, organización municipal" lastVerifiedAt={new Date(CORPORACION_VERIFIED_AT)} />
      </div>
    </>
  );
}
