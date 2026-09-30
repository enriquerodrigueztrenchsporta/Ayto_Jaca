# Discovery — Web del Ayuntamiento de Jaca

> Análisis previo realizado el **30 de septiembre de 2026** sobre `https://www.jaca.es/` y los portales oficiales vinculados.
> Método: rastreo automatizado y respetuoso (≈300 páginas, profundidad 2, 4 peticiones concurrentes con pausa), lectura manual de las secciones clave y consulta del catálogo de la Sede Electrónica.
> Los datos brutos del rastreo se conservan en `data/source/jaca-es-crawl-index.json` (URL + título + estado HTTP) y `data/source/sede-tramites.json` (32 fichas de trámite de la Sede).

---

## 0. Resumen ejecutivo

- `jaca.es` es un **Drupal 6** (plantilla de ~2010, XHTML 1.0 Strict, jQuery, bxSlider, AddThis, Google Translate, Google Analytics sin consentimiento).
- La **portada responde con HTTP 404** aunque muestra contenido (error de configuración que perjudica SEO y monitorización).
- Varias páginas devuelven **503/504 de forma intermitente** (Policía Local, Transporte urbano, Zonas wifi); al reintentar responden 200.
- La información está repartida en **cinco menús paralelos** (Turismo, Cultura, Deporte, Ayuntamiento, Ciudadanos, La Ciudad) con **cuatro listados de "Noticias" y cuatro de "Agenda"** distintos.
- Las **agendas están vacías** (`/cultura/agenda.html`, `/turismo/agenda.html`, `/deporte/agenda.html` muestran solo cabecera; el calendario `/calendar/2026-09` no tiene eventos). Los eventos reales se publican en PDF en `visitjaca.es` y en `deportesjaca.es`.
- Los **trámites no existen como fichas**: hay un listado de impresos en `.doc`/`.pdf` y un enlace genérico a la Sede. La Sede Electrónica vigente (`jaca.sedipualba.es`) sí tiene 32 trámites con descripción, pero la web no enlaza a ninguno directamente.
- Conviven **dos dominios de Sede**: `jaca.sedipualba.es` (vigente) y `jaca.sedelectronica.es` (antiguo; la raíz no responde, pero `/transparency` sí y es el Portal de Transparencia enlazado).
- La información de contacto está dispersa; no hay directorio de áreas. El teléfono general (974 355 758) solo aparece en el pie.
- Hay contenido institucional valioso y actual (plenos mensuales, convocatorias de empleo 2026, subvenciones 2026, bandos, consultas públicas, corporación municipal), pero se presenta como listados de títulos en mayúsculas con enlaces "leer más".

---

## 3.1 Inventario de la web actual

Leyenda de frecuencia: **E** = estructural/permanente · **O** = actualización ocasional · **S** = semanal · **F** = frecuente · **X** = enlace a servicio externo.

### Ayuntamiento

| Área | Sección actual | URL actual | Tipo de contenido | Frecuencia | Debe migrarse | Nueva ubicación propuesta |
|---|---|---|---|---|---|---|
| Ayuntamiento | Saludo del Alcalde | `/ayuntamiento/saludo-del-alcalde.html` | Texto (comentado en menú; devuelve 404) | — | No (roto) | Sustituido por `/ayuntamiento/corporacion` (datos objetivos) |
| Ayuntamiento | Gobierno – Organización municipal | `/ayuntamiento/gobierno.html` | Corporación, Junta de Gobierno, Comisiones, representantes | O | Sí | `/ayuntamiento/corporacion` + `/ayuntamiento/organizacion` |
| Ayuntamiento | Noticias | `/ayuntamiento/noticias.html` (110 págs.) | Listado de noticias | F | Sí (recientes) | `/actualidad/noticias` |
| Ayuntamiento | Recursos Humanos | `/ayuntamiento/recursos-humanos.html` (20 págs.) | Convocatorias de empleo y procesos selectivos | S | Sí (vigentes 2026) | `/empleo-publico` |
| Ayuntamiento | Perfil de Contratante | `/perfil-de-contratante.html-0` | Enlaces a Plataforma de Contratación del Estado + DEUC | X | Sí (enlaces) | `/transparencia/contratacion` |
| Ayuntamiento | Normativa Municipal | `/ayuntamiento/normativa-municipal.html` (6 págs.) | Ordenanzas, ordenanzas fiscales, reglamentos (PDF) | O | Sí (índice + PDF oficiales) | `/transparencia/normativa` |
| Ayuntamiento | Sede electrónica | `https://jaca.sedipualba.es/` | Servicio externo | X | Sí (acceso destacado) | Botón fijo en cabecera + cada ficha de trámite |
| Ayuntamiento | Subvenciones | `/ayuntamiento/subvenciones.html` (40 págs.) | Convocatorias convocadas/concedidas | S | Sí (2026) | `/convocatorias` |
| Ayuntamiento | Oficina del Consumidor (OMIC) | `/ayuntamiento/oficina-consumidor.html` | Servicio, contacto, derechos | E | Sí | `/ayuntamiento/areas/consumo` |
| Ayuntamiento | Archivo Municipal | `/ayuntamiento/archivo-municipal.html` | Servicios, fondos, historia, Libro de la Cadena | E | Sí | `/ayuntamiento/areas/archivo-municipal` |
| Ayuntamiento | Impresos y Solicitudes | `/ayuntamiento/impresos-y-solicitudes.html` | 16 impresos (.doc/.pdf) | O | Sí (como documentos de cada trámite) | `/tramites` (cada impreso asociado a su ficha) |
| Ayuntamiento | Calendario del Contribuyente | `/ayuntamiento/calendario-del-contribuyente.html` | 12 subpáginas mensuales **vacías** | O | Pendiente (sin datos) | `/tramites/tributos` con aviso de pendiente de validación |
| Ayuntamiento | Urbanismo, Obras, Servicios y M. Ambiente | `/ayuntamiento/plan-general-de-ordenacion-urbana.html` (13 págs.) | PGOU 1996, huertos sociales, licencias | O | Sí | `/ayuntamiento/areas/urbanismo` + trámites |
| Ayuntamiento | Hacienda Pública (Tesorería) | `/ayuntamiento/tesoreria.html` | Domiciliación, plusvalía, ficha de terceros, factura electrónica | O | Sí | `/ayuntamiento/areas/hacienda` + trámites |
| Ayuntamiento | Protocolo acoso laboral | `/ayuntamiento/normativa-municipal/protocolo-...` | Documento | E | Sí | `/transparencia/normativa` |
| Ayuntamiento | Agenda 21 Local | `/ayuntamiento/agenda-21-local.html` + 8 subpáginas | Diagnóstico y planes (PDF) | E | Sí (índice) | `/ciudad/medio-ambiente` |
| Ayuntamiento | Disfrutamos de Jaca sin dejar rastro | `/institucional/destacados/disfrutamos-de-jaca-sin-dejar-rastro.html` | Campaña | O | Sí | `/ciudad/medio-ambiente` |
| Ayuntamiento | Policía Local | `/ayuntamiento/policia-local.html` + 10 categorías | Servicio, grúa, denuncias, mercado, zonas peatonales | E | Sí | `/ayuntamiento/areas/policia-local` |
| Ayuntamiento | Contadores de Agua | `/institucional/destacados/informacion-sobre-contadores.html` | Aviso informativo | O | Sí | `/ciudad/servicios-urbanos` |
| Ayuntamiento | Portal de la Transparencia | `https://jaca.sedelectronica.es/transparency` | Servicio externo | X | Sí (enlace) | `/transparencia` |
| Ayuntamiento | Escuela Infantil Municipal Cervatillos | `/ayuntamiento/escuela-infantil-municipal.html` | Servicio, horario, calendario, reglamento | O | Sí | `/ciudad/educacion` |
| Ayuntamiento | Plan de medidas antifraude | `/ayuntamiento/normativa-municipal/plan-de-medidas-antifraude.html` | Documento | E | Sí | `/transparencia/normativa` |
| Ayuntamiento | Plenos en directo | `https://www.youtube.com/@webtvjaca/streams` | Streaming | X | Sí | `/plenos` |
| Ayuntamiento | Trabaja con nosotros | `/trabaja-con-nosotros.html` | Formulario de empresas proveedoras | O | Sí (como enlace a Sede / pendiente) | `/desarrollo-economico` |

### Ciudadanos / Participación

| Área | Sección actual | URL actual | Tipo de contenido | Frecuencia | Debe migrarse | Nueva ubicación propuesta |
|---|---|---|---|---|---|---|
| Participación | Buzón de sugerencias | `/buzon-de-sugerencias.html`, `/ciudadanos.html` | Formulario + Reglamento de Participación | E | Sí (redirige al trámite oficial de Sede "Reclamaciones, quejas y sugerencias") | `/ayuntamiento/participacion` |
| Participación | Consejo ciudadano | `/consejo-ciudadano.html` | Texto + actas | O | Sí | `/ayuntamiento/participacion` |
| Participación | Consejo Escolar Municipal | `/consejo-escolar-municipal.html` | Texto | O | Sí | `/ayuntamiento/participacion` |
| Participación | Consejo de Salud | `/consejo-de-salud.html` | Texto | O | Sí | `/ayuntamiento/participacion` |
| Participación | Consejo Local del Deporte | `/consejo-local-del-deporte-y-la-actividad-fisica.html` | Texto | O | Sí | `/ayuntamiento/participacion` |
| Participación | Consejo Sectorial de Fiestas | `/consejo-sectorial-de-fiestas.html` | Texto | O | Sí | `/ayuntamiento/participacion` |
| Participación | Consejo Sectorial de Medio Ambiente | `/consejo-sectorial-de-medio-ambiente.html` | Texto | O | Sí | `/ayuntamiento/participacion` |
| Participación | Consulta pública ordenanzas | `/consulta-publica-modificacion-ordenanzas.html` | Consultas previas + PDF | O | Sí | `/ayuntamiento/participacion` + noticias |
| Participación | Consulta pública reglamentos | `/consulta-publica-modificacion-reglamentos.html` | Consultas previas + PDF | O | Sí | `/ayuntamiento/participacion` |
| Participación | Presupuestos participativos | `/presupuestos-participativos.html` | Edición 2025 (enlace a Sede) | O | Sí (marcado como edición 2025) | `/ayuntamiento/participacion` |
| Participación | Agenda Urbana de Jaca 2030 | `/agenda_urbana_de_jaca` | Documentos + contacto | O | Sí | `/ciudad/medio-ambiente` |
| Participación | Plaza Biscós | `/plaza-biscos.html` | Proyecto participativo | O | Sí (archivo) | `/ayuntamiento/participacion` |

### La Ciudad

| Área | Sección actual | URL actual | Tipo de contenido | Frecuencia | Debe migrarse | Nueva ubicación propuesta |
|---|---|---|---|---|---|---|
| Ciudad | Introducción | `/ciudad/introduccion.html` | **Vacía** | — | No | `/ciudad` (nuevo texto a partir de "Ubicación") |
| Ciudad | Instalaciones municipales | `/ciudad/instalaciones-municipales.html` | **Vacía** | — | No | `/ciudad/equipamientos` |
| Ciudad | Comercio y servicios | `http://www.zureleku.net/...` | Directorio externo | X | Revisar (tercero) | `/desarrollo-economico` (pendiente de validar) |
| Ciudad | Plazas y rincones | `/ciudad/plazas-y-rincones.html` | **Vacía** | — | No | `/turismo` |
| Ciudad | Peatonalización | `/ciudad/peatonalizacion.html` | Texto largo | O | Sí | `/ciudad/movilidad` |
| Ciudad | Asociaciones | `/ciudad/asociaciones.html` | Fichas de asociaciones | O | Sí (índice) | `/ciudad/asociaciones` |
| Ciudad | Zonas wifi | `/ciudad/zonas-wifi.html` | Texto | E | Sí | `/ciudad/movilidad` (servicios urbanos) |
| Ciudad | Transporte urbano | `/ciudad/transporte-urbano.html` | Horario + PDF de recorrido | O | Sí | `/ciudad/movilidad` |
| Ciudad | Recarga eléctrica | `/recarga-electrica-de-vehiculos.html` | Texto + PDF | E | Sí | `/ciudad/movilidad` |
| Ciudad | Movilidad Urbana (PMUS y Ordenanza) | `/institucional/destacados/movilidad-urbana-pmus-y-ordenanza.html` | Documentos | O | Sí | `/ciudad/movilidad` |
| Ciudad | Imágenes App | `/imagenesapp.html` | Galería de app | — | No (obsoleto) | — |
| Ciudad | Webcams | `http://camaras.jaca.es/` | Servicio externo | X | Sí (enlace) | `/turismo` |
| Ciudad | Espacio cardioprotegido | `view.genially.com/...` | Mapa interactivo externo | X | Sí (enlace) | `/ciudad/seguridad` |
| Ciudad | Plan Estratégico Personas Mayores | PDF | Documento | O | Sí | `/ciudad/servicios-sociales` |

### Cultura

| Área | Sección actual | URL actual | Tipo de contenido | Frecuencia | Debe migrarse | Nueva ubicación propuesta |
|---|---|---|---|---|---|---|
| Cultura | Agenda | `/cultura/agenda.html` | **Vacía** | S | Sí (agenda unificada) | `/agenda?categoria=cultura` |
| Cultura | Noticias | `/cultura/noticias.html` | Listado | F | Sí | `/actualidad/noticias?categoria=cultura` |
| Cultura | Fiestas y Tradiciones | `/cultura/fiestas-y-tradiciones.html` | Primer Viernes de Mayo, Santa Orosia, Semana Santa | E | Sí | `/cultura/fiestas-y-tradiciones` |
| Cultura | Camino de Santiago | `/cultura/santiago.html` | Texto + Albergue | E | Sí | `/cultura/camino-de-santiago` |
| Cultura | Asociaciones culturales | `/cultura/asociaciones-culturales.html` | Listado | O | Sí | `/ciudad/asociaciones` |
| Cultura | Palacio de Congresos | `http://www.congresosjaca.es/` | Web propia | X | Sí (enlace) | `/cultura` + `/turismo/congresos` |
| Cultura | Festivales | `/cultura/festivales.html` | Folklórico de los Pirineos, NÚCLEO | O | Sí | `/cultura` |
| Cultura | Casino de Jaca | `/cultura/casino-de-jaca.html` | Texto | E | Sí | `/cultura` (equipamientos) |
| Cultura | Casa de la Cultura | `/cultura/casa-de-la-cultura.html` | **Casi vacía** | — | Revisar | `/cultura` |
| Cultura | Biblioteca Municipal | `http://www.bibliotecaspublicas.es/jaca/` | Servicio externo (Ministerio) | X | Sí (enlace) | `/cultura` |
| Cultura | Escuela Municipal de Música | `/cultura/escuela-de-musica.html` + 20 subpáginas | Oferta, matrícula, tasas, horarios, contacto | O | Sí (resumen + enlaces) | `/cultura/escuela-de-musica` |
| Cultura | Educación | `/cultura/educacion.html` | Centros educativos | E | Sí | `/ciudad/educacion` |
| Cultura | Hermanamientos | `/cultura/hermanamientos.html` | Oloron, etc. | E | Sí | `/cultura` |
| Cultura | Juventud | `/cultura/juventud.html` | Actividades verano 2025, PLIA 2025-2029 | O | Sí | `/ciudad/juventud` |
| Cultura | Historia de Jaca | `/cultura/historia-de-jaca.html` | Texto | E | Sí | `/ciudad/historia` |
| Cultura | Centro Cultural La Paz | `/cultura/centro-cultural-la-paz.html` | **Vacía** | — | Revisar | `/cultura` |
| Cultura | Real Academia de San Luis | `https://www.rasanluis.net/` | Externo | X | Sí (enlace) | `/cultura` |

### Deporte

| Área | Sección actual | URL actual | Tipo de contenido | Frecuencia | Debe migrarse | Nueva ubicación propuesta |
|---|---|---|---|---|---|---|
| Deporte | Agenda | `/deporte/agenda.html` → `deportesjaca.es` | Vacía / externa | S | Sí | `/agenda?categoria=deporte` |
| Deporte | Noticias | `/deporte/noticias.html` | Listado | F | Sí | `/actualidad/noticias?categoria=deporte` |
| Deporte | Servicio Municipal de Deportes | `http://www.deportesjaca.es/` | Web propia | X | Sí (enlace) | `/deportes` |
| Deporte | Clubes deportivos | `/deporte/clubes.html` | Fichas | O | Sí (índice) | `/deportes` |
| Deporte | Pabellón de Hielo | `http://www.pabellondehielojaca.com/` | Web propia | X | Sí | `/deportes` |
| Deporte | Centro de Piscinas & Spa & Fitness | `deportesjaca.es/...` | Externo | X | Sí | `/deportes` |
| Deporte | Instalaciones deportivas | `/deporte/instalaciones.html` | 5 fichas | E | Sí | `/deportes/instalaciones` |
| Deporte | Escuela de Verano | `http://www.escueladeveranojaca.com` | Externo | X | Sí | `/deportes` |
| Deporte | Cursos y actividades | `deportesjaca.es/...` | Externo | X | Sí | `/deportes` |

### Turismo

| Área | Sección actual | URL actual | Tipo de contenido | Frecuencia | Debe migrarse | Nueva ubicación propuesta |
|---|---|---|---|---|---|---|
| Turismo | Agenda | `/turismo/agenda.html` | **Vacía** | S | Sí | `/agenda?categoria=turismo` |
| Turismo | Noticias | `/turismo/noticias.html` | Listado | F | Sí | `/actualidad/noticias?categoria=turismo` |
| Turismo | Planifica tu viaje | `/turismo/viaje.html` + comer, comprar, dormir, teléfonos, transportes, ubicación | Guía | O | Sí | `/turismo/planifica-tu-viaje` |
| Turismo | Monumentos y museos | `/turismo/monumentosymuseos.html` | Fichas | E | Sí | `/turismo/monumentos-y-museos` |
| Turismo | Naturaleza | `/turismo/naturaleza.html` | Fichas | E | Sí | `/turismo/naturaleza` |
| Turismo | Deportes | `/turismo/deportes.html` | Candanchú/Astún, barrancos, caza… | E | Sí | `/turismo/deporte-y-aventura` |
| Turismo | Románico | `/turismo/romanico.html` | Fichas | E | Sí | `/turismo/romanico` |
| Turismo | Modernismo | `/turismo/modernismo.html` | Texto largo | E | Sí | `/turismo/modernismo` |
| Turismo | Espacio rural | `/turismo/espacio.html` (13 págs.) | 34 núcleos | E | Sí | `/ciudad/nucleos-rurales` (+ enlace desde turismo) |
| Turismo | Gastronomía | `/turismo/gastronomia.html` | Establecimientos privados | O | Parcial (sin fichas comerciales) | `/turismo/gastronomia` |
| Turismo | Ocio nocturno | `/turismo/ocio.html` | Fichas de bares privados | O | No (fichas comerciales desactualizadas) | `/turismo` (texto + enlace a visitjaca.es) |
| Turismo | Congresos | `/turismo/congresos.html` | Texto | E | Sí | `/turismo/congresos` |
| Turismo | Oficina de Turismo | `/oficina.html` | Horarios 2026, contacto, folletos | O | Sí | `/turismo/oficina-de-turismo` |
| Turismo | Portal turístico oficial | `https://visitjaca.es/` | Web propia del Ayto. | X | Sí (enlace principal) | `/turismo` |

### Actualidad y destacados

| Área | Sección actual | URL actual | Tipo de contenido | Frecuencia | Debe migrarse | Nueva ubicación propuesta |
|---|---|---|---|---|---|---|
| Actualidad | Carrusel portada | `/` | Noticias + destacados | F | Sí | Home: bloques Actualidad / Destacados |
| Actualidad | Plenos ordinarios | `/noticias/2026-09-21/pleno-ordinario-22-de-septiembre.html`, etc. | Convocatoria + orden del día (PDF) | S (mensual) | Sí | `/plenos` |
| Actualidad | Bandos | `/noticias/2026-07-30/bandos-baros-y-badaguas.html` | Bando + PDF | O | Sí | `/avisos` + noticias categoría "Bandos" |
| Actualidad | Destacados (Bikeland, Cuidamos Jaca, Sendero Miradores) | `/institucional/destacados/*` | Banners | O | Sí | `FeaturedContent` |
| Actualidad | RSS | `/rss.xml` | Feed | F | Sí | `/rss.xml` (futuro) |
| Actualidad | Newsletter | Formulario en pie | Suscripción | — | Interfaz (sin envío en MVP) | Home + pie |
| Redes | Twitter/X, YouTube | `twitter.com/aytojaca`, `youtube.com/user/webtvjaca` | Externo | X | Sí | Pie |

---

## 3.2 Problemas UX detectados

| Aspecto | Problema observado | Consecuencia |
|---|---|---|
| **Navegación** | Seis menús temáticos de igual peso, desplegados como listas de 10-20 enlaces. El mismo contenido aparece bajo "Ayuntamiento" y "Ciudadanos". | El vecino no sabe dónde empezar; lo urgente (trámites) compite con "Ocio nocturno". |
| **Jerarquía** | Portada sin H1 visible (`h1{display:none}`), titulares en mayúsculas, "leer más" genérico. | Mala lectura, mala accesibilidad y SEO pobre. |
| **Densidad** | Páginas de listado con 5 registros y selector "Registros: 5 10 20 40 60". Subvenciones: 40 páginas; RR. HH.: 20 páginas; noticias: 110 páginas. | Imposible saber qué está abierto hoy. |
| **Legibilidad** | Tipografía pequeña, textos largos sin estructura, fechas en formato "Lun, 21/09/2026". | Fatiga lectora, especialmente en mayores. |
| **Móvil** | Diseño de ancho fijo de ~2010, sin navegación móvil real; iconos de iPhone 4. | Experiencia deficiente en el canal mayoritario. |
| **Buscador** | Buscador genérico de Drupal, sin agrupar por tipo, sin sinónimos ("empadronarme" no encuentra "padrón"). | Los trámites no se encuentran por lenguaje natural. |
| **Descubrimiento de trámites** | No hay fichas de trámite; solo "Impresos y solicitudes" (16 .doc/.pdf) y un enlace a la Sede. La Sede tiene 32 trámites que la web no enlaza uno a uno. | El ciudadano descarga un .doc sin saber requisitos, plazos ni si puede hacerlo online. |
| **Agenda** | Las tres agendas y el calendario están **vacíos**; los eventos reales viven en PDF en `visitjaca.es` y posts en `deportesjaca.es`. | "¿Qué hay este fin de semana?" no tiene respuesta en la web municipal. |
| **Noticias** | Cuatro listados separados (Ayuntamiento, Cultura, Deporte, Turismo); plenos y bandos mezclados como noticias. | Duplicidad y difícil seguimiento de la actividad institucional. |
| **Accesibilidad** | Sin skip links, sin landmarks, contraste insuficiente en menús, imágenes sin `alt`, formularios con `*` sin explicación, `alert()` JS para validar email, H1 oculto. No se encontró declaración de accesibilidad en la web (sí en la Sede). | Incumplimiento probable del RD 1112/2018. |
| **Duplicidades** | Ermita de Sarsa bajo Románico y Monumentos; "Buzón de sugerencias" en dos URLs; dos dominios de Sede; `.html` y `.html-0` para la misma página. | Mantenimiento doble y contenido divergente. |
| **PDFs** | Convocatorias, bandos, órdenes del día, calendario escolar, horarios de bus… solo en PDF, con nombres técnicos (`resolucion_no_2831_de_01_09_2026_..._segra_1059638.pdf`). | Información no accesible ni indexable; el ciudadano no sabe qué abre. |
| **Enlaces externos** | Enlaces a `bit.ly` con `fbclid`, formularios de Google Forms, directorio comercial de terceros (`zureleku.net`), `http://` sin TLS. | Pérdida de confianza y riesgos de privacidad. |
| **Llamadas a la acción** | No hay CTAs claros ("Hacer este trámite online", "Ver plazo"). El acceso a la Sede es un enlace más en la lista. | Tareas frecuentes con demasiados pasos. |
| **Estado técnico** | Portada con HTTP 404; errores 503/504 intermitentes; Google Analytics sin consentimiento; Google Translate embebido. | Riesgo reputacional, legal (cookies) y de indexación. |
| **Contenido vacío/obsoleto** | "Introducción", "Plazas y rincones", "Instalaciones municipales", "Centro Cultural La Paz", "Calendario del contribuyente" vacíos; huertos sociales "2021"; albergue "cierra de dic. 2022 a feb. 2023". | Sensación de abandono. |

---

## 3.3 Arquitectura propuesta

Principio: **se conserva toda la información relevante, pero se organiza por tareas y públicos** y se enlaza a los sistemas oficiales (Sede, Transparencia, Contratación) en lugar de duplicarlos.

```
Inicio
├─ Trámites y servicios  ← prioridad máxima (buscador de trámites + Sede)
│  ├─ /tramites (buscador en lenguaje natural + categorías)
│  ├─ /tramites/[slug] (ficha: quién, requisitos, documentación, plazo, coste, cómo: online/presencial, Sede, área, contacto, documentos)
│  ├─ Categorías: Padrón y certificados · Registro e instancias · Urbanismo y obras · Actividades y comercio
│  │              · Tributos y pagos · Vía pública · Cementerio · Seguridad y tráfico · Ayudas y subvenciones
│  │              · Transparencia y derechos · Proveedores y facturas
│  ├─ /convocatorias (subvenciones: próxima / abierta / cerrada / concedida, filtrables)
│  └─ /empleo-publico (procesos selectivos con plazos)
├─ Actualidad
│  ├─ /actualidad/noticias (unificadas, filtro por categoría)
│  ├─ /avisos (avisos con prioridad y caducidad; cortes, obras, movilidad, bandos)
│  ├─ /agenda (agenda unificada; filtros cultura/deporte/turismo/juventud/participación/institucional; "este fin de semana")
│  └─ /plenos (convocatorias, orden del día, streaming, documentos)
├─ Ayuntamiento
│  ├─ /ayuntamiento/corporacion (Pleno: grupos y concejales, datos objetivos)
│  ├─ /ayuntamiento/organizacion (Junta de Gobierno, comisiones, representantes)
│  ├─ /ayuntamiento/areas y /ayuntamiento/areas/[slug] (área, contacto, trámites asociados, ubicación)
│  ├─ /contacto (directorio verificado + teléfonos de interés)
│  └─ /ayuntamiento/participacion (consejos, consultas públicas, presupuestos participativos, sugerencias)
├─ Transparencia
│  ├─ /transparencia (portal oficial + accesos)
│  ├─ /transparencia/normativa (ordenanzas, fiscales, reglamentos — documentos oficiales)
│  ├─ /transparencia/contratacion (Perfil de contratante en PLACSP)
│  └─ presupuestos, subvenciones, información pública → enlaces a Portal de Transparencia
├─ Ciudad y municipio
│  ├─ /ciudad (Jaca, ubicación, historia)
│  ├─ /ciudad/nucleos-rurales (34 núcleos)
│  ├─ /ciudad/movilidad (bus urbano, peatonalización, PMUS, recarga, wifi)
│  ├─ /ciudad/medio-ambiente (Agenda 21, Agenda Urbana 2030, PACES, campañas)
│  ├─ /ciudad/educacion (centros, Escuela Infantil Cervatillos)
│  ├─ /ciudad/juventud · /ciudad/servicios-sociales · /ciudad/seguridad · /ciudad/asociaciones
├─ Cultura (/cultura, escuela de música, fiestas y tradiciones, Camino de Santiago, equipamientos)
├─ Deportes (/deportes, instalaciones, Servicio Municipal de Deportes)
├─ Turismo (/turismo — personalidad propia dentro del sistema: planifica, monumentos, románico, modernismo, naturaleza, gastronomía, congresos, oficina de turismo; enlace a visitjaca.es)
└─ Desarrollo económico (/desarrollo-economico: empresas, empleo, emprendimiento, polígonos, factura electrónica, contratación)
```

**Qué se mantiene tal cual**: datos de contacto, corporación, convocatorias y sus PDF oficiales (enlazados en origen), trámites de la Sede, textos patrimoniales.
**Qué se reorganiza**: noticias y agendas se unifican; impresos pasan a colgar de su trámite; plenos y bandos salen de "noticias" a secciones propias; consejos y consultas se agrupan en Participación.
**Qué se retira**: páginas vacías, fichas comerciales de ocio nocturno sin mantenimiento, galería "Imágenes App", "Saludo del Alcalde" (404).

### Rutas de usuario validadas (casos del briefing)

| Caso | Ruta propuesta | Pasos |
|---|---|---|
| A. "Necesito empadronarme" | Buscador de la home → "empadronarme" → ficha *Alta en el padrón* → botón Sede | 2 |
| B. "¿Qué hay este fin de semana?" | Home → Agenda → filtro "Este fin de semana" | 2 |
| C. "¿Hay alguna subvención abierta?" | Home (accesos rápidos) → Convocatorias → filtro "Abierta" | 2 |
| D. "Último pleno" | Home → bloque Ayuntamiento → Plenos (el último arriba, con orden del día y streaming) | 2 |
| E. "Contactar con Urbanismo" | Buscador "urbanismo" o Ayuntamiento → Áreas → Urbanismo (contacto, trámites, ubicación) | 2 |
| F. "Soy turista" | Home → bloque "Explora Jaca" / menú Turismo → portada turística con Oficina, planifica, visitjaca.es | 1-2 |

---

## 3.4 Fuentes (consultadas el 30/09/2026)

**Prioridad 1 — Ayuntamiento de Jaca**
- https://www.jaca.es/ (portada y ≈285 páginas internas; índice completo en `data/source/jaca-es-crawl-index.json`)
- https://www.jaca.es/ayuntamiento/gobierno.html — Corporación, Junta de Gobierno, comisiones
- https://www.jaca.es/ayuntamiento/recursos-humanos.html — Procesos selectivos 2026
- https://www.jaca.es/ayuntamiento/subvenciones.html — Convocatorias 2026
- https://www.jaca.es/ayuntamiento/impresos-y-solicitudes.html — Impresos
- https://www.jaca.es/ayuntamiento/tesoreria.html — Tesorería
- https://www.jaca.es/perfil-de-contratante.html-0 — Perfil de contratante
- https://www.jaca.es/ayuntamiento/policia-local/policia-local-de-jaca.html — Policía Local
- https://www.jaca.es/ayuntamiento/oficina-consumidor.html — OMIC
- https://www.jaca.es/ayuntamiento/archivo-municipal/servicios.html — Archivo Municipal
- https://www.jaca.es/ayuntamiento/escuela-infantil-municipal.html y https://www.jaca.es/cultura/educacion/escuela-municipal-infantil.html
- https://www.jaca.es/cultura/escuela-de-musica/secretaria-y-contacto.html
- https://www.jaca.es/oficina.html — Oficina de Turismo (horarios 2026)
- https://www.jaca.es/turismo/viaje/telefonos.html — Teléfonos de interés
- https://www.jaca.es/turismo/viaje/ubicacion.html — Datos geográficos
- https://www.jaca.es/turismo/espacio.html — Núcleos rurales
- https://www.jaca.es/ciudad/transporte-urbano.html, /ciudad/zonas-wifi.html, /recarga-electrica-de-vehiculos.html
- https://www.jaca.es/rss.xml — Últimas publicaciones
- Noticias: plenos 2026 (20/01, 17/02, 17/03, 21/04, 19/05, 16/06, 21/07, 22/09), bandos Barós/Badaguás (30/07/2026), consulta pública vivienda (26/08/2026), comunicado oficial incendio (21/08/2026), adquisición edificio viviendas (06/07/2026), presupuesto 2026 (11/12/2025), ordenanzas fiscales 2026 (21/10/2025), FORTIUM (26/02/2026), Policía Local DPH (23/02/2026), etc.
- https://jaca.sedipualba.es/ y https://jaca.sedipualba.es/catalogoservicios.aspx — Sede Electrónica y catálogo (32 trámites)
- https://jaca.sedelectronica.es/transparency — Portal de Transparencia
- https://visitjaca.es/ — Portal turístico municipal; https://visitjaca.es/wp-content/uploads/2026/09/Proximas-actividades.pdf (agenda 24–30/09/2026)
- https://www.deportesjaca.es/ — Servicio Municipal de Deportes (publicaciones hasta 28/09/2026)

**Prioridad 2 — Otras administraciones / plataformas oficiales**
- https://contrataciondelestado.es/ — Perfiles de contratante del Pleno, Junta de Gobierno y Alcaldía
- https://www.bibliotecaspublicas.es/jaca/ — Biblioteca Pública Municipal
- Boletines citados por las propias convocatorias (BOPH, BOA, BOE), enlazados desde los PDF alojados en jaca.es

**Imágenes**: Wikimedia Commons (licencias verificadas vía API, ver `docs/assets-sources.md`).

### Datos pendientes de verificación (no se presentan como ciertos)
- Horario general de atención y registro del Ayuntamiento (no publicado en jaca.es).
- Teléfonos y correos de áreas sin dato publicado (Urbanismo teléfono, Hacienda, Servicios Sociales, Secretaría).
- Calendario del contribuyente 2026 (páginas vacías en origen).
- Redes sociales oficiales distintas de X/Twitter y YouTube (Facebook aparece oculto en el código).
- Datos jurídicos para aviso legal, privacidad y cookies (DPD, finalidades, plazos).
