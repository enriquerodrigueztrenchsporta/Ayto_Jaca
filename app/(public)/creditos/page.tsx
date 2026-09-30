import Image from "next/image";
import { PageHeader } from "@/components/public/PageHeader";
import { ALL_IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Créditos fotográficos", description: "Autoría y licencias de las fotografías utilizadas en la web.", path: "/creditos" });

export default function CreditsPage() {
  return (
    <>
      <PageHeader
        title="Créditos fotográficos"
        intro="Las fotografías de esta propuesta proceden de Wikimedia Commons y se publican con licencias libres que permiten su reutilización citando la autoría. El Ayuntamiento podrá sustituirlas por su archivo fotográfico oficial."
        crumbs={[{ label: "Créditos fotográficos" }]}
        tone="snow"
      />
      <div className="container-site py-10 md:py-14">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ALL_IMAGES.map((i) => (
            <li key={i.key} className="overflow-hidden rounded-[10px] border border-stone-200 bg-white">
              <div className="relative aspect-[4/3]">
                <Image src={i.file} alt="" fill sizes="300px" className="object-cover" />
              </div>
              <div className="p-4 text-[0.9375rem]">
                <p className="font-semibold">{i.title.replace(/^File:/, "")}</p>
                <p className="text-ink-2">Autoría: {i.author}</p>
                <p className="text-ink-2">
                  Licencia:{" "}
                  {i.licenseUrl ? <a href={i.licenseUrl} className="link" target="_blank" rel="noopener noreferrer">{i.license}</a> : i.license}
                </p>
                <a href={i.sourceUrl} className="link" target="_blank" rel="noopener noreferrer">Ver en Wikimedia Commons<span className="sr-only"> (abre sitio externo)</span></a>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-[0.9375rem] text-muted">Las imágenes se han redimensionado para la web. Las obras con licencia CC BY-SA mantienen su licencia original.</p>
      </div>
    </>
  );
}
