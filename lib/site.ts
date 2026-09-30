/**
 * Datos institucionales y navegación.
 * Todos los datos de contacto proceden de fuentes oficiales consultadas el 30/09/2026
 * (ver docs/discovery.md). Lo no verificado se marca como pendiente y NO se muestra como cierto.
 */
export const VERIFIED_AT = "2026-09-30";

export const SITE = {
  name: "Ayuntamiento de Jaca",
  shortName: "Jaca",
  legalName: "Excmo. Ayuntamiento de Jaca",
  nif: "P2217800H",
  address: { street: "Calle Mayor, 24", postalCode: "22700", city: "Jaca", province: "Huesca", region: "Aragón" },
  phone: "974 355 758",
  phoneHref: "tel:+34974355758",
  description:
    "Portal municipal del Ayuntamiento de Jaca: trámites, sede electrónica, agenda, noticias, avisos, transparencia y servicios para vecinos, visitantes y empresas.",
  sources: {
    contact: "https://www.jaca.es/",
    nif: "https://jaca.sedipualba.es/",
  },
} as const;

export const EXTERNAL = {
  sede: "https://jaca.sedipualba.es/",
  sedeCatalog: "https://jaca.sedipualba.es/catalogoservicios.aspx",
  sedeFolder: "https://jaca.sedipualba.es/carpetaciudadana.aspx",
  tablon: "https://jaca.sedipualba.es/tablondeanuncios/",
  transparency: "https://jaca.sedelectronica.es/transparency",
  plenosStreaming: "https://www.youtube.com/@webtvjaca/streams",
  youtube: "https://www.youtube.com/user/webtvjaca",
  x: "https://twitter.com/aytojaca",
  visitJaca: "https://visitjaca.es/",
  deportes: "https://www.deportesjaca.es/",
  congresos: "https://www.congresosjaca.es/",
  biblioteca: "https://www.bibliotecaspublicas.es/jaca/",
  pabellonHielo: "https://www.pabellondehielojaca.com/",
  webcams: "http://camaras.jaca.es/",
  contratacionPleno:
    "https://contrataciondelestado.es/wps/poc?uri=deeplink%3AperfilContratante&idBp=qHtRIcxw%2F2sQK2TEfXGy%2BA%3D%3D",
  contratacionJunta:
    "https://contrataciondelestado.es/wps/poc?uri=deeplink%3AperfilContratante&idBp=Jfs8DGRprwsQK2TEfXGy%2BA%3D%3D",
  contratacionAlcaldia:
    "https://contrataciondelestado.es/wps/poc?uri=deeplink%3AperfilContratante&idBp=pU9bezSfi5suf4aBO%2BvQlQ%3D%3D",
  sugerencias: "https://jaca.sedipualba.es/carpetaciudadana/tramite.aspx?idtramite=26221",
  jacaEs: "https://www.jaca.es/",
} as const;

export function sedeTramite(id: number | string) {
  return `https://jaca.sedipualba.es/carpetaciudadana/tramite.aspx?idtramite=${id}`;
}

export type NavLink = { label: string; href: string; description?: string; external?: boolean };
export type NavSection = { label: string; href: string; intro: string; links: NavLink[] };

export const NAV: NavSection[] = [
  {
    label: "Trámites",
    href: "/tramites",
    intro: "Encuentra el trámite, qué necesitas y hazlo online en la Sede Electrónica.",
    links: [
      { label: "Buscador de trámites", href: "/tramites", description: "Todos los trámites por tema" },
      { label: "Sede Electrónica", href: EXTERNAL.sede, external: true, description: "Presenta solicitudes con certificado o Cl@ve" },
      { label: "Padrón y certificados", href: "/tramites?categoria=padron-y-certificados" },
      { label: "Urbanismo y obras", href: "/tramites?categoria=urbanismo-y-obras" },
      { label: "Tributos y pagos", href: "/tramites?categoria=tributos-y-pagos" },
      { label: "Subvenciones y ayudas", href: "/convocatorias", description: "Convocatorias abiertas y cerradas" },
      { label: "Empleo público", href: "/empleo-publico", description: "Procesos selectivos" },
      { label: "Impresos y documentos", href: "/documentos" },
    ],
  },
  {
    label: "Actualidad",
    href: "/actualidad",
    intro: "Lo que pasa en Jaca: noticias, avisos, agenda y plenos.",
    links: [
      { label: "Noticias", href: "/actualidad/noticias" },
      { label: "Avisos", href: "/avisos", description: "Cortes, obras, movilidad y bandos" },
      { label: "Agenda", href: "/agenda" },
      { label: "Plenos", href: "/plenos", description: "Convocatorias, orden del día y directo" },
      { label: "Convocatorias", href: "/convocatorias" },
    ],
  },
  {
    label: "Ayuntamiento",
    href: "/ayuntamiento",
    intro: "Cómo se organiza el Ayuntamiento y cómo contactar con cada área.",
    links: [
      { label: "Corporación municipal", href: "/ayuntamiento/corporacion" },
      { label: "Organización y Junta de Gobierno", href: "/ayuntamiento/organizacion" },
      { label: "Áreas y servicios", href: "/ayuntamiento/areas" },
      { label: "Participación ciudadana", href: "/ayuntamiento/participacion" },
      { label: "Contacto y teléfonos", href: "/contacto" },
    ],
  },
  {
    label: "Transparencia",
    href: "/transparencia",
    intro: "Información pública, normativa, contratación y presupuestos.",
    links: [
      { label: "Portal de Transparencia", href: EXTERNAL.transparency, external: true },
      { label: "Normativa y ordenanzas", href: "/transparencia/normativa" },
      { label: "Perfil del contratante", href: "/transparencia/contratacion" },
      { label: "Subvenciones", href: "/convocatorias" },
    ],
  },
  {
    label: "Ciudad",
    href: "/ciudad",
    intro: "Vivir en Jaca y en sus 34 núcleos rurales.",
    links: [
      { label: "Núcleos rurales", href: "/ciudad/nucleos-rurales" },
      { label: "Movilidad", href: "/ciudad/movilidad" },
      { label: "Medio ambiente", href: "/ciudad/medio-ambiente" },
      { label: "Educación", href: "/ciudad/educacion" },
      { label: "Juventud", href: "/ciudad/juventud" },
      { label: "Seguridad y Policía Local", href: "/ayuntamiento/areas/policia-local" },
      { label: "Consumo (OMIC)", href: "/ayuntamiento/areas/consumo" },
    ],
  },
  {
    label: "Cultura y ocio",
    href: "/cultura",
    intro: "Programación, fiestas, equipamientos culturales e instalaciones deportivas.",
    links: [
      { label: "Cultura", href: "/cultura" },
      { label: "Fiestas y tradiciones", href: "/cultura/fiestas-y-tradiciones" },
      { label: "Escuela Municipal de Música", href: "/cultura/escuela-de-musica" },
      { label: "Camino de Santiago", href: "/cultura/camino-de-santiago" },
      { label: "Deportes", href: "/deportes" },
      { label: "Instalaciones deportivas", href: "/deportes/instalaciones" },
    ],
  },
  {
    label: "Turismo",
    href: "/turismo",
    intro: "Descubre Jaca: patrimonio, naturaleza y planificación del viaje.",
    links: [
      { label: "Planifica tu viaje", href: "/turismo/planifica-tu-viaje" },
      { label: "Monumentos y museos", href: "/turismo/monumentos-y-museos" },
      { label: "Románico", href: "/turismo/romanico" },
      { label: "Modernismo", href: "/turismo/modernismo" },
      { label: "Naturaleza", href: "/turismo/naturaleza" },
      { label: "Oficina de Turismo", href: "/turismo/oficina-de-turismo" },
      { label: "visitjaca.es", href: EXTERNAL.visitJaca, external: true },
    ],
  },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Sede Electrónica", href: EXTERNAL.sede, external: true },
  { label: "Transparencia", href: "/transparencia" },
  { label: "Contacto", href: "/contacto" },
  { label: "Accesibilidad", href: "/accesibilidad" },
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Privacidad", href: "/privacidad" },
  { label: "Cookies", href: "/cookies" },
  { label: "Mapa web", href: "/mapa-web" },
];

export const SOCIAL: NavLink[] = [
  { label: "X (Twitter) @aytojaca", href: EXTERNAL.x, external: true },
  { label: "YouTube WebTV Jaca", href: EXTERNAL.youtube, external: true },
];

export const PENDING = "[PENDIENTE DE VALIDACIÓN POR EL AYUNTAMIENTO]";
