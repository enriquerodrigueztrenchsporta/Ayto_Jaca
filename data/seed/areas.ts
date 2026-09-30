/**
 * Áreas y servicios municipales. Solo se incluyen datos publicados en fuentes oficiales
 * (consulta 30/09/2026). Lo no publicado se marca en `pendingFields` y NO se muestra como dato.
 */
export type AreaSeed = {
  slug: string;
  name: string;
  description: string;
  phone?: string;
  email?: string;
  address?: string;
  schedule?: string;
  webUrl?: string;
  mapUrl?: string;
  sourceUrl: string;
  pendingFields?: string[];
};

const osm = (q: string) => `https://www.openstreetmap.org/search?query=${encodeURIComponent(q + ", 22700 Jaca")}`;

export const AREAS: AreaSeed[] = [
  {
    slug: "atencion-ciudadana",
    name: "Atención ciudadana y Registro",
    description: "Información general, registro de documentos y Casa Consistorial. Punto de entrada para cualquier trámite presencial.",
    phone: "974 355 758",
    address: "Calle Mayor, 24 · 22700 Jaca",
    mapUrl: osm("Calle Mayor 24"),
    sourceUrl: "https://www.jaca.es/",
    pendingFields: ["horario de atención y de registro", "correo electrónico general"],
  },
  {
    slug: "urbanismo",
    name: "Urbanismo, Obras, Servicios y Medio Ambiente",
    description: "Licencias y comunicaciones urbanísticas, planeamiento (PGOU), obras municipales, Agenda Urbana 2030 y medio ambiente.",
    email: "obrasurbanismo@aytojaca.es",
    sourceUrl: "https://www.jaca.es/agenda_urbana_de_jaca",
    pendingFields: ["teléfono directo", "dirección y horario de atención"],
  },
  {
    slug: "hacienda",
    name: "Hacienda y Tesorería",
    description: "Tributos, domiciliaciones, plusvalía (IIVTNU), bonificaciones fiscales, facturación electrónica y ficha de terceros.",
    sourceUrl: "https://www.jaca.es/ayuntamiento/tesoreria.html",
    pendingFields: ["teléfono", "correo electrónico", "horario"],
  },
  {
    slug: "policia-local",
    name: "Policía Local",
    description: "Servicio 24 horas, 365 días al año. Tráfico, grúa, objetos perdidos, atestados, mercado semanal y zonas peatonales.",
    phone: "974 357 225",
    email: "policialocal@aytojaca.es",
    address: "Av. Nuestra Señora de la Victoria, 3 · 22700 Jaca",
    schedule: "24 horas. Urgencias: 092 (desde móvil, 974 362 267)",
    mapUrl: osm("Avenida Nuestra Señora de la Victoria 3"),
    sourceUrl: "https://www.jaca.es/ayuntamiento/policia-local/policia-local-de-jaca.html",
  },
  {
    slug: "consumo",
    name: "Oficina Municipal de Información al Consumidor (OMIC)",
    description: "Información y orientación gratuita a personas consumidoras, mediación y tramitación de reclamaciones de consumo.",
    phone: "974 357 224",
    email: "consumo@aytojaca.es",
    address: "C/ Ramón y Cajal, 8 (Edificio Ayuntamiento) · 22700 Jaca",
    schedule: "De 9:00 a 13:00 h",
    mapUrl: osm("Calle Ramón y Cajal 8"),
    sourceUrl: "https://www.jaca.es/ayuntamiento/oficina-consumidor.html",
  },
  {
    slug: "archivo-municipal",
    name: "Archivo Municipal",
    description: "Consulta de fondos históricos y administrativos, reproducción de documentos, biblioteca auxiliar y hemeroteca de «El Pirineo Aragonés».",
    phone: "974 357 221",
    email: "archivo@aytojaca.es",
    address: "C/ Mayor, 24 · 22700 Jaca",
    schedule: "Lunes a viernes, de 9:00 a 14:30 h",
    mapUrl: osm("Calle Mayor 24"),
    sourceUrl: "https://www.jaca.es/ayuntamiento/archivo-municipal/servicios.html",
  },
  {
    slug: "oficina-de-turismo",
    name: "Oficina de Turismo",
    description: "Información turística municipal, comarcal y provincial en español, francés e inglés. Visitas guiadas a la ciudad y al Fuerte de Rapitán.",
    phone: "974 360 098",
    email: "oficinaturismo@aytojaca.es",
    address: "Plaza de San Pedro, 11-13 · 22700 Jaca",
    schedule:
      "Noviembre a marzo: lunes a jueves 9–13:30 y 15–18 h; viernes y sábados 9–13:30 y 16–19 h. Abril a octubre: lunes a sábado 9–13:30 y 16–19 h; domingos 9–13:30 h.",
    webUrl: "https://visitjaca.es/",
    mapUrl: osm("Plaza de San Pedro 11"),
    sourceUrl: "https://www.jaca.es/oficina.html",
  },
  {
    slug: "cultura",
    name: "Cultura, Tradiciones y Festejos",
    description: "Programación cultural, fiestas patronales, Primer Viernes de Mayo, festivales, equipamientos culturales y subvenciones culturales.",
    sourceUrl: "https://www.jaca.es/cultura.html",
    pendingFields: ["teléfono", "correo electrónico", "dirección"],
  },
  {
    slug: "escuela-de-musica",
    name: "Escuela Municipal de Música",
    description: "Enseñanza musical desde música para bebés hasta especialidades instrumentales. Matrícula, tasas, becas y calendario escolar.",
    phone: "974 355 528",
    email: "escuelamusica@aytojaca.es",
    address: "C/ Isaac Albéniz s/n (Complejo Cultural «La Paz») · 22700 Jaca",
    schedule: "Secretaría: lunes a viernes, de 9:00 a 14:00 h",
    mapUrl: osm("Calle Isaac Albéniz"),
    sourceUrl: "https://www.jaca.es/cultura/escuela-de-musica/secretaria-y-contacto.html",
  },
  {
    slug: "escuela-infantil",
    name: "Escuela Infantil Municipal Cervatillos",
    description: "Escuela municipal de 0 a 3 años, abierta desde 2003, orientada a la educación y a la conciliación de las familias de Jaca y sus núcleos.",
    phone: "974 356 001",
    email: "escuelainfantil@aytojaca.es",
    address: "C/ Burnao, s/n · 22700 Jaca",
    schedule: "De 7:45 a 16:00 h",
    mapUrl: osm("Calle Burnao"),
    sourceUrl: "https://www.jaca.es/ayuntamiento/escuela-infantil-municipal.html",
  },
  {
    slug: "deportes",
    name: "Servicio Municipal de Deportes",
    description: "Instalaciones deportivas, Centro de Piscinas, Spa y Fitness, cursos, Escuela de Verano y subvenciones deportivas.",
    phone: "974 355 306",
    webUrl: "https://www.deportesjaca.es/",
    sourceUrl: "https://www.jaca.es/turismo/viaje/telefonos.html",
  },
  {
    slug: "juventud",
    name: "Juventud · Oficina de Información Juvenil",
    description: "Actividades para jóvenes, Espacio Joven / Centro de Ocio Juvenil y Plan Local de Infancia y Adolescencia 2025-2029.",
    phone: "974 356 785",
    sourceUrl: "https://www.jaca.es/turismo/viaje/telefonos.html",
    pendingFields: ["correo electrónico", "dirección y horario"],
  },
  {
    slug: "bienestar-social",
    name: "Educación, Juventud y Bienestar Social",
    description: "Ayudas sociales, subvenciones de acción social, ayudas por partos y adopciones múltiples y ayudas a personas celíacas.",
    sourceUrl: "https://www.jaca.es/ayuntamiento/subvenciones.html",
    pendingFields: ["teléfono", "correo electrónico", "dirección"],
  },
  {
    slug: "recursos-humanos",
    name: "Asuntos Generales y Recursos Humanos",
    description: "Oferta de empleo público, procesos selectivos y bolsas de trabajo del Ayuntamiento.",
    sourceUrl: "https://www.jaca.es/ayuntamiento/recursos-humanos.html",
    pendingFields: ["teléfono", "correo electrónico"],
  },
  {
    slug: "fomento-economico",
    name: "Fomento Económico, Empleo y Emprendimiento",
    description: "Apoyo a pymes, comercio y personas emprendedoras, polígonos industriales y jornadas como «Jaca Re-Activa».",
    sourceUrl: "https://www.jaca.es/re-activa",
    pendingFields: ["teléfono", "correo electrónico"],
  },
  {
    slug: "biblioteca",
    name: "Biblioteca Municipal",
    description: "Préstamo, consulta, actividades y ciclos de cine. Catálogo en la red de Bibliotecas Públicas.",
    phone: "974 355 576",
    webUrl: "https://www.bibliotecaspublicas.es/jaca/",
    sourceUrl: "https://www.jaca.es/turismo/viaje/telefonos.html",
  },
  {
    slug: "palacio-de-congresos",
    name: "Palacio de Congresos",
    description: "Auditorio de 536 plazas, salas de reuniones y exposiciones. Sede de gran parte de la programación cultural.",
    phone: "974 356 002",
    webUrl: "https://www.congresosjaca.es/",
    sourceUrl: "https://www.jaca.es/turismo/congresos.html",
  },
  {
    slug: "albergue-de-peregrinos",
    name: "Albergue de Peregrinos",
    description: "Albergue del Camino de Santiago y Santo Grial para peregrinos con credencial (credenciales en la Iglesia de Santiago).",
    phone: "974 360 848",
    email: "albergueperegrinos@aytojaca.es",
    address: "C/ Conde Aznar, 9 · 22700 Jaca",
    schedule: "De 15:00 a 22:00 h. Salida antes de las 9:00 h",
    sourceUrl: "https://www.jaca.es/cultura/santiago/albergue-de-peregrinos-del-camino-de-santiago-y-santo-grial-con-credencial.html",
    pendingFields: ["periodo de apertura anual vigente"],
  },
];

export const USEFUL_PHONES: Array<{ name: string; phone: string }> = [
  { name: "Ayuntamiento (centralita)", phone: "974 355 758" },
  { name: "Policía Local", phone: "974 357 225 · 092" },
  { name: "Emergencias de Aragón", phone: "112" },
  { name: "Guardia Civil (información de carreteras)", phone: "062" },
  { name: "Policía Nacional", phone: "974 356 760 · 091" },
  { name: "Centro de Salud", phone: "974 360 795 · 974 362 586" },
  { name: "Hospital de Alta Resolución del Pirineo", phone: "974 355 331" },
  { name: "Cruz Roja", phone: "974 361 101 · 974 356 012" },
  { name: "Oficina de Turismo", phone: "974 360 098" },
  { name: "Taxis (Ayuntamiento)", phone: "974 361 156" },
  { name: "Estación de autobuses", phone: "974 355 060" },
  { name: "Comarca de la Jacetania", phone: "974 356 980" },
  { name: "Delegación del Gobierno de Aragón", phone: "974 356 735" },
];
export const USEFUL_PHONES_SOURCE = "https://www.jaca.es/turismo/viaje/telefonos.html";
