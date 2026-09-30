import { SectionHub } from "@/components/public/SectionHub";
import { pageMetadata } from "@/lib/seo";
import { EXTERNAL } from "@/lib/site";

export const metadata = pageMetadata({ title: "Ciudad y municipio", description: "Vivir en Jaca y sus 34 núcleos rurales: movilidad, medio ambiente, educación, juventud, servicios sociales y seguridad.", path: "/ciudad" });

export default function CiudadPage() {
  return (
    <SectionHub
      section="ciudad"
      title="Ciudad y municipio"
      eyebrow="Vivir en Jaca"
      intro="Capital del Pirineo aragonés, a 820 metros de altitud junto al río Aragón, con un término municipal de 392 km² y 34 núcleos rurales."
      extra={[
        { title: "Policía Local y seguridad", text: "Servicio 24 horas, grúa, tráfico, objetos perdidos y atestados.", href: "/ayuntamiento/areas/policia-local" },
        { title: "Consumo (OMIC)", text: "Información y mediación gratuita en reclamaciones de consumo.", href: "/ayuntamiento/areas/consumo" },
        { title: "Espacio cardioprotegido", text: "Mapa interactivo de desfibriladores en Jaca (servicio externo).", href: "https://view.genially.com/67c1aee10ac4d4dbb51086e8/interactive-content-jaca-cardioprotegido/" },
        { title: "Webcams de Jaca", text: "Imágenes en directo de la ciudad (servicio municipal externo).", href: EXTERNAL.webcams },
      ]}
    />
  );
}
