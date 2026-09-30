import { SectionHub } from "@/components/public/SectionHub";
import { pageMetadata } from "@/lib/seo";
import { EXTERNAL } from "@/lib/site";

export const metadata = pageMetadata({ title: "Cultura", description: "Programación cultural, fiestas y tradiciones, Escuela Municipal de Música, Camino de Santiago y equipamientos culturales de Jaca.", path: "/cultura" });

export default function CulturaPage() {
  return (
    <SectionHub
      section="cultura"
      title="Cultura"
      eyebrow="Cultura y tradiciones"
      intro="Del Primer Viernes de Mayo al ciclo de Jazz: la programación, las fiestas y los equipamientos culturales de la ciudad."
      extra={[
        { title: "Agenda cultural", text: "Exposiciones, teatro, música y visitas.", href: "/agenda?categoria=cultura" },
        { title: "Noticias de cultura", text: "Programación y novedades del área.", href: "/actualidad/noticias?categoria=cultura" },
        { title: "Palacio de Congresos", text: "Programación y entradas.", href: EXTERNAL.congresos },
        { title: "Biblioteca Municipal", text: "Catálogo y actividades.", href: EXTERNAL.biblioteca },
        { title: "Subvenciones culturales", text: "Convocatorias para entidades y asociaciones.", href: "/convocatorias" },
        { title: "Historia de Jaca", text: "Primera capital del Reino de Aragón.", href: "/ciudad/historia" },
      ]}
    />
  );
}
