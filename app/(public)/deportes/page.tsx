import { SectionHub } from "@/components/public/SectionHub";
import { pageMetadata } from "@/lib/seo";
import { EXTERNAL } from "@/lib/site";

export const metadata = pageMetadata({ title: "Deportes", description: "Instalaciones deportivas, Pabellón de Hielo, Servicio Municipal de Deportes, clubes y agenda deportiva de Jaca.", path: "/deportes" });

export default function DeportesPage() {
  return (
    <SectionHub
      section="deportes"
      title="Deportes"
      eyebrow="Deporte en Jaca"
      intro="La ciudad del hielo y la montaña: instalaciones municipales, clubes, cursos y la programación del Servicio Municipal de Deportes."
      extra={[
        { title: "Servicio Municipal de Deportes", text: "Cursos, abonos, piscinas, spa y fitness. Tel. 974 355 306.", href: EXTERNAL.deportes },
        { title: "Pabellón de Hielo", text: "Patinaje público, hockey y eventos.", href: EXTERNAL.pabellonHielo },
        { title: "Agenda deportiva", text: "Próximas competiciones y actividades.", href: "/agenda?categoria=deporte" },
        { title: "Subvenciones deportivas", text: "Convocatorias para clubes y deportistas.", href: "/convocatorias" },
      ]}
    />
  );
}
