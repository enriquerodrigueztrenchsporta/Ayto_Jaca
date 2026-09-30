import { PageHeader } from "@/components/public/PageHeader";
import { DocumentLibrary } from "@/components/public/DocumentLibrary";
import { pageMetadata, param, type SearchParams } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Normativa municipal", description: "Ordenanzas, ordenanzas fiscales y precios públicos, reglamentos y protocolos del Ayuntamiento de Jaca.", path: "/transparencia/normativa" });

export default async function NormativaPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  return (
    <>
      <PageHeader
        title="Normativa municipal"
        eyebrow="Transparencia"
        intro="Textos oficiales de ordenanzas y reglamentos. Los documentos se enlazan en su ubicación oficial; en caso de discrepancia prevalece la publicación en el boletín oficial."
        crumbs={[{ label: "Transparencia", href: "/transparencia" }, { label: "Normativa" }]}
      />
      <div className="container-site py-10 md:py-14">
        <DocumentLibrary basePath="/transparencia/normativa" category={param(sp, "categoria")} q={param(sp, "q")} onlyCategories={["ordenanzas", "ordenanzas-fiscales", "reglamentos", "planes"]} />
      </div>
    </>
  );
}
