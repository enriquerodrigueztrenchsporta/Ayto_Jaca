/**
 * Páginas informativas. Contenido resumido y reorganizado a partir de las páginas oficiales de jaca.es
 * (URL en `sourceUrl`). Los PDF oficiales se enlazan en su ubicación original (no se re-alojan).
 */
const F = "https://www.jaca.es/sites/default/files/";
const J = "https://www.jaca.es/";

export type PageSeed = {
  path: string;
  section: string;
  title: string;
  summary: string;
  body: string;
  image?: string;
  area?: string;
  sortOrder?: number;
  sourceUrl: string;
  documents?: Array<{ title: string; url: string }>;
};

export const RURAL_VILLAGES = [
  "Abay", "Abena", "Ara", "Araguás del Solano", "Ascara", "Asieso", "Atarés", "Badaguás", "Banaguás", "Baraguás", "Barós", "Bernués",
  "Bescós de la Garcipollera", "Binué", "Botaya", "Caniás", "Espuéndolas", "Fraginal", "Gracionépel", "Guasa", "Guasillo", "Ipas",
  "Jarlata", "Lastiesas Altas", "Lastiesas Bajas", "Lerés", "Martillué", "Navasa", "Navasilla", "Novés", "Orante", "Osia", "Ulle", "Villanovilla",
];

export const PAGES: PageSeed[] = [
  // ─── Ciudad ────────────────────────────────────────────────
  {
    path: "ciudad/nucleos-rurales", section: "ciudad", title: "Núcleos rurales", sortOrder: 1, image: "badaguas",
    summary: "Jaca es también treinta y cuatro pequeñas localidades del Campo de Jaca, la Val Ancha, la Val Estrecha, la Val de Abena y el entorno de Oroel y San Juan de la Peña.",
    body:
      "El término municipal de Jaca, de **392 km²**, integra **34 núcleos rurales** que se fueron incorporando al municipio a lo largo del tiempo. Asentados entre campos de cereal o en el terreno montuoso de la Peña Oroel y la sierra de San Juan de la Peña, han vivido tradicionalmente de la agricultura y la ganadería y conservan iglesias románicas, ermitas, arquitectura tradicional de piedra, chamineras troncocónicas y molinos harineros.\n\n" +
      "## Los 34 núcleos\n\n" + RURAL_VILLAGES.map((v) => `- ${v}`).join("\n") +
      "\n\n## Servicios y trámites para los núcleos\n\nLos trámites municipales pueden hacerse **desde cualquier núcleo a través de la Sede Electrónica**, sin desplazarse a la ciudad. Los bandos y avisos que afectan a un núcleo concreto (por ejemplo, los bandos de uso del agua de Barós y Badaguás) se publican en [Avisos](/avisos).\n\n> Pendiente de validación por el Ayuntamiento: alcaldías pedáneas o representantes de cada núcleo, horarios de servicios itinerantes y rutas de recogida.",
    sourceUrl: J + "turismo/espacio/los-pueblos-de-jaca.html",
  },
  {
    path: "ciudad/movilidad", section: "ciudad", title: "Movilidad", sortOrder: 2,
    summary: "Autobús urbano, Plan de Movilidad Urbana Sostenible, Ciudad 30, zonas peatonales, recarga eléctrica y wifi público.",
    body:
      "## Autobús urbano\n\nEl primer servicio sale de la **Estación de Autobuses a las 7:45 h** y el último finaliza en la **Plaza Cortes de Aragón a las 21:43 h**. El servicio **no funciona entre las 15:45 y las 16:45 h**. Consulte el recorrido y las paradas en los documentos adjuntos.\n\n" +
      "## Plan de Movilidad Urbana Sostenible (PMUS) y Ciudad 30\n\nCon la aprobación definitiva de la ordenanza de tráfico, movilidad y seguridad vial se completó la renovación de la normativa de movilidad urbana de Jaca. El folleto «Ciudad 30» resume las normas principales.\n\n" +
      "## Zonas peatonales y estacionamiento\n\nEl casco histórico cuenta con un plan de peatonalización. Para cuestiones de estacionamiento, grúa o denuncias de tráfico, contacte con la [Policía Local](/ayuntamiento/areas/policia-local).\n\n" +
      "## Recarga de vehículos eléctricos\n\nEstación de recarga **gratuita** en la **Plaza Cortes de Aragón** (Ingerev City Duo), con capacidad para dos vehículos simultáneos y conectores Schuko y Mennekes (Tipo 2).\n\n" +
      "## Wifi público\n\nWifi abierto en el **Paseo de la Constitución**, a la altura del kiosco de la música. Hay redes disponibles bajo petición en la mayoría de edificios municipales: Biblioteca, Juventud, Palacio de Congresos, Edificio de la Música, Pista de Hielo y Oficina de Turismo.",
    documents: [
      { title: "Plano del recorrido completo del autobús urbano", url: F + "bus102024.pdf" },
      { title: "Paradas del autobús urbano", url: F + "busparadas_2024.pdf" },
      { title: "Ordenanza municipal reguladora del tráfico, movilidad y seguridad vial", url: F + "texto_aprobacion_definitiva_dictaminado_cima_20180314.pdf" },
      { title: "Anexo II — Planos de la ordenanza de movilidad", url: F + "om_movilidad_anexoii_planos.pdf" },
      { title: "Folleto normativa Ciudad 30", url: F + "folleto_movilidad_ver.pdf" },
      { title: "Instrucciones de uso de la estación de recarga", url: F + "instruccionesuso_erv_info.pdf" },
    ],
    sourceUrl: J + "ciudad/transporte-urbano.html",
  },
  {
    path: "ciudad/medio-ambiente", section: "ciudad", title: "Medio ambiente y sostenibilidad", sortOrder: 3, image: "vista-oroel", area: "urbanismo",
    summary: "Agenda Urbana de Jaca 2030, Plan de Acción por el Clima y la Energía Sostenible, Agenda 21 Local y campañas de sensibilización.",
    body:
      "## Agenda Urbana de Jaca 2030 y PACES\n\nEl Ayuntamiento ha elaborado la **Agenda Urbana de Jaca 2030** y un **Plan de Acción para el Clima y la Energía Sostenible**, con un diagnóstico de sostenibilidad, la evaluación de riesgos y vulnerabilidad frente al cambio climático y medidas concretas con indicadores de seguimiento.\n\nPuede enviar opiniones o consultas a [obrasurbanismo@aytojaca.es](mailto:obrasurbanismo@aytojaca.es).\n\n" +
      "## Agenda 21 Local\n\nJaca firmó en 2002 la Carta de Aalborg de ciudades europeas hacia la sostenibilidad y en 2006 el «Compromiso por la sostenibilidad de Jaca». La Agenda 21 incluye diagnóstico, plan de acción local, plan de participación ciudadana y plan de seguimiento.\n\n" +
      "## Disfrutamos de Jaca sin dejar rastro\n\nCampaña municipal para disfrutar del entorno natural de forma responsable.\n\n" +
      "## Agua y contadores\n\nInformación sobre dimensionamiento e instalación de contadores y el Reglamento del servicio de abastecimiento en los documentos adjuntos.",
    documents: [
      { title: "Agenda Urbana de Jaca 2030", url: F + "agenda_urbana_de_jaca_rev20abril2022.pdf" },
      { title: "Plan de Acción para el Clima y la Energía Sostenible", url: F + "plan_de_accion_para_el_clima_y_la_energia_sostenible_rev20abril2022.pdf" },
      { title: "Dimensionamiento de contadores (27/11/2014)", url: F + "dimensionamiento_de_contadores_27_11_2014.pdf" },
      { title: "Declaración responsable de instalación de contadores", url: F + "declaracion_responsable_instalacion_contadores.doc" },
      { title: "Reglamento de abastecimiento de agua de Jaca", url: F + "reglamento_abastecimiento_agua_jaca_modificado.doc" },
    ],
    sourceUrl: J + "agenda_urbana_de_jaca",
  },
  {
    path: "ciudad/educacion", section: "ciudad", title: "Educación", sortOrder: 4, area: "escuela-infantil",
    summary: "Escuela Infantil Municipal Cervatillos (0-3 años), Escuela Municipal de Música y centros educativos del municipio.",
    body:
      "## Escuela Infantil Municipal Cervatillos\n\nEscuela municipal para la etapa de **0 a 3 años**, abierta desde 2003. Horario del centro: **de 7:45 a 16:00 h**.\n\n- C/ Burnao, s/n · 22700 Jaca\n- Teléfono: 974 356 001\n- Correo: [escuelainfantil@aytojaca.es](mailto:escuelainfantil@aytojaca.es)\n\nSus señas de identidad son la coeducación, el respeto a la diversidad, la colaboración familia-escuela, los hábitos saludables y el juego como método de aprendizaje.\n\n" +
      "## Centros educativos\n\n- **CEIP Monte Oroel** — Avda. Juan XXIII, 48 · Tel. 974 356 459\n- **CEIP San Juan de la Peña** — C/ San José de Calasanz, 3 · Tel. 974 356 370\n- **CEPA Jacetania** — C/ Monte Perdido, 2\n\n" +
      "## Escuela Municipal de Música\n\nConsulte la [Escuela Municipal de Música](/cultura/escuela-de-musica).",
    documents: [
      { title: "Calendario escolar 2026 — Escuela Infantil", url: F + "calendario_2026.pdf" },
      { title: "Reglamento de la Escuela Infantil Cervatillos", url: F + "reglamento_escuela_infantil_cervatillos_curso_2024_2025.pdf" },
      { title: "Ordenanza reguladora del precio público de la Escuela Infantil (2026)", url: F + "ordenanza_2026_escuela_infantil_municipal_cervatillos.pdf" },
    ],
    sourceUrl: J + "ayuntamiento/escuela-infantil-municipal.html",
  },
  {
    path: "ciudad/juventud", section: "ciudad", title: "Juventud e infancia", sortOrder: 5, area: "juventud",
    summary: "Espacio Joven / Centro de Ocio Juvenil, actividades para jóvenes y Plan Local de Infancia y Adolescencia 2025-2029.",
    body:
      "El Área de Juventud gestiona el **Espacio Joven / Centro de Ocio Juvenil**, recurso municipal para la participación, la creatividad y el desarrollo personal de la infancia y la juventud. En 2026 se sometió a consulta previa su nuevo **Reglamento de funcionamiento interno**.\n\nOficina de Información Juvenil: **974 356 785**.\n\n" +
      "## Plan Local de Infancia y Adolescencia 2025-2029\n\nEl PLIA ordena las políticas municipales dirigidas a niños, niñas y adolescentes.\n\n" +
      "> Las actividades de verano 2025 (informática e IA, video mapping, teatro, monólogos, BTT, futbolín) ya han finalizado. Las nuevas actividades se publicarán en la [Agenda](/agenda?categoria=juventud).",
    documents: [
      { title: "Plan Local de Infancia y Adolescencia de Jaca 2025-2029", url: F + "20250609_otros_plia_jaca_2025_2029_definitivo_1.pdf" },
      { title: "Reglamento de funcionamiento del Espacio Joven — Centro de Ocio Juvenil", url: F + "reglamento_de_funcionamiento_del_espacio_joven-centro_de_ocio_juvenil_de_jaca.pdf" },
    ],
    sourceUrl: J + "cultura/juventud.html",
  },
  {
    path: "ciudad/servicios-sociales", section: "ciudad", title: "Bienestar social y mayores", sortOrder: 6, area: "bienestar-social",
    summary: "Ayudas y subvenciones sociales, Plan Estratégico de Personas Mayores y Oficina Municipal de Información al Consumidor.",
    body:
      "## Ayudas y subvenciones sociales\n\nConsulte las convocatorias abiertas de acción social, ayudas por partos o adopciones múltiples y ayudas a personas celíacas en [Convocatorias](/convocatorias).\n\n" +
      "## Personas mayores\n\nEl Ayuntamiento cuenta con un **Plan Estratégico de Personas Mayores** (documento adjunto). En los parques de la ciudad hay zonas con aparatos de movilidad para personas mayores.\n\n" +
      "## Consumo\n\nLa [OMIC](/ayuntamiento/areas/consumo) ofrece información y mediación gratuita en conflictos de consumo.\n\n> Pendiente de validación: datos de contacto del Área de Bienestar Social y del Centro Comarcal de Servicios Sociales.",
    documents: [{ title: "Plan Estratégico de Personas Mayores de Jaca", url: F + "plan_estrategico_personas_mayores_jaca2.pdf" }],
    sourceUrl: J,
  },
  {
    path: "ciudad/historia", section: "ciudad", title: "Historia de Jaca", sortOrder: 7, image: "crismon",
    summary: "Primera capital del Reino de Aragón, primera ciudad del Camino de Santiago en la península y «Muy Noble, Muy Leal y Muy Vencedora».",
    body:
      "Jaca es una ciudad pionera en muchos momentos de la historia. **Iacca**, habitada por los iacetanos, fue una de las primeras plazas conquistadas por Roma en Hispania. Fue la **primera capital del Reino de Aragón**, la primera ciudad que aclamó rey a Ramiro II el Monje y la primera que se sublevó a favor de la República en 1930.\n\n" +
      "A finales del siglo XI **Sancho Ramírez** la dotó de un **fuero** de convivencia y libertades y de una excepcional **catedral románica**, y la convirtió en eje del Camino de Santiago. En el siglo XVIII la monarquía le concedió los títulos de **Muy Noble, Muy Leal y Muy Vencedora Ciudad de Jaca**.\n\n" +
      "Ha sido evocada por Alfonso X el Sabio, Nebrija, Cervantes, Ramón y Cajal o Unamuno, que elogió la Peña Oroel.\n\n*Texto basado en el de Domingo J. Buesa Conde publicado en jaca.es.*\n\n" +
      "## Situación\n\nJaca se halla en la Depresión media altoaragonesa, a **820 m de altitud**, junto al río Aragón, a 72 km de Huesca y 31 km de la frontera francesa, entre el macizo de Collarada al norte y Oroel y San Juan de la Peña al sur.",
    sourceUrl: J + "cultura/historia-de-jaca.html",
  },
  {
    path: "ciudad/asociaciones", section: "ciudad", title: "Asociaciones", sortOrder: 8,
    summary: "Tejido asociativo cultural, social y deportivo de Jaca y subvenciones municipales para asociaciones.",
    body:
      "Jaca cuenta con un amplio tejido asociativo. Algunas de las entidades con ficha en la web municipal: **Asociación Cultural El Camino del Santo Grial**, **Asociación Cultural Sancho Ramírez** y **Hermandad de San Juan de la Peña**, además de los [clubes deportivos](/deportes/instalaciones) y las cofradías de Semana Santa.\n\n" +
      "## Subvenciones para asociaciones\n\nEl Ayuntamiento convoca anualmente subvenciones para actividades culturales, deportivas y de acción social: consulte [Convocatorias](/convocatorias).\n\n> Pendiente: registro municipal de asociaciones y directorio actualizado validado por el Ayuntamiento.",
    sourceUrl: J + "ciudad/asociaciones.html",
  },
  // ─── Cultura ───────────────────────────────────────────────
  {
    path: "cultura/fiestas-y-tradiciones", section: "cultura", title: "Fiestas y tradiciones", sortOrder: 1, image: "calle-mayor",
    summary: "El Primer Viernes de Mayo, las fiestas de Santa Orosia y San Pedro, la Semana Santa y las romerías del término municipal.",
    body:
      "## Primer Viernes de Mayo\n\nConmemora la legendaria batalla del año 758 en la que los jacetanos, dirigidos por el conde Aznar Galíndez y con la decisiva ayuda de las mujeres de Jaca, pusieron en fuga a un ejército musulmán. Comienza por la mañana en el **Llano de la Victoria** y continúa con el **desfile de la victoria**, en el que cerca de 2.000 jacetanos con trajes de época forman las escuadras de artesanos, labradores y la corte condal. Culmina frente a la Casa Consistorial con el himno de Jaca: *«Jaca libre sabe vivir a la sombra del monte Oroel»*.\n\n" +
      "## Santa Orosia y San Pedro (25 de junio)\n\nSanta Orosia es la patrona de Jaca y de sus montañas. Cada **25 de junio** se celebra la procesión con las urnas de la santa, acompañada de las cruces parroquiales de los pueblos del Campo de Jaca y de los danzantes, al ritmo del salterio y el chiflo. Las fiestas patronales de 2026 se celebraron del 23 al 29 de junio.\n\n" +
      "## Semana Santa\n\nDeclarada **Fiesta de Interés Turístico de Aragón en 2011**. Nueve cofradías y hermandades —la más antigua, de 1734— procesionan 14 pasos por el casco histórico.\n\n" +
      "## Jaca, Reino y Leyenda\n\nRecreación medieval declarada de Interés Turístico de Aragón, celebrada a finales de septiembre.\n\n" +
      "## Romerías\n\nEl término municipal conserva romerías como la del **Voto de San Indalecio** o la de la **Virgen de la Cueva**.",
    documents: [{ title: "Programa Fiestas de Jaca 2026", url: F + "programa_fiestas_jaca_2026_2.pdf" }],
    sourceUrl: J + "cultura/fiestas-y-tradiciones.html",
  },
  {
    path: "cultura/escuela-de-musica", section: "cultura", title: "Escuela Municipal de Música", sortOrder: 2, area: "escuela-de-musica",
    summary: "Música para bebés, iniciación musical y especialidades instrumentales. Matrícula, tasas, becas y horarios.",
    body:
      "La Escuela Municipal de Música ofrece desde **música para bebés (0-3 años) e iniciación musical** hasta un amplio abanico de especialidades, con actividad docente entre las 9:00 y las 22:30 h según materias.\n\n" +
      "## Secretaría y contacto\n\n- C/ Isaac Albéniz s/n (Complejo Cultural «La Paz»)\n- Teléfono: 974 355 528\n- Correo: [escuelamusica@aytojaca.es](mailto:escuelamusica@aytojaca.es)\n- Secretaría: lunes a viernes, de 9:00 a 14:00 h. Dirección: lunes, martes y viernes, de 10:00 a 13:00 h (con cita previa).\n\n" +
      "## Información académica\n\nLa oferta educativa, condiciones de admisión y matrícula, tasas y precios públicos, bonificaciones y becas, horarios y calendario escolar se publican en la web oficial de la Escuela. El centro sigue el calendario escolar del Departamento de Educación del Gobierno de Aragón.",
    documents: [
      { title: "Modelo de instancia general (Escuela de Música)", url: F + "10.e_modelo_instancia_general_0_0.pdf" },
      { title: "Modelo de instancia de préstamo de material", url: F + "10.f_modelo_instancia_prestamo_material_0.pdf" },
    ],
    sourceUrl: J + "cultura/escuela-de-musica.html",
  },
  {
    path: "cultura/camino-de-santiago", section: "cultura", title: "Camino de Santiago", sortOrder: 3, image: "catedral-portico",
    summary: "Jaca fue la primera ciudad del Camino en su vertiente aragonesa. Albergue municipal de peregrinos y patrimonio jacobeo.",
    body:
      "El Camino aragonés entra en España por el **Puerto de Somport** y, a la altura de Jaca, gira hacia el oeste por la Canal de Berdún. Para los peregrinos medievales Jaca era su primera jornada española, y así sigue siendo hoy.\n\nEl rey **Sancho Ramírez** concedió a Jaca, hacia 1077, un fuero que atrajo a mercaderes y artesanos; la ciudad acuñó moneda propia, el **sueldo jaqués**, y levantó la **catedral de San Pedro**, una de las obras clave del románico. Bajo el crismón del tímpano, una columna muestra una hendidura que, según la tradición, han cavado los besos y caricias de los peregrinos.\n\n" +
      "## Albergue de peregrinos\n\nAlbergue municipal del Camino de Santiago y Santo Grial, para peregrinos con credencial (se obtiene en la Iglesia de Santiago).\n\n- C/ Conde Aznar, 9 · Tel. 974 360 848 · [albergueperegrinos@aytojaca.es](mailto:albergueperegrinos@aytojaca.es)\n- Horario: de 15:00 a 22:00 h; salida antes de las 9:00 h.",
    area: "albergue-de-peregrinos",
    sourceUrl: J + "cultura/santiago/jaca-y-el-camino-de-santiago.html",
  },
  {
    path: "cultura/festivales-y-equipamientos", section: "cultura", title: "Festivales y equipamientos culturales", sortOrder: 4,
    summary: "Festival Folklórico de los Pirineos, festival NÚCLEO, Palacio de Congresos, Casino de Jaca, Biblioteca y Centro Cultural La Paz.",
    body:
      "## Festival Folklórico de los Pirineos\n\nDesde 1963 Jaca acoge este festival **bianual (años impares)**, que reúne grupos folklóricos de cerca de veinte países. Destaca por su ambiente callejero y sus pasacalles por el casco viejo.\n\n" +
      "## Festival NÚCLEO\n\nFestival multidisciplinar de cultura contemporánea.\n\n" +
      "## Equipamientos\n\n- **Palacio de Congresos**: auditorio de 536 plazas, sala con traducción simultánea, salas de reuniones y sala de exposiciones. Tel. 974 356 002.\n- **Casino de Jaca** (calle Echegaray): edificio neorrenacentista con interior ecléctico y modernista, adquirido por el Ayuntamiento en 2006; en estudio para su renovación.\n- **Biblioteca Municipal**: Tel. 974 355 576.\n- **Centro Cultural La Paz – Escuela de Música**: Tel. 974 355 528.\n- **Real Academia de Nobles y Bellas Artes de San Luis**.",
    sourceUrl: J + "cultura/festivales.html",
  },
  {
    path: "cultura/hermanamientos", section: "cultura", title: "Hermanamientos", sortOrder: 5,
    summary: "Relaciones de hermanamiento de Jaca con otras ciudades, en especial con Oloron-Sainte-Marie (Bearn, Francia).",
    body:
      "Jaca mantiene lazos de hermanamiento con otras ciudades europeas. El más estrecho es con **Oloron-Sainte-Marie**, en el Bearn francés, con quien históricamente se alternó la organización del Festival Folklórico de los Pirineos.\n\n> Pendiente de validación: relación completa y actualizada de ciudades hermanadas.",
    sourceUrl: J + "cultura/hermanamientos.html",
  },
  // ─── Deportes ──────────────────────────────────────────────
  {
    path: "deportes/instalaciones", section: "deportes", title: "Instalaciones deportivas", sortOrder: 1, area: "deportes",
    summary: "Pabellón de Hielo con dos pistas, Polideportivo Olimpia, polideportivos Barrio Norte y San Juan de la Peña, Gimnasio La Paz con rocódromo.",
    body:
      "## Pabellón de Hielo\n\nEl único de España con **dos pistas de hielo**: una olímpica (60 × 30 m) y otra lúdica (50 × 20 m). Aforo fijo de 1.900 plazas, ampliable a 3.579. Tel. 974 355 192 / 974 356 136.\n\n" +
      "## Polideportivo Municipal Olimpia\n\nInaugurado en 1987, con 19.500 m². Pista central de 20 × 40 m, cuatro salas (acondicionamiento físico, artes marciales y gimnasia, musculación, gimnasia de mantenimiento y danza), 7 vestuarios y graderío para 2.153 personas.\n\n" +
      "## Polideportivo Barrio Norte\n\nCalle Estación s/n, junto al CEIP Monte Oroel y el IES Pirineos. Pista de 20 × 40 m, 4 vestuarios y graderío. Uso preferente escolar; solicitudes en el Servicio Municipal de Deportes.\n\n" +
      "## Polideportivo Escolar San Juan de la Peña\n\nConstruido en 1995 dentro del Plan Escolar de Extensión de la Educación Física.\n\n" +
      "## Gimnasio La Paz\n\nEsquina Avda. Rapitán con C/ Isaac Albéniz. Sala polivalente de 14 × 24 m con rocódromo (uso con licencia federativa vigente; no uso libre para menores de 16 años).\n\n" +
      "## Centro de Piscinas, Spa y Fitness\n\nHorarios y abonos en la web del [Servicio Municipal de Deportes](https://www.deportesjaca.es/).",
    sourceUrl: J + "deporte/instalaciones.html",
  },
  {
    path: "deportes/clubes", section: "deportes", title: "Clubes deportivos", sortOrder: 2,
    summary: "Clubes deportivos de Jaca con ficha en la web municipal y subvenciones para actividades deportivas.",
    body:
      "Algunos de los clubes con ficha en la web municipal: **Club Arquers de Chaca**, **Club Atlético Oroel**, **Club Atletismo Jaca**, **Club Baloncesto Jaca** y **Club Ciclista Mayencos**, entre otros.\n\nLos clubes y entidades pueden optar a las [subvenciones para actividades deportivas](/convocatorias).\n\n> Pendiente de validación: directorio completo y actualizado de clubes.",
    sourceUrl: J + "deporte/clubes.html",
  },
  // ─── Turismo ───────────────────────────────────────────────
  {
    path: "turismo/oficina-de-turismo", section: "turismo", title: "Oficina de Turismo", sortOrder: 0, area: "oficina-de-turismo",
    summary: "Plaza de San Pedro, 11-13, a pocos metros de la Catedral. Atención en español, francés e inglés.",
    body:
      "La Oficina de Turismo de Jaca está incluida en el **SICTED** (Sistema Integral de Calidad Turística en Destinos). Ofrece información municipal, comarcal, provincial y de Aragón, organiza visitas y actividades en el **Fuerte de Rapitán** y en la ciudad y vende entradas en la propia oficina o en [visitjaca.es](https://visitjaca.es/).\n\n" +
      "- **Dirección:** Plaza de San Pedro, 11-13 · 22700 Jaca\n- **Teléfono:** 974 360 098\n- **Correo:** [oficinaturismo@aytojaca.es](mailto:oficinaturismo@aytojaca.es)\n\n" +
      "## Horarios\n\n| Periodo | Horario |\n|---|---|\n| Noviembre a marzo | Lunes a jueves: 9:00–13:30 y 15:00–18:00 h. Viernes y sábados: 9:00–13:30 y 16:00–19:00 h |\n| Abril a octubre | Lunes a sábado: 9:00–13:30 y 16:00–19:00 h. Domingos: 9:00–13:30 h |\n| Puentes y festivos | Consultar |\n\nCerrado: Primer Viernes de Mayo, 25 de junio, 25 de diciembre, 1 y 6 de enero.\n\n" +
      "**Puente del Pilar 2026:** día 11, 9:00–13:30 y 16:00–19:00 h; día 12, 9:00–13:30 h. **Todos los Santos:** 1 de noviembre, 9:00–13:30 h.",
    documents: [
      { title: "Plano de Jaca y comarca", url: "https://visitjaca.es/wp-content/uploads/2024/12/Plano-de-Jaca-y-Comarca-2024.pdf" },
      { title: "Folleto de Monumentos de Jaca", url: "https://visitjaca.es/wp-content/uploads/2024/05/MONUMENTOS-DE-JACA.pdf" },
      { title: "Folleto de Excursiones en coche", url: "https://visitjaca.es/wp-content/uploads/2024/05/EXCURSIONES-EN-COCHE.pdf" },
      { title: "Próximas actividades (agenda semanal)", url: "https://visitjaca.es/wp-content/uploads/2026/09/Proximas-actividades.pdf" },
    ],
    sourceUrl: J + "oficina.html",
  },
  {
    path: "turismo/planifica-tu-viaje", section: "turismo", title: "Planifica tu viaje", sortOrder: 1, image: "vista-oroel",
    summary: "Cómo llegar por carretera, tren y avión, dónde alojarse y comer, y teléfonos de interés.",
    body:
      "## Por carretera\n\nJaca se comunica con Huesca y Zaragoza por la N-330 / A-23 y con Pamplona por la N-240 / A-21. El **túnel de Somport** la conecta con Francia. Hay autobuses regulares diarios desde Zaragoza, Huesca y Pamplona, y un autobús comarcal por el Valle del Aragón hasta Canfranc, Candanchú y Astún.\n\n" +
      "## Por tren\n\nRenfe ofrece trenes regionales que conectan Jaca y el Valle del Aragón con Huesca, Zaragoza y Madrid (línea Canfranc–Huesca–Zaragoza).\n\n" +
      "## Por avión\n\nLos aeropuertos de Zaragoza, Pamplona y Pau están a menos de dos horas.\n\n" +
      "## Alojamiento, restaurantes y comercio\n\nConsulte la oferta actualizada en el portal turístico oficial [visitjaca.es](https://visitjaca.es/) o en la [Oficina de Turismo](/turismo/oficina-de-turismo).\n\n" +
      "## Teléfonos de interés\n\nConsulte el directorio de [contacto y teléfonos](/contacto).",
    sourceUrl: J + "turismo/viaje/transportes.html",
  },
  {
    path: "turismo/monumentos-y-museos", section: "turismo", title: "Monumentos y museos", sortOrder: 2, image: "ciudadela",
    summary: "Casco histórico declarado Bien de Interés Cultural: Catedral de San Pedro, Ciudadela, Puente de San Miguel, Monasterio de Santa Cruz y museos.",
    body:
      "Jaca es un **museo vivo** con más de dos mil años de historia. Su casco histórico está declarado **Bien de Interés Cultural**.\n\n" +
      "- **Catedral de San Pedro** — Monumento Nacional desde 1931 y BIC desde 1985, una de las obras fundamentales del románico. Junto a ella, el Museo Diocesano.\n- **Ciudadela (Castillo de San Pedro)** — Fortificación militar que alberga el Museo de Miniaturas Militares.\n- **Casa Consistorial** — Sede del Ayuntamiento en la calle Mayor.\n- **Monasterio de Santa Cruz (Las Benitas)** — Fundado en 1555.\n- **Iglesia de Santiago** e **Iglesia de Nuestra Señora del Carmen**.\n- **Ermita de la Victoria** y **Ermita de Sarsa** (trasladada en 1972).\n- **Puente de San Miguel**, sobre el río Aragón, en el Camino de Santiago.\n- **Fuerte de Rapitán** — Visitable en verano con visita guiada; en proceso de musealización (proyecto europeo FORTIUM).\n\n" +
      "Horarios y reservas de museos en [visitjaca.es](https://visitjaca.es/museos/).",
    sourceUrl: J + "turismo/monumentosymuseos.html",
  },
  {
    path: "turismo/romanico", section: "turismo", title: "Románico", sortOrder: 3, image: "crismon",
    summary: "La Catedral de Jaca, pieza clave del primer arte románico peninsular, y las iglesias y ermitas románicas del municipio.",
    body:
      "El románico, considerado el primer arte internacional a gran escala, tiene en Jaca uno de sus hitos: la **catedral de San Pedro**, iniciada en la segunda mitad del siglo XI y concluida en el segundo cuarto del XII, con su célebre **crismón trinitario**.\n\n" +
      "En el municipio y su entorno destacan la **Ermita de San Adrián de Sasabe** (de origen visigótico), la **Ermita de Sarsa**, la **Iglesia de San Adrián de Guasillo** y la **Iglesia de San Andrés de Abay** (siglos XII-XVIII), además de las pequeñas iglesias de Asieso, Banaguás o Lerés, de influencia lombarda y del Gállego.",
    sourceUrl: J + "turismo/romanico.html",
  },
  {
    path: "turismo/modernismo", section: "turismo", title: "Jaca modernista", sortOrder: 4, image: "calle-mayor",
    summary: "Tras el derribo de la muralla en 1915, el ensanche de Francisco Lamolla trajo fachadas modernistas, historicistas y eclécticas.",
    body:
      "El derribo de la muralla en **1915** abrió paso al ensanche proyectado por el arquitecto **Francisco Lamolla** en 1917. La burguesía local promovió edificios acordes con los nuevos tiempos.\n\n" +
      "## Qué ver\n\n- **Calle Mayor, 32**: fachada inspirada en la Alhambra, obra de Francisco Albiñana, domicilio del fotógrafo Francisco de las Heras.\n- **Casa Abad**, colindante: ventanas de formas orgánicas propias del Art Nouveau.\n- **Calle Mayor, 17 y 20**: detalles neogóticos y eclecticismo clasicista; farmacia con mobiliario de época.\n- **Casa del marqués de la Cadena**: motivos florales modernistas.\n- **Casino de Jaca** (calle Echegaray).\n- **Quiosco de música** del paseo de la Constitución (Ramón Salas, 1903).\n- **Residencia de la Universidad de Zaragoza**, sede de los cursos de verano desde 1927.\n- **Antiguo Matadero** (Lamolla, 1922-1925) y **Seminario Conciliar** (1924-1926).\n\n*Texto basado en el de la historiadora Pilar Poblador publicado en jaca.es.*",
    sourceUrl: J + "turismo/modernismo.html",
  },
  {
    path: "turismo/naturaleza", section: "turismo", title: "Naturaleza", sortOrder: 5, image: "hero-oroel",
    summary: "Más de 40 hectáreas de zonas verdes, el Paisaje Protegido de San Juan de la Peña y Monte Oroel, excursiones, fauna y flora pirenaica.",
    body:
      "Jaca ofrece más de **40 hectáreas de zonas verdes** conectadas: miradores, fuentes, zonas de juegos, aparatos de movilidad para mayores y áreas de petanca.\n\n" +
      "El entorno es uno de los territorios de la península con **mayor diversidad de fauna y flora**: rapaces, migraciones de aves, riqueza botánica que atrajo a exploradores desde antiguo y excursiones por las antiguas «Montañas de Jaca».\n\n" +
      "## Paisaje Protegido de San Juan de la Peña y Monte Oroel\n\nEspacio natural protegido que rodea la ciudad por el sur. Tras el incendio de agosto de 2026, consulte el estado de senderos y accesos antes de salir.\n\n" +
      "## Rutas\n\nSendero de los Miradores, Ruta de los Bancos Gigantes del monte Oroel y paseos en [visitjaca.es](https://visitjaca.es/paseos-y-senderos/).",
    sourceUrl: J + "turismo/naturaleza.html",
  },
  {
    path: "turismo/congresos", section: "turismo", title: "Congresos y eventos", sortOrder: 6,
    summary: "Palacio de Congresos con auditorio de 536 plazas, cursos de verano de la Universidad de Zaragoza desde 1927 y el Curso Internacional de Defensa.",
    body:
      "Jaca cuenta con infraestructura hotelera, comercial y gastronómica para acoger congresos y eventos. El **Palacio de Congresos** dispone de auditorio para 536 personas, sala con traducción simultánea, salas-despacho, sala VIP y sala de exposiciones.\n\nLa ciudad acoge desde 1927 los **cursos de verano de la Universidad de Zaragoza** y el **Curso Internacional de Defensa** (Academia General Militar y Universidad de Zaragoza).\n\nMás información: [congresosjaca.es](https://www.congresosjaca.es/) · Tel. 974 356 002.",
    area: "palacio-de-congresos",
    sourceUrl: J + "turismo/congresos.html",
  },
  {
    path: "turismo/gastronomia", section: "turismo", title: "Gastronomía", sortOrder: 7,
    summary: "Cocina tradicional aragonesa de temporada, cultura del tapeo y repostería jaquesa: jaqueses, condes, lazos, corazones y coronitas de Santa Orosia.",
    body:
      "La gastronomía de Jaca está ligada a la **cocina tradicional aragonesa** con productos de temporada, reinterpretada con tendencias actuales. Los restaurantes se concentran en el casco antiguo.\n\nLa **repostería jaquesa** es una tradición artesanal: jaqueses, condes, lazos, corazones, patatas de Jaca y coronitas de Santa Orosia. A lo largo del año se celebran jornadas gastronómicas de la huerta, la matacía, la trufa y otras.\n\nListado actualizado de establecimientos en [visitjaca.es](https://visitjaca.es/donde-comer/).",
    sourceUrl: J + "turismo/gastronomia.html",
  },
  // ─── Ayuntamiento ──────────────────────────────────────────
  {
    path: "ayuntamiento/participacion", section: "ayuntamiento", title: "Participación ciudadana", sortOrder: 1,
    summary: "Consejos sectoriales, consultas públicas previas, presupuestos participativos y buzón de quejas y sugerencias.",
    body:
      "## Consejos municipales\n\n- Consejo Ciudadano\n- Consejo Escolar Municipal\n- Consejo Municipal de Salud\n- Consejo Local del Deporte y la Actividad Física\n- Consejo Sectorial de Fiestas\n- Consejo Sectorial de Medio Ambiente\n\nEl Reglamento de Participación Ciudadana está vigente desde 1993; en 2013 el Pleno acordó por unanimidad iniciar su actualización junto con la del Reglamento Orgánico Municipal.\n\n" +
      "## Consultas públicas previas\n\nAntes de aprobar o modificar ordenanzas y reglamentos, el Ayuntamiento abre consultas públicas. Las propuestas pueden presentarse en el Registro o en la Sede Electrónica con el modelo adjunto. Consultas recientes: modificación de la ordenanza de viviendas municipales en alquiler (agosto 2026) y Reglamento del Espacio Joven (febrero 2026).\n\n" +
      "## Presupuestos participativos\n\nEn la edición 2025 cada persona podía presentar hasta dos propuestas de inversión (no gasto corriente, excluidos los núcleos rurales, que tienen otro cauce). Tras el informe técnico, el Consejo Ciudadano votó las propuestas, hasta un máximo de **150.000 €**. Las propuestas se presentaron a través de la Sede Electrónica.\n\n" +
      "## Quejas y sugerencias\n\nUtilice el trámite [Reclamaciones, quejas y sugerencias](/tramites/reclamaciones-quejas-y-sugerencias) de la Sede Electrónica.",
    documents: [
      { title: "Modelo de propuesta para consulta pública previa", url: F + "propuesta_consulta_publica_previa.pdf" },
      { title: "Ficha de propuesta para presupuestos participativos", url: F + "ficha_pto_participativo.doc" },
    ],
    sourceUrl: J + "ciudadanos.html",
  },
  // ─── Desarrollo económico ──────────────────────────────────
  {
    path: "desarrollo-economico/empresas-y-proveedores", section: "desarrollo-economico", title: "Empresas y proveedores", sortOrder: 1, area: "fomento-economico",
    summary: "Contratación pública, factura electrónica, ficha de terceros y registro de empresas interesadas en trabajar con el Ayuntamiento.",
    body:
      "## Contratar con el Ayuntamiento\n\nLas licitaciones desde el 9 de marzo de 2018 se publican en la **Plataforma de Contratación del Sector Público**: consulte el [Perfil del contratante](/transparencia/contratacion).\n\n" +
      "## Facturar al Ayuntamiento\n\nLas facturas de más de 600 € deben presentarse electrónicamente: consulte [Presentación de facturas electrónicas](/tramites/factura-electronica) y la [ficha de terceros](/tramites/ficha-de-terceros).\n\n" +
      "## Trabaja con nosotros\n\nEl Ayuntamiento mantiene un formulario para que las empresas locales interesadas (construcción, electricidad, fontanería, restauración, informática, mantenimiento, suministros…) se den a conocer.\n\n> Pendiente de validación: canal definitivo para este registro de empresas en la nueva web (se recomienda integrarlo en la Sede Electrónica).",
    sourceUrl: J + "trabaja-con-nosotros.html",
  },
  {
    path: "desarrollo-economico/emprendimiento-y-suelo-industrial", section: "desarrollo-economico", title: "Emprendimiento y suelo industrial", sortOrder: 2, area: "fomento-economico",
    summary: "Jornadas para pymes y personas emprendedoras, polígonos La Victoria, Campancián y Martillué, y bonificaciones fiscales al empleo.",
    body:
      "## Emprendimiento\n\nEl Área de Fomento Económico, Empleo y Emprendimiento organiza iniciativas como **«Jaca Re-Activa: Emprendiendo el cambio»**, jornada de inspiración empresarial celebrada en el Palacio de Congresos en el marco de la Semana de la PYME Aragonesa.\n\n" +
      "## Suelo industrial\n\nJaca dispone de unos **300.000 m²** de suelo industrial en tres áreas: **La Victoria, Campancián y Martillué**. En octubre de 2025 se aprobó la modificación del Plan Parcial de **Campancián I** para permitir la implantación de empresas de servicios, y el presupuesto 2026 incluye 170.000 € para la primera fase de urbanización de **Martillué**.\n\n" +
      "## Incentivos fiscales\n\nLas ordenanzas fiscales 2026 amplían la bonificación del **IAE** del 20 % a quienes pasen de 2 a 4 personas trabajadoras y flexibilizan la bonificación del **ICIO** por interés municipal (hasta el 50 %).",
    documents: [{ title: "Programa Jaca Re-Activa", url: F + "talento_jaca_reactiva_.pdf" }],
    sourceUrl: J + "re-activa",
  },
];
