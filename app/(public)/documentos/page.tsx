import { PageHeader } from "@/components/public/PageHeader";
import { DocumentLibrary } from "@/components/public/DocumentLibrary";
import { pageMetadata, param, type SearchParams } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Impresos y documentos", description: "Impresos, solicitudes, normativa, convocatorias y documentos oficiales del Ayuntamiento de Jaca.", path: "/documentos" });

export default async function DocumentosPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  return (
    <>
      <PageHeader
        title="Impresos y documentos"
        eyebrow="Documentación"
        intro="Todos los impresos y documentos oficiales en un solo lugar. Siempre que exista, es preferible hacer el trámite online desde su ficha."
        crumbs={[{ label: "Trámites", href: "/tramites" }, { label: "Impresos y documentos" }]}
      />
      <div className="container-site py-10 md:py-14">
        <DocumentLibrary basePath="/documentos" category={param(sp, "categoria")} q={param(sp, "q")} />
      </div>
    </>
  );
}
