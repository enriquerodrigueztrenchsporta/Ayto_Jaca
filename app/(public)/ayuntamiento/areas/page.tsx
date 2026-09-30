import { PageHeader } from "@/components/public/PageHeader";
import { ContactCard } from "@/components/public/cards";
import { listAreas } from "@/lib/queries/public";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Áreas y servicios municipales", description: "Directorio de áreas y servicios del Ayuntamiento de Jaca con contacto, horario y trámites asociados.", path: "/ayuntamiento/areas" });

export default async function AreasPage() {
  const areas = await listAreas();
  return (
    <>
      <PageHeader title="Áreas y servicios" eyebrow="Ayuntamiento" intro="Encuentra el área que gestiona tu consulta, cómo contactar y qué trámites ofrece." crumbs={[{ label: "Ayuntamiento", href: "/ayuntamiento" }, { label: "Áreas y servicios" }]} />
      <div className="container-site py-10 md:py-14">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((a) => (
            <li key={a.id}>
              <ContactCard item={{ name: a.name, description: a.description, phone: a.phone, email: a.email, address: a.address, href: `/ayuntamiento/areas/${a.slug}`, pending: a.pendingFields }} headingLevel="h2" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
