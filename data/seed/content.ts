/**
 * Contenido dinámico inicial. TODO procede de fuentes oficiales (URL en `sourceUrl`) salvo
 * los registros con `isDemo: true`, que son ejemplos ficticios claramente etiquetados como DEMO
 * para enseñar funcionalidades (p. ej. un corte de tráfico) sin inventar hechos reales.
 * Los textos de noticias son resúmenes redactados a partir de la nota oficial, que se enlaza siempre.
 */
const F = "https://www.jaca.es/sites/default/files/";
const N = "https://www.jaca.es/noticias/";

type Doc = { title: string; url: string };

export type NewsSeed = {
  slug: string; title: string; excerpt: string; body: string; category: string; date: string;
  sourceUrl: string; sourceName?: string; featured?: boolean; documents?: Doc[]; links?: Array<{ label: string; url: string }>;
};

export const NEWS: NewsSeed[] = [
  {
    slug: "pleno-ordinario-22-septiembre-2026",
    title: "Pleno ordinario del 22 de septiembre",
    excerpt: "El Ayuntamiento celebró pleno ordinario el martes 22 de septiembre de 2026 a las 9:30 h, con asistencia presencial y retransmisión en directo.",
    body: "El Ayuntamiento de Jaca celebró **pleno ordinario el martes 22 de septiembre de 2026 a las 9:30 h**.\n\nLa sesión pudo seguirse de forma presencial en el Salón de Plenos o en directo a través del canal municipal de YouTube. El anuncio de convocatoria con el orden del día está disponible en la documentación adjunta.",
    category: "institucional", date: "2026-09-21T10:17:00Z", sourceUrl: N + "2026-09-21/pleno-ordinario-22-de-septiembre.html", featured: true,
    documents: [{ title: "Anuncio de convocatoria de la sesión ordinaria del Pleno de 22 de septiembre de 2026", url: F + "anuncio_convocatoria_sesion_ordinaria_pleno_de_fecha_22_de_septiembre_de_2026.pdf" }],
    links: [{ label: "Plenos en directo (YouTube)", url: "https://www.youtube.com/@webtvjaca/streams" }],
  },
  {
    slug: "semana-europea-del-deporte-2026",
    title: "Jaca celebra la Semana Europea del Deporte del 23 al 30 de septiembre",
    excerpt: "El Servicio Municipal de Deportes programa salidas en BTT, una competición HYROX por parejas, una charla sobre «El reto del Aneto» y caminatas saludables.",
    body: "Jaca se suma un año más a la **Semana Europea del Deporte**, que se celebra del 23 al 30 de septiembre de 2026 con actividades organizadas por el Servicio Municipal de Deportes.\n\nEntre las propuestas figuran una salida en BTT con el Club BTTAVA Jaca, una competición HYROX por parejas en CuboFit Piscinas, la charla «El reto del Aneto» en el Salón de Ciento y una actividad de caminata saludable para personas adultas y mayores en el paseo Manuel Giménez Abad.\n\nToda la información está en la web del Servicio Municipal de Deportes.",
    category: "deporte", date: "2026-09-15T15:44:00Z", sourceUrl: "https://www.deportesjaca.es/jaca-celebra-la-semana-europea-del-deporte-2026-del-23-al-30-de-septiembre/", sourceName: "Servicio Municipal de Deportes",
  },
  {
    slug: "consulta-publica-ordenanza-viviendas-municipales-alquiler",
    title: "Consulta pública para modificar la ordenanza de viviendas municipales en alquiler",
    excerpt: "La modificación permitirá diferenciar el alquiler asequible del alquiler social dentro del Plan de Vivienda municipal.",
    body: "El Ayuntamiento de Jaca ha iniciado la **consulta pública previa** para modificar la Ordenanza reguladora de la adjudicación de viviendas de promoción pública de titularidad municipal en régimen de alquiler, cuya última modificación data de 2015.\n\nEl objetivo es adaptar la norma a las nuevas modalidades de arrendamiento contempladas en el Plan de Vivienda en el que trabaja el Área de Urbanismo, estableciendo un régimen específico para el **alquiler asequible** sin renunciar a las políticas de alquiler social.\n\nLa consulta se abrió durante **cinco días hábiles** desde la publicación de la resolución de Alcaldía en el tablón de edictos y en la web municipal, para recoger la opinión de la ciudadanía y de las organizaciones afectadas.",
    category: "institucional", date: "2026-08-26T12:52:00Z", sourceUrl: N + "2026-08-26/el-ayuntamiento-de-jaca-inicia-la-consulta-publica-para-modificar-la-ordenanza-d", featured: true,
    documents: [{ title: "Resolución de Alcaldía n.º 2776 de 26/08/2026 — consulta previa", url: F + "resolucion_no_2776_de_26_08_2026_2._resolucion_de_alcaldia._consulta_previa._modificacion_ordenanza_vivienda_alquiler_-_segra_1057733.pdf" }],
  },
  {
    slug: "comunicado-oficial-incendio-agosto-2026",
    title: "Comunicado oficial del Ayuntamiento tras el incendio forestal",
    excerpt: "El Ayuntamiento agradece el trabajo de los equipos de extinción y la cooperación institucional tras el incendio que afectó desde los Mallos de Riglos a San Juan de la Peña y Monte Oroel.",
    body: "El Ayuntamiento de Jaca ha difundido un comunicado oficial tras el incendio que afectó a los montes desde las Peñas de Riglos hasta el espacio natural protegido de **San Juan de la Peña y Monte Oroel**.\n\nEl comunicado expresa el agradecimiento a los equipos de extinción y a la ayuda llegada desde Francia y otras comunidades autónomas, recuerda con reconocimiento al cabo Javier García Sancho, de la Unidad Militar de Emergencias, fallecido en acto de servicio, y destaca la colaboración entre el Gobierno de Aragón, las comarcas y los ayuntamientos.\n\nEl texto íntegro está disponible en el documento adjunto.",
    category: "institucional", date: "2026-08-21T08:58:00Z", sourceUrl: N + "2026-08-21/comunicado-oficial-del-ayuntamiento-de-jaca.html",
    documents: [{ title: "Comunicado oficial (texto íntegro)", url: F + "comunicado_oficial.pdf" }],
  },
  {
    slug: "bandos-uso-agua-baros-badaguas",
    title: "Bandos sobre el uso del agua en Barós y Badaguás",
    excerpt: "Medidas de ahorro y uso eficiente del agua, empezando por limitar el riego de jardines con agua potable, para garantizar el abastecimiento.",
    body: "La Alcaldía ha dictado **bandos para Barós y Badaguás** con medidas de ahorro y uso eficiente del agua durante el periodo estival.\n\nPara garantizar el abastecimiento destinado al consumo humano y a los usos domésticos prioritarios, se limitan los usos no prioritarios, como el **riego de jardines y zonas verdes con agua potable**, conforme al texto refundido de la Ley de Aguas y al Reglamento del Servicio Municipal de Abastecimiento de Agua.\n\nConsulte el texto de cada bando en los documentos adjuntos.",
    category: "bandos", date: "2026-07-30T14:27:00Z", sourceUrl: N + "2026-07-30/bandos-baros-y-badaguas.html",
    documents: [
      { title: "Bando Badaguás — uso del agua de riego", url: F + "bando_uso_agua_riego_badaguas.pdf" },
      { title: "Bando Barós — uso del agua de riego", url: F + "bando_uso_agua_riego_baros.pdf" },
    ],
  },
  {
    slug: "edificio-seis-viviendas-alquiler-asequible",
    title: "El Ayuntamiento adquiere un edificio para seis viviendas de alquiler asequible",
    excerpt: "La compra del inmueble de la calle San Nicolás, por 444.470,31 €, cuenta con 120.000 € de la Diputación Provincial de Huesca.",
    body: "El Ayuntamiento de Jaca ha adquirido un edificio en la **calle San Nicolás** que albergará **seis viviendas destinadas al alquiler asequible**, dentro del Plan de Vivienda Local.\n\nLa compra se ha formalizado por **444.470,31 euros (IVA incluido)** y ha contado con una aportación de **120.000 euros de la Diputación Provincial de Huesca** a través de su Plan de Vivienda.\n\nFinalizados los trámites de adquisición, el Ayuntamiento retomará los trabajos para concluir la obra. Las viviendas pasarán después a la bolsa municipal de alquiler asequible.",
    category: "institucional", date: "2026-07-06T09:00:00Z", sourceUrl: N + "2026-07-06/el-ayuntamiento-de-jaca-adquiere-un-edificio-para-seis-viviendas-destinadas-al-a",
  },
  {
    slug: "programa-fiestas-santa-orosia-san-pedro-2026",
    title: "Programa de las Fiestas de Santa Orosia y San Pedro 2026",
    excerpt: "Del 23 al 29 de junio, más de un centenar de actividades festivas, culturales, deportivas, musicales, infantiles, tradicionales y religiosas.",
    body: "Las **Fiestas de Santa Orosia y San Pedro 2026** se celebraron del **23 al 29 de junio** con una programación de más de un centenar de actividades: conciertos diarios, actividades familiares, pasacalles, propuestas para mayores, competiciones deportivas, actos de las peñas y las Jornadas de Folklore de Santa Orosia, entre otras.\n\nEl programa completo puede consultarse en el documento adjunto.",
    category: "cultura", date: "2026-06-11T09:00:00Z", sourceUrl: N + "2026-06-11/programa-fiestas-de-santa-orosia-y-san-pedro-2026.html",
    documents: [{ title: "Programa Fiestas de Jaca 2026", url: F + "programa_fiestas_jaca_2026_2.pdf" }],
  },
  {
    slug: "fortium-red-transfronteriza-fortificaciones",
    title: "Jaca lidera el proyecto europeo FORTIUM de fortificaciones del Pirineo",
    excerpt: "El Fuerte de Rapitán se convertirá en un parque cultural inmersivo dentro de una red transfronteriza financiada por el programa POCTEFA 2021-2027.",
    body: "El Ayuntamiento de Jaca ha presentado **FORTIUM – Red Transfronteriza de Fortificaciones del Pirineo**, un proyecto financiado por el programa **POCTEFA 2021-2027** con un presupuesto global de **2.768.693,69 euros**.\n\nEl consorcio reúne a cinco socios: el Ayuntamiento de Jaca (líder en la vertiente española), el Ayuntamiento de Canfranc, la Communauté de Communes du Haut-Béarn, la Office de Tourisme du Haut-Béarn y la Corporación Aragonesa de Radio y Televisión.\n\nEl Ayuntamiento gestionará **744.702 euros** para adecuar varias salas del **Fuerte de Rapitán**, que hoy solo puede visitarse en verano con visita guiada, y desarrollar una museografía con experiencias digitales. El plazo de ejecución se extiende hasta finales de 2028.",
    category: "turismo", date: "2026-02-26T10:00:00Z", sourceUrl: N + "2026-02-26/jaca-lidera-el-proyecto-europeo-fortium-para-crear-una-red-transfronteriza-de-fo",
  },
  {
    slug: "policia-local-equipamiento-dph",
    title: "La Policía Local mejora su equipamiento con apoyo de la Diputación de Huesca",
    excerpt: "Chalecos, cascos para la unidad de motoristas, tablets para los vehículos y medios para el aula de formación.",
    body: "La Policía Local de Jaca ha renovado parte de su equipamiento gracias a la convocatoria de subvenciones de la **Diputación Provincial de Huesca** para la mejora de las policías locales (2025).\n\nSe han incorporado, entre otros, tres chalecos antibalas, 36 portacargadores tácticos y 15 cascos modulares homologados para la unidad de motoristas; tres tablets con soportes para los vehículos policiales, y un proyector y pantalla para el aula de formación.",
    category: "institucional", date: "2026-02-23T10:00:00Z", sourceUrl: N + "2026-02-23/la-policia-local-de-jaca-mejora-su-equipamiento-gracias-al-apoyo-de-la-diputacio",
  },
  {
    slug: "jaca-pirineos-futbol-cup",
    title: "La primera «Jaca-Pirineos Fútbol Cup» reunirá a más de 1.000 deportistas",
    excerpt: "Torneo de fútbol base del 21 al 23 de junio de 2026 en Jaca, Villanúa, Castiello de Jaca y Sabiñánigo.",
    body: "El Ayuntamiento acogió la presentación de la **Jaca-Pirineos Fútbol Cup**, un torneo de fútbol base (categorías benjamín a juvenil, masculino y femenino) que celebró su primera edición del **21 al 23 de junio de 2026** en Jaca, Villanúa, Castiello de Jaca y Sabiñánigo.\n\nOrganizado por MHLSports con la colaboración de los ayuntamientos participantes, el torneo se enmarca en la estrategia municipal de turismo deportivo y desestacionalización.",
    category: "deporte", date: "2026-02-06T10:00:00Z", sourceUrl: N + "2026-02-06/la-primera-edicion-del-torneo-jaca-pirineos-futbol-cup-congregara-mas-de-1000-de",
  },
  {
    slug: "programacion-cultural-invierno-2026",
    title: "Programación cultural de invierno: teatro, ciencia y 25 años del ciclo de Jazz",
    excerpt: "Enero, febrero y marzo con teatro en el Palacio de Congresos, la conferencia de María Josefa Yzuel y el 25.º aniversario del ciclo de Jazz.",
    body: "La concejalía de Cultura, Tradiciones y Festejos presentó la programación de **enero a marzo de 2026**: teatro en el Palacio de Congresos, la conferencia «El reto de atraer más mujeres para la ciencia» a cargo de la jacetana e hija predilecta **María Josefa Yzuel** (11 de febrero), documentales y el **ciclo de Jazz**, que celebró su 25.º aniversario en marzo con conferencias, cine en la Biblioteca, exposición y conciertos.",
    category: "cultura", date: "2026-01-16T10:00:00Z", sourceUrl: N + "2026-01-16/la-actividad-cultural-continua-en-jaca-tras-unas-exitosas-navidades.html",
  },
  {
    slug: "presupuesto-municipal-2026",
    title: "Aprobado el presupuesto municipal de 2026: 29,7 millones de euros",
    excerpt: "Más de 6 millones en inversiones, con casi 3 millones para movilidad urbana, vestuarios del campo Oroel, el polígono de Martillué y el antiguo IPE.",
    body: "El Pleno extraordinario del 11 de diciembre de 2025 aprobó el **presupuesto general de 2026**, que asciende a **29.746.115,11 euros**.\n\nEl capítulo de inversiones supera los **6 millones de euros** (1,5 millones de financiación municipal y el resto de otras administraciones). Destacan casi 3 millones para movilidad urbana —entre ellos un elevador entre Membrilleras y la calle Mayor y la puesta en valor del tramo de muralla de la avenida Oroel—, 528.000 euros adicionales para los vestuarios del campo Oroel, 170.000 euros para la primera fase del polígono de Martillué, 1,2 millones para un proyecto de innovación tecnológica en el antiguo edificio del IPE y 1,1 millones en dos años de fondos POCTEFA.",
    category: "institucional", date: "2025-12-11T12:00:00Z", sourceUrl: N + "2025-12-11/el-ayuntamiento-de-jaca-aprueba-un-presupuesto-de-casi-30-millones-de-euros-para",
  },
  {
    slug: "ordenanzas-fiscales-2026",
    title: "Ordenanzas fiscales 2026: se congela la mayoría de impuestos y tasas",
    excerpt: "Ajustes en residuos (+6,7 %), alcantarillado (IPC) y nuevas bonificaciones en IBI, ICIO, IAE y piscinas.",
    body: "El Pleno ordinario del 21 de octubre de 2025 aprobó las **Ordenanzas Fiscales para 2026**, que congelan la mayoría de impuestos y tasas e introducen ajustes moderados:\n\n- **Recogida de residuos** (Ordenanza n.º 5): +6,7 % para garantizar el equilibrio financiero del servicio.\n- **Alcantarillado** (n.º 6): +2,7 % (IPC).\n- **IBI** (n.º 9): refuerzo de bonificaciones por autoconsumo y alquiler con renta limitada; exención para centros sanitarios públicos.\n- **Vehículos** (n.º 10): +1,6 %.\n- **ICIO** (n.º 11): bonificación por interés municipal de hasta el 50 %.\n- **IAE** (n.º 13): bonificación del 20 % ampliada a quien pase de 2 a 4 trabajadores.\n- **Piscinas, spa y fitness**: descuento del 25 % para familias numerosas y monoparentales.\n\nEn la misma sesión se aprobó la modificación del Plan Parcial del polígono «Campancián I».",
    category: "institucional", date: "2025-10-21T12:00:00Z", sourceUrl: N + "2025-10-21/el-ayuntamiento-de-jaca-congela-la-mayoria-de-impuestos-y-tasas-y-posibilita-la-",
  },
  {
    slug: "horarios-pabellon-de-hielo-octubre-2026",
    title: "Horarios de las sesiones públicas del Pabellón de Hielo en octubre",
    excerpt: "El Servicio Municipal de Deportes publica los horarios de patinaje público para octubre de 2026 y los nuevos horarios de fitness desde el 1 de octubre.",
    body: "El Servicio Municipal de Deportes ha publicado los **horarios de las sesiones públicas del Pabellón de Hielo de Jaca para octubre de 2026**, así como los **horarios de las actividades de fitness a partir del 1 de octubre**.\n\nConsulte los horarios detallados en la web del Servicio Municipal de Deportes.",
    category: "deporte", date: "2026-09-28T12:08:00Z", sourceUrl: "https://www.deportesjaca.es/horarios-de-las-sesiones-publicas-del-pabellon-de-hielo-de-jaca-octubre-2026/", sourceName: "Servicio Municipal de Deportes",
    links: [
      { label: "Horarios del Pabellón de Hielo (octubre 2026)", url: "https://www.deportesjaca.es/horarios-de-las-sesiones-publicas-del-pabellon-de-hielo-de-jaca-octubre-2026/" },
      { label: "Horarios de fitness desde el 1 de octubre", url: "https://www.deportesjaca.es/horarios-de-las-actividades-de-fitness-a-partir-del-1-de-octubre/" },
    ],
  },
];

export type SessionSeed = { slug: string; title: string; type: "ORDINARIA" | "EXTRAORDINARIA"; date: string; timeText?: string; sourceUrl: string; documents?: Doc[]; agenda?: string };
const YT = "https://www.youtube.com/@webtvjaca/streams";

export const SESSIONS: SessionSeed[] = [
  { slug: "pleno-ordinario-2026-09-22", title: "Pleno ordinario de 22 de septiembre de 2026", type: "ORDINARIA", date: "2026-09-22T07:30:00Z", timeText: "9:30 h", sourceUrl: N + "2026-09-21/pleno-ordinario-22-de-septiembre.html",
    documents: [{ title: "Anuncio de convocatoria y orden del día", url: F + "anuncio_convocatoria_sesion_ordinaria_pleno_de_fecha_22_de_septiembre_de_2026.pdf" }] },
  { slug: "pleno-ordinario-2026-07-21", title: "Pleno ordinario de 21 de julio de 2026", type: "ORDINARIA", date: "2026-07-21T07:30:00Z", timeText: "9:30 h", sourceUrl: N + "2026-07-20/pleno-ordinario-21-de-julio.html",
    documents: [{ title: "Orden del día del pleno ordinario de 21 de julio", url: F + "00.-_concocatoria.pdf" }] },
  { slug: "pleno-ordinario-2026-06-16", title: "Pleno ordinario de 16 de junio de 2026", type: "ORDINARIA", date: "2026-06-16T07:30:00Z", timeText: "9:30 h", sourceUrl: N + "2026-06-15/pleno-ordinario-16-de-junio.html",
    documents: [{ title: "Orden del día del pleno ordinario de 16 de junio", url: F + "anuncio_convocatoria_sesion_ordinaria_pleno_16_de_junio_de_2026_-_sefycu_6933572_0.pdf" }] },
  { slug: "pleno-ordinario-2026-05-19", title: "Pleno ordinario de 19 de mayo de 2026", type: "ORDINARIA", date: "2026-05-19T07:30:00Z", sourceUrl: N + "2026-05-18/pleno-ordinario-19-de-mayo.html" },
  { slug: "pleno-ordinario-2026-04-21", title: "Pleno ordinario de 21 de abril de 2026", type: "ORDINARIA", date: "2026-04-21T07:30:00Z", sourceUrl: N + "2026-04-20/pleno-ordinario-21-de-abril.html" },
  { slug: "pleno-ordinario-2026-03-17", title: "Pleno ordinario de 17 de marzo de 2026", type: "ORDINARIA", date: "2026-03-17T08:30:00Z", sourceUrl: N + "2026-03-16/pleno-ordinario-17-de-marzo-de-2026.html" },
  { slug: "pleno-ordinario-2026-02-17", title: "Pleno ordinario de 17 de febrero de 2026", type: "ORDINARIA", date: "2026-02-17T08:30:00Z", sourceUrl: N + "2026-02-16/pleno-ordinario-17-de-febrero.html" },
  { slug: "pleno-ordinario-2026-01-20", title: "Pleno ordinario de 20 de enero de 2026", type: "ORDINARIA", date: "2026-01-20T08:30:00Z", sourceUrl: N + "2026-01-19/pleno-ordinario-20-de-enero-de-2026.html" },
  { slug: "pleno-extraordinario-2025-12-29", title: "Pleno extraordinario de 29 de diciembre de 2025", type: "EXTRAORDINARIA", date: "2025-12-29T08:30:00Z", sourceUrl: N + "2025-12-27/pleno-extraordinario-29-de-diciembre-de-2025.html" },
  { slug: "pleno-extraordinario-2025-12-11", title: "Pleno extraordinario de 11 de diciembre de 2025 (presupuesto 2026)", type: "EXTRAORDINARIA", date: "2025-12-11T08:30:00Z", sourceUrl: N + "2025-12-10/pleno-extraordinario-11-de-diciembre-de-2025.html",
    agenda: "Aprobación del presupuesto general para el ejercicio 2026 (29.746.115,11 €), según la nota informativa municipal de 11/12/2025." },
];
export const STREAMING_URL = YT;

export type GrantSeed = {
  slug: string; title: string; status: "UPCOMING" | "OPEN" | "CLOSED" | "AWARDED"; openingDate?: string; deadline?: string; deadlineText?: string;
  beneficiaries: string; summary: string; body?: string; sourceUrl: string; sedeId?: number; area: string; documents: Doc[];
};

const S = "https://www.jaca.es/ayuntamiento/subvenciones/";
export const GRANTS: GrantSeed[] = [
  {
    slug: "subvenciones-actividades-culturales-2026", title: "Subvenciones a entidades y asociaciones para actividades culturales 2026", status: "OPEN",
    openingDate: "2026-09-04", deadline: "2026-10-01T21:59:00Z",
    beneficiaries: "Entidades y asociaciones sin ánimo de lucro del municipio de Jaca",
    summary: "Convocatoria en concurrencia competitiva para la realización de actividades culturales en 2026.",
    body: "El plazo de presentación es de **20 días hábiles** desde el día siguiente a la publicación del extracto en el Boletín Oficial de la Provincia de Huesca (BOPH n.º 168, de 03/09/2026), **finalizando el 1 de octubre de 2026**.\n\nLas solicitudes se dirigen al órgano convocante, suscritas por la entidad beneficiaria o su representante, junto con la documentación anexa.",
    sourceUrl: S + "convocatoria-publica-de-subvenciones-entidades-y-asociaciones-sin-animo--0", sedeId: 29410, area: "cultura",
    documents: [
      { title: "Extracto BOPH n.º 168 (03/09/2026)", url: F + "boph_no_168_03-09-2026_convocatoria_subvenciones_para_actividades_culturales_ano_2026.pdf" },
      { title: "Acuerdo de convocatoria", url: F + "acuerdo_convocatoria_subvenciones_para_actividades_culturales_ano_2026.pdf" },
      { title: "Anexo I — Formulario de solicitud", url: F + "2026_anexo_i_formulario_solicitud.doc" },
      { title: "Anexo I.1 — Memoria, presupuesto y financiación", url: F + "2026_anexo_i.1_memoria_presupuesto_financiacion_0.docx" },
      { title: "Anexo I.2 — Declaración responsable sobre otras subvenciones", url: F + "2026_anexo_i._2_declaracion_responsable_otras_subvenciones.doc" },
      { title: "Anexo II — Justificación de la subvención", url: F + "2026_anexo_ii_justificacion-subvencion.doc" },
    ],
  },
  {
    slug: "ayudas-partos-adopciones-multiples-2025-2026", title: "Ayudas a familias con hijos o hijas de partos o adopciones múltiples 2025-2026", status: "OPEN",
    openingDate: "2026-07-31", deadline: "2026-11-30T22:59:00Z",
    beneficiaries: "Familias con hijos o hijas nacidos de un mismo parto o procedentes de una adopción múltiple",
    summary: "Subvención municipal para familias con partos o adopciones múltiples. Plazo hasta el 30 de noviembre de 2026 inclusive.",
    sourceUrl: S + "convocatoria-de-subvenciones-para-familias-con-hijosas-nacidosas-de-partos", sedeId: 30373, area: "bienestar-social",
    documents: [
      { title: "Convocatoria", url: F + "convocatoria_de_subvenciones_para_familias_con_hijos_nacidos_de_un_mismo_parto_o_adopcion_multiple.pdf" },
      { title: "Extracto BOPH n.º 144 (30/07/2026)", url: F + "publicacion_extracto_boph_no_144_fecha_30-07-2026_partos_multiples_2025-2026.pdf" },
      { title: "Anexo I — Solicitud", url: F + "anexo_i_solicitud_3.pdf" },
      { title: "Ficha de terceros", url: F + "ficha_de_terceros.pdf" },
      { title: "Autorización para recabar datos de la Agencia Tributaria", url: F + "autorizacion_para_recabar_datos_de_la_agencia_tributaria.pdf" },
    ],
  },
  {
    slug: "subvenciones-accion-social-2026", title: "Subvenciones a asociaciones en materia de acción social 2026", status: "CLOSED",
    deadline: "2026-08-29T21:59:00Z", beneficiaries: "Asociaciones del municipio de Jaca",
    summary: "Convocatoria de subvenciones a asociaciones para proyectos de acción social. Plazo finalizado el 29 de agosto de 2026.",
    sourceUrl: S + "convocatoria-subvenciones-asociaciones-del-municipio-de-jaca-en-materia-de", sedeId: 29468, area: "bienestar-social",
    documents: [
      { title: "Extracto BOPH n.º 144 (30/07/2026)", url: F + "publicacion_extracto_boph_no_144_fecha_30-07-2026_accion_social.pdf" },
      { title: "Convocatoria", url: F + "convocatoria_de_subvenciones_a_asociaciones_del_municipio_de_jaca_en_materia_de_accion_social.pdf" },
      { title: "Anexo I — Solicitud", url: F + "anexo_i_solicitud_2.pdf" },
    ],
  },
  {
    slug: "ayudas-celiaquia-2026", title: "Ayudas a personas afectadas por celiaquía o intolerancia al gluten 2026", status: "CLOSED",
    deadline: "2026-07-16T21:59:00Z", beneficiaries: "Personas afectadas por la enfermedad celíaca o intolerancia al gluten",
    summary: "Ayudas municipales para personas celíacas. Plazo finalizado el 16 de julio de 2026.",
    sourceUrl: S + "convocatoria-para-la-concesion-de-ayudas-personas-afectadas-por-la-enfer-0", sedeId: 29468, area: "bienestar-social",
    documents: [
      { title: "Convocatoria", url: F + "convocatoria_de_ayudas_a_personas_afectadas_por_enfermedad_celiaca_o_intolerancia_al_gluten_-_sefycu_6962369_0.pdf" },
      { title: "Datos de identificación de la subvención", url: F + "datos_de_identificacion_de_la_subvencion_0.pdf" },
    ],
  },
  {
    slug: "subvenciones-actividades-deportivas-2026", title: "Subvenciones para actividades deportivas 2026", status: "AWARDED",
    deadline: "2026-07-09T21:59:00Z", beneficiaries: "Personas físicas, entidades y asociaciones sin ánimo de lucro del municipio",
    summary: "Convocatoria para actividades deportivas anuales y extraordinarias. Figura como «concedida» en la web municipal.",
    sourceUrl: S + "convocatoria-de-subvenciones-personas-fisicas-entidades-y-asociaciones-s-6", sedeId: 29409, area: "deportes",
    documents: [
      { title: "Extracto BOP n.º 115 (19/06/2026)", url: F + "publicacion_bop_no_115_fecha_19-06-26_personas_fisicas_entidades_y_asociaciones_sin_animo_de_lucro.pdf" },
      { title: "Bases de la convocatoria", url: F + "bases_convocatoria_de_subvenciones_concurrencia_competitiva_actividades_deportivas_jaca_2026.pdf" },
      { title: "Anexo II — Justificación", url: F + "anexo_ii._justificacion_subvencion.pdf" },
    ],
  },
];

export type JobSeed = { slug: string; title: string; status: "OPEN" | "IN_PROGRESS" | "CLOSED" | "UPCOMING"; staffType: string; positions?: number; openingDate: string; deadline: string; summary: string; body?: string; sourceUrl: string; documents: Doc[] };
const RH = "https://www.jaca.es/ayuntamiento/recursos-humanos/";
export const JOBS: JobSeed[] = [
  {
    slug: "administrativo-concurso-oposicion-2026", title: "Una plaza de Administrativo (concurso-oposición, turno libre)", status: "IN_PROGRESS", staffType: "Personal funcionario", positions: 1,
    openingDate: "2026-08-27", deadline: "2026-09-23T21:59:00Z",
    summary: "Plaza vacante de Administrativo en la plantilla de personal funcionario. Plazo de instancias: del 27 de agosto al 23 de septiembre de 2026.",
    sourceUrl: RH + "convocatoria-de-concurso-oposicion-de-una-plaza-de-administrativo.html",
    documents: [
      { title: "Publicación BOPH", url: F + "publicacion_boph_34.pdf" },
      { title: "Publicación BOA", url: F + "boa_num._144.pdf" },
      { title: "Modificación de bases (BOPH)", url: F + "boph_num._145_0.pdf" },
      { title: "Publicación BOE", url: F + "boe-a-2026-18192_0.pdf" },
      { title: "Modelo de instancia", url: F + "modelo_instancia_concurso_oposicion_31.doc" },
    ],
  },
  {
    slug: "auxiliar-administrativo-concurso-oposicion-2026", title: "Una plaza de Auxiliar Administrativo (concurso-oposición, turno libre)", status: "IN_PROGRESS", staffType: "Personal funcionario", positions: 1,
    openingDate: "2026-08-27", deadline: "2026-09-23T21:59:00Z",
    summary: "Plaza vacante de Auxiliar Administrativo en la plantilla de personal funcionario. Plazo de instancias: del 27 de agosto al 23 de septiembre de 2026.",
    sourceUrl: RH + "convocatoria-de-concurso-oposicion-de-una-plaza-de-auxiliar-administra",
    documents: [
      { title: "Publicación BOPH", url: F + "publicacion_boph_35.pdf" },
      { title: "Publicación BOA", url: F + "boa_num._144_0.pdf" },
      { title: "Modificación de bases (BOPH)", url: F + "boph_num._145.pdf" },
      { title: "Publicación BOE", url: F + "boe-a-2026-18192_1.pdf" },
      { title: "Modelo de instancia", url: F + "modelo_instancia_concurso_oposicion_32.doc" },
    ],
  },
  {
    slug: "profesor-guitarra-concurso-oposicion-2026", title: "Una plaza de Profesor/a de Guitarra (personal laboral fijo)", status: "IN_PROGRESS", staffType: "Personal laboral", positions: 1,
    openingDate: "2026-08-08", deadline: "2026-09-04T21:59:00Z",
    summary: "Plaza vacante de profesor/a de guitarra en la plantilla de personal laboral. Plazo de instancias: del 8 de agosto al 4 de septiembre de 2026.",
    sourceUrl: RH + "convocatoria-de-concurso-oposicion-para-la-cobertura-con-caracter-fijo",
    documents: [
      { title: "Publicación BOPH", url: F + "publicacion_boph_36.pdf" },
      { title: "Publicación BOA", url: F + "boa_num._144_2.pdf" },
      { title: "Publicación BOE", url: F + "boe-a-2026-17231_0.pdf" },
      { title: "Modelo de instancia", url: F + "modelo_instancia_concurso_oposicion_30.doc" },
    ],
  },
  {
    slug: "operario-brigada-obras-concurso-oposicion-2026", title: "Una plaza de Operario/a de la Brigada de Obras y Servicios", status: "IN_PROGRESS", staffType: "Personal funcionario", positions: 1,
    openingDate: "2026-08-08", deadline: "2026-09-04T21:59:00Z",
    summary: "Plaza vacante de operario/a de la brigada de obras y servicios, turno libre. Plazo de instancias: del 8 de agosto al 4 de septiembre de 2026.",
    sourceUrl: RH + "convocatoria-de-concurso-oposicion-para-la-provision-de-una-plaza-d-14",
    documents: [
      { title: "Publicación BOPH", url: F + "publicacion_boph_37.pdf" },
      { title: "Publicación BOA", url: F + "boa_num._144_1.pdf" },
      { title: "Publicación BOE", url: F + "boe-a-2026-17231.pdf" },
      { title: "Modelo de instancia", url: F + "modelo_instancia_concurso_oposicion_28.doc" },
    ],
  },
  {
    slug: "alumnado-pci-operario-forestal-2026-2027", title: "Selección de 10 alumnos/as del Programa de Cualificación Inicial de Operario Forestal 2026/2027", status: "IN_PROGRESS", staffType: "Formación", positions: 10,
    openingDate: "2026-08-04", deadline: "2026-08-24T21:59:00Z",
    summary: "Plazo de instancias del 4 al 24 de agosto de 2026. Examen: 11 de septiembre de 2026 a las 10:00 h en el centro de formación del PCI.",
    sourceUrl: RH + "convocatoria-para-la-seleccion-de-diez-alumnos-del-programa-de-cualifi",
    documents: [
      { title: "Convocatoria (BOPH)", url: F + "boph_num._146.pdf" },
      { title: "Resolución n.º 2831 — lista de admitidos, tribunal y fecha del ejercicio", url: F + "resolucion_no_2831_de_01_09_2026_resolucion_lista_admitidos_tribunal_y_fecha_ejercicio_alumnos_pci_26_27_-_segra_1059638.pdf" },
      { title: "Resolución n.º 2832 — citación complementaria", url: F + "resolucion_no_2832_de_01_09_2026_resolucion_complementaria_citacion_alumnos_pci_-_segra_1059717_1.pdf" },
    ],
  },
];

export type EventSeed = {
  slug: string; title: string; description: string; category: string; start: string; end?: string; timeText?: string; location?: string; address?: string;
  organizer?: string; price?: string; bookingUrl?: string; url?: string; featured?: boolean; recurrence?: "NONE" | "WEEKLY"; expiresAt?: string; sourceUrl: string; sourceName: string;
};
const PDF_AGENDA = "https://visitjaca.es/wp-content/uploads/2026/09/Proximas-actividades.pdf";
export const EVENTS: EventSeed[] = [
  {
    slug: "caminata-saludable-semana-europea-deporte-2026", title: "Caminata saludable para adultos y personas mayores",
    description: "Actividad de la Semana Europea del Deporte. Actividad libre y gratuita, sin inscripción previa.", category: "deporte",
    start: "2026-09-30T07:00:00Z", timeText: "9:00 – 10:30 h", location: "Paseo Manuel Giménez Abad", organizer: "Servicio Municipal de Deportes", price: "Gratuita",
    url: "https://www.deportesjaca.es/", sourceUrl: PDF_AGENDA, sourceName: "Oficina de Turismo de Jaca — Próximas actividades",
  },
  {
    slug: "exposicion-palabras-de-la-historia", title: "Exposición «Palabras de la Historia»",
    description: "Exposición temporal en el Museo Diocesano de Jaca, en el horario habitual del museo (martes a sábado de 10 a 13:30 y de 16 a 19 h; domingos de 10 a 13:30 h; lunes cerrado).",
    category: "cultura", start: "2026-09-24T00:00:00Z", end: "2026-10-20T21:00:00Z", timeText: "Horario del museo", location: "Museo Diocesano de Jaca",
    organizer: "Museo Diocesano de Jaca", bookingUrl: "https://museodiocesanodejaca.es", featured: true, sourceUrl: PDF_AGENDA, sourceName: "Oficina de Turismo de Jaca — Próximas actividades",
  },
  {
    slug: "exposicion-mujeres-ignoradas-ciudadela", title: "Exposición «Mujeres ignoradas», de Ismael García",
    description: "Exposición en la Ciudadela de Jaca, en su horario habitual (de 10:30 a 13:30 y de 16 a 19:30 h).", category: "cultura",
    start: "2026-09-24T00:00:00Z", end: "2026-11-08T22:00:00Z", timeText: "10:30–13:30 y 16:00–19:30 h", location: "Ciudadela de Jaca",
    organizer: "Ciudadela de Jaca", bookingUrl: "https://www.ciudadeladejaca.es", sourceUrl: PDF_AGENDA, sourceName: "Oficina de Turismo de Jaca — Próximas actividades",
  },
  {
    slug: "exposicion-jaca-naturaleza-y-retrato", title: "Exposición «Jaca, Naturaleza y retrato», de M.ª Luisa Verdugo",
    description: "Acuarelas y acrílicos en la Ciudadela de Jaca, en su horario habitual.", category: "cultura",
    start: "2026-09-24T00:00:00Z", end: "2026-11-15T22:00:00Z", timeText: "10:30–13:30 y 16:00–19:30 h", location: "Ciudadela de Jaca",
    organizer: "Ciudadela de Jaca", bookingUrl: "https://www.ciudadeladejaca.es", sourceUrl: PDF_AGENDA, sourceName: "Oficina de Turismo de Jaca — Próximas actividades",
  },
  {
    slug: "visita-guiada-jaca-medieval", title: "Visita guiada «Jaca Medieval»",
    description: "Recorrido por la Catedral, el Museo Diocesano y el casco histórico. Todos los sábados a las 11 h. Reservas: 974 362 185.", category: "turismo",
    start: "2026-10-03T09:00:00Z", timeText: "11:00 h", location: "Museo Diocesano de Jaca", organizer: "Museo Diocesano de Jaca",
    bookingUrl: "https://museodiocesanodejaca.es", recurrence: "WEEKLY", expiresAt: "2026-10-31T23:00:00Z", sourceUrl: PDF_AGENDA, sourceName: "Oficina de Turismo de Jaca — Próximas actividades",
  },
  {
    slug: "mercado-semanal-ambulante", title: "Mercado semanal ambulante",
    description: "Todos los viernes no festivos por la mañana, entre la calle Pico Aneto y el paseo Manuel Giménez Abad.", category: "otros",
    start: "2026-10-02T07:00:00Z", timeText: "Viernes por la mañana (no festivos)", location: "C/ Pico Aneto – paseo Manuel Giménez Abad", organizer: "Ayuntamiento de Jaca",
    recurrence: "WEEKLY", sourceUrl: "https://www.jaca.es/ayuntamiento/policia-local/mercado-semanal-ambulante.html", sourceName: "jaca.es — Policía Local",
  },
];

export type AlertSeed = {
  title: string; summary: string; body?: string; priority: "NORMAL" | "IMPORTANT" | "URGENT"; kind: "GENERAL" | "CORTE" | "OBRA" | "MOVILIDAD" | "BANDO" | "PLAZO" | "CIERRE" | "SERVICIO";
  startsAt: string; endsAt?: string; url?: string; area?: string; zone?: string; affectation?: string; alternative?: string; mapUrl?: string; isDemo?: boolean; sourceUrl?: string;
};
export const ALERTS: AlertSeed[] = [
  {
    title: "Último día: subvenciones para actividades culturales 2026",
    summary: "El plazo para que entidades y asociaciones sin ánimo de lucro soliciten las subvenciones culturales de 2026 finaliza el 1 de octubre.",
    priority: "IMPORTANT", kind: "PLAZO", startsAt: "2026-09-28T00:00:00Z", endsAt: "2026-10-01T21:59:00Z",
    url: "/convocatorias/subvenciones-actividades-culturales-2026", area: "cultura", sourceUrl: S + "convocatoria-publica-de-subvenciones-entidades-y-asociaciones-sin-animo--0",
  },
  {
    title: "Nuevos horarios de fitness y del Pabellón de Hielo desde el 1 de octubre",
    summary: "El Servicio Municipal de Deportes ha publicado los horarios de actividades de fitness y de las sesiones públicas de patinaje para octubre.",
    priority: "NORMAL", kind: "SERVICIO", startsAt: "2026-09-28T00:00:00Z", endsAt: "2026-10-15T21:59:00Z",
    url: "/actualidad/noticias/horarios-pabellon-de-hielo-octubre-2026", area: "deportes", sourceUrl: "https://www.deportesjaca.es/horarios-de-las-actividades-de-fitness-a-partir-del-1-de-octubre/",
  },
  {
    title: "Ayudas por partos o adopciones múltiples: plazo abierto hasta el 30 de noviembre",
    summary: "Las familias con hijos o hijas de un mismo parto o de adopción múltiple pueden solicitar la ayuda municipal 2025-2026.",
    priority: "NORMAL", kind: "PLAZO", startsAt: "2026-07-31T00:00:00Z", endsAt: "2026-11-30T22:59:00Z",
    url: "/convocatorias/ayudas-partos-adopciones-multiples-2025-2026", area: "bienestar-social", sourceUrl: S + "convocatoria-de-subvenciones-para-familias-con-hijosas-nacidosas-de-partos",
  },
  {
    title: "[DEMO] Corte de tráfico por obras de ejemplo",
    summary: "Aviso de demostración para mostrar cómo se publican cortes de tráfico con zona, afectación y alternativa. No corresponde a ninguna obra real.",
    priority: "IMPORTANT", kind: "MOVILIDAD", startsAt: "2026-09-29T00:00:00Z", endsAt: "2026-10-09T21:59:00Z",
    zone: "Calle de ejemplo (DEMO)", affectation: "Corte total al tráfico rodado en horario diurno (ejemplo)", alternative: "Desvío señalizado por calles adyacentes (ejemplo)", isDemo: true,
  },
];

export type FeaturedSeed = { title: string; description: string; url: string; image?: string; kind: "BANNER" | "HIGHLIGHT"; position: number; sourceUrl?: string };
export const FEATURED: FeaturedSeed[] = [
  { title: "Plenos en directo", description: "Sigue las sesiones plenarias en el canal municipal de YouTube.", url: YT, kind: "HIGHLIGHT", position: 1 },
  { title: "Movilidad urbana: PMUS y Ciudad 30", description: "Plan de Movilidad Urbana Sostenible y ordenanza de tráfico, movilidad y seguridad vial.", url: "/ciudad/movilidad", kind: "HIGHLIGHT", position: 2, sourceUrl: "https://www.jaca.es/institucional/destacados/movilidad-urbana-pmus-y-ordenanza.html" },
  { title: "Agenda Urbana de Jaca 2030", description: "Diagnóstico, plan de acción y Plan de Acción por el Clima y la Energía Sostenible.", url: "/ciudad/medio-ambiente", kind: "HIGHLIGHT", position: 3, sourceUrl: "https://www.jaca.es/agenda_urbana_de_jaca" },
];
