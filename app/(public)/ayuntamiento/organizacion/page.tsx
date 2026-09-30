import { PageHeader } from "@/components/public/PageHeader";
import { SourceNote } from "@/components/public/SourceNote";
import { COMISIONES, CORPORACION_SOURCE, CORPORACION_VERIFIED_AT, JUNTA_GOBIERNO } from "@/data/corporacion";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Organización municipal", description: "Junta de Gobierno Local y comisiones informativas permanentes del Ayuntamiento de Jaca.", path: "/ayuntamiento/organizacion" });

export default function OrganizacionPage() {
  return (
    <>
      <PageHeader title="Organización municipal" eyebrow="Ayuntamiento" intro="Órganos de gobierno y comisiones informativas permanentes." crumbs={[{ label: "Ayuntamiento", href: "/ayuntamiento" }, { label: "Organización" }]} />
      <div className="container-site grid gap-12 py-10 md:py-14 lg:grid-cols-2">
        <section aria-labelledby="junta">
          <h2 id="junta" className="mb-4 font-serif text-h2 font-medium">Junta de Gobierno Local</h2>
          <table className="w-full border-collapse overflow-hidden rounded-[10px] bg-white text-left">
            <caption className="sr-only">Composición de la Junta de Gobierno Local</caption>
            <thead className="bg-stone-100">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Nombre</th>
                <th scope="col" className="px-4 py-3 font-semibold">Cargo</th>
              </tr>
            </thead>
            <tbody>
              {JUNTA_GOBIERNO.map((m) => (
                <tr key={m.name} className="border-t border-stone-200">
                  <td className="px-4 py-3 font-semibold">{m.name}</td>
                  <td className="px-4 py-3 text-ink-2">{m.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section aria-labelledby="comisiones">
          <h2 id="comisiones" className="mb-4 font-serif text-h2 font-medium">Comisiones informativas permanentes</h2>
          <table className="w-full border-collapse bg-white text-left">
            <caption className="sr-only">Comisiones informativas y su presidencia</caption>
            <thead className="bg-stone-100">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Comisión</th>
                <th scope="col" className="px-4 py-3 font-semibold">Presidencia</th>
              </tr>
            </thead>
            <tbody>
              {COMISIONES.map((c) => (
                <tr key={c.name} className="border-t border-stone-200">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3 text-ink-2">{c.president}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-[0.9375rem] text-muted">La composición completa de vocales y suplentes y los representantes municipales en otros órganos figuran en la fuente oficial.</p>
        </section>
        <div className="lg:col-span-2">
          <SourceNote sourceUrl={CORPORACION_SOURCE} sourceName="jaca.es — Gobierno, organización municipal" lastVerifiedAt={new Date(CORPORACION_VERIFIED_AT)} />
        </div>
      </div>
    </>
  );
}
