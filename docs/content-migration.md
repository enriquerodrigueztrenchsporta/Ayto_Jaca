# Migración inicial de contenidos

Proceso realizado el **30 de septiembre de 2026**. No se ha construido un *scraper* permanente: se hizo un rastreo puntual para el inventario (`data/source/`) y el contenido se **curó manualmente** en archivos versionados (`data/seed/*.ts`) que el seed carga en la base de datos con su fuente (`sourceUrl`) y fecha de verificación (`lastVerifiedAt`).

## Qué se ha migrado

| Contenido | Cantidad | Origen | Tratamiento |
|---|---|---|---|
| Trámites | 38 | 32 de la Sede Electrónica + 6 de «Impresos y solicitudes» | Fichas en lenguaje claro con quién, documentación, requisitos, plazo, coste y cómo; enlace directo a la ficha oficial de la Sede (`idtramite`) |
| Noticias | 14 | jaca.es (2025-2026) y deportesjaca.es | Resumen propio fiel a la nota oficial + enlace a la fuente y documentos |
| Plenos | 10 | Noticias de convocatoria de jaca.es | Fecha, hora (cuando consta), lugar, streaming y orden del día (PDF oficial) |
| Subvenciones | 5 | jaca.es → Subvenciones | Estado, plazos, destinatarios, extractos BOPH, bases y anexos |
| Empleo público | 5 | jaca.es → Recursos humanos | Plazos, tipo de personal, BOPH/BOA/BOE, modelos de instancia |
| Agenda | 6 | PDF «Próximas actividades» de la Oficina de Turismo (visitjaca.es) y Policía Local | Eventos vigentes a 30/09/2026 |
| Avisos | 3 reales + 1 DEMO | Convocatorias y Servicio Municipal de Deportes | Plazos y cambios de servicio reales; el corte de tráfico es un **ejemplo etiquetado DEMO** |
| Páginas | 26 | Ciudad, Cultura, Deportes, Turismo, Participación, Desarrollo económico | Reescritas y estructuradas; textos de autor citados |
| Áreas y contactos | 18 | Páginas de servicios y «Teléfonos de interés» | Solo datos publicados; lo no publicado queda en `pendingFields` |
| Corporación | 17 miembros, Junta de Gobierno, 8 comisiones | jaca.es → Gobierno | Datos objetivos (`data/corporacion.ts`) |
| Documentos | 130+ | Normativa municipal completa (27 fichas), impresos, bases, planes | Enlazados en su ubicación oficial |
| Núcleos rurales | 34 | Turismo → Espacio rural | Listado y texto de presentación |

## Qué NO se ha migrado (y por qué)

| Contenido | Motivo |
|---|---|
| Archivo histórico de noticias (≈110 páginas, desde años anteriores) | Volumen y vigencia. Recomendación: migración automatizada posterior o mantener el archivo en la web actual con redirecciones |
| Subvenciones y procesos selectivos anteriores a 2026 | Contenido cerrado; se consultan en el Portal de Transparencia |
| Fichas de establecimientos privados (ocio nocturno, restaurantes, gastronomía) | Información comercial sin mantenimiento; se remite a visitjaca.es |
| Páginas vacías («Introducción», «Plazas y rincones», «Instalaciones municipales», «Centro Cultural La Paz», «Calendario del contribuyente») | Sin contenido en origen |
| «Saludo del Alcalde» | Devuelve 404 en origen; se sustituye por información objetiva de la Corporación |
| «Imágenes App», galerías | Obsoletas |
| Formularios de contacto propios (buzón, «trabaja con nosotros») | Recogían datos personales sin garantías claras; se redirige al trámite oficial de la Sede (quejas y sugerencias) o queda pendiente de validar |
| Fichas individuales de clubes, asociaciones y colegios | Se resumen; directorio completo pendiente de validación |
| Imágenes de jaca.es | Sin licencia de reutilización verificada (ver `assets-sources.md`) |

## Qué requiere revisión manual del Ayuntamiento

- Horario general de atención y de **registro** presencial (aparece como *[PENDIENTE DE VALIDACIÓN POR EL AYUNTAMIENTO]*).
- Teléfonos y correos de áreas sin dato público: Urbanismo (teléfono), Hacienda, Cultura, Bienestar Social, Recursos Humanos, Fomento Económico, Juventud (correo).
- **Coste/tasa** de cada trámite (solo se indican los publicados; el resto remite a las ordenanzas fiscales).
- Asignación de trámites a áreas (se ha usado «Atención ciudadana» cuando la fuente no lo indica).
- Calendario del contribuyente 2026.
- Periodo de apertura actual del Albergue de Peregrinos (la web oficial muestra un cierre de 2022-2023).
- Textos legales (aviso legal, privacidad, cookies, accesibilidad): son **plantillas** con marcadores.
- Relación completa de hermanamientos, clubes y asociaciones.
- Escudo oficial en formato vectorial (hueco reservado en la cabecera).

## Enlaces que siguen apuntando a sistemas oficiales

| Sistema | URL |
|---|---|
| Sede Electrónica (trámites, tablón, carpeta ciudadana) | `https://jaca.sedipualba.es/` |
| Portal de Transparencia | `https://jaca.sedelectronica.es/transparency` |
| Perfiles de contratante (Pleno, Junta de Gobierno, Alcaldía) | `https://contrataciondelestado.es/…` |
| Plenos en directo | `https://www.youtube.com/@webtvjaca/streams` |
| Turismo | `https://visitjaca.es/` |
| Servicio Municipal de Deportes | `https://www.deportesjaca.es/` |
| Palacio de Congresos · Biblioteca · Pabellón de Hielo · Webcams | sus webs propias |

## PDFs que permanecen alojados en la web oficial

Todos los documentos del seed (bases, extractos, anexos, órdenes del día, bandos, normativa, impresos, planes) **se enlazan en `https://www.jaca.es/sites/default/files/…`**, sin copiarlos. Ventajas: la fuente sigue siendo la oficial. Riesgo: si se desmantela la web actual, esos enlaces se romperían.

**Plan recomendado antes de retirar jaca.es:**
1. Descargar los PDF vigentes (listado en la tabla `Document`), subirlos desde **Medios** y actualizar las URLs.
2. Configurar redirecciones de las URLs antiguas más visitadas (ya incluidas en `next.config.ts` para noticias, subvenciones, RR. HH., impresos, normativa, gobierno, perfil del contratante, turismo, cultura y deporte).

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Datos que cambian (plazos, horarios, corporación) | `lastVerifiedAt` + aviso a los 90 días en el panel + checklist semanal |
| Enlaces rotos a PDFs externos | Punto de checklist «Verificar enlaces rotos relevantes»; plan de migración de PDFs |
| Cambio de proveedor de la Sede (ya ocurrió: sedelectronica.es → sedipualba.es) | Todos los enlaces a la Sede se generan desde `lib/site.ts` y los campos `sedeUrl` editables |
| Confusión con la web oficial durante la demo | `NEXT_PUBLIC_DEMO_MODE=true`: franja visible y `robots.txt` bloquea la indexación |
| Contenido ficticio mezclado con real | Solo 1 aviso ficticio, marcado `isDemo` y con etiqueta DEMO visible |
