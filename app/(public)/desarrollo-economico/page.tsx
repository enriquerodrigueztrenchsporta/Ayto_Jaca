import { SectionHub } from "@/components/public/SectionHub";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Desarrollo económico", description: "Empresas, comercio, empleo, emprendimiento, suelo industrial y contratación con el Ayuntamiento de Jaca.", path: "/desarrollo-economico" });

export default function DesarrolloPage() {
  return (
    <SectionHub
      section="desarrollo-economico"
      title="Desarrollo económico"
      eyebrow="Empresas y empleo"
      intro="Información para empresas, comercios, autónomos y personas emprendedoras: contratación pública, facturación, incentivos y suelo industrial."
      extra={[
        { title: "Empleo público", text: "Procesos selectivos del Ayuntamiento.", href: "/empleo-publico" },
        { title: "Abrir un negocio", text: "Licencias y declaraciones de actividad.", href: "/tramites?categoria=actividades-y-comercio" },
        { title: "Perfil del contratante", text: "Licitaciones del Ayuntamiento.", href: "/transparencia/contratacion" },
        { title: "Terrazas", text: "Solicitud anual del 1 de octubre al 30 de diciembre.", href: "/tramites/ocupacion-via-publica-terrazas" },
      ]}
    />
  );
}
