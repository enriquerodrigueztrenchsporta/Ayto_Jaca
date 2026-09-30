# Sistema de diseño — "Piedra y Pino"

> Administración pública contemporánea + editorial europea + identidad pirenaica.

## 1. Concepto visual

Jaca es piedra arenisca de la Catedral y la Ciudadela, bosque de pino negro en la Peña Oroel, nieve en Collarada y cielo limpio del Pirineo. El sistema traslada eso a una interfaz **sobria, luminosa y muy legible**:

- **Fondo "nieve cálida"** en lugar de blanco clínico.
- **Verde bosque profundo** como color institucional (acción primaria, cabecera oscura, pie).
- **Tierra/teja** como acento cálido y escaso (subrayados editoriales, etiquetas de destacado).
- **Azul pizarra pirenaico** para información y enlaces secundarios.
- **Líneas finas de piedra** (1px) para estructurar en vez de sombras y cajas.
- **Titulares editoriales en serif** para dar carácter; toda la interfaz y el texto corrido en sans.
- **Un motivo gráfico propio**: la silueta de la Peña Oroel como línea de horizonte (SVG de una sola línea) usada con mucha moderación (hero, pie, estados vacíos). No se altera ni reinterpreta el escudo oficial.

## 2. Colores

Todos los pares texto/fondo usados en la interfaz se han validado con la fórmula WCAG 2.x (script en `tests/unit/contrast.test.ts`).

| Token | Hex | Uso | Contraste sobre `snow` |
|---|---|---|---|
| `snow` | `#FAF8F4` | Fondo general | — |
| `white` | `#FFFFFF` | Tarjetas, formularios | — |
| `stone-100` | `#F1EDE5` | Bandas alternas, fondos suaves | — |
| `stone-200` | `#E4DED2` | Bordes, separadores | — (no texto) |
| `stone-300` | `#CFC7B8` | Bordes marcados; texto sobre verde oscuro | 9.2:1 sobre `forest-900` |
| `ink` | `#1C211E` | Texto principal | **15.4:1** |
| `ink-2` | `#3D4540` | Texto secundario | **9.3:1** |
| `muted` | `#5E655F` | Metadatos, ayudas (solo sobre snow/white/stone-100) | **5.7:1** |
| `forest-900` | `#12291F` | Cabecera/pie oscuros | snow encima: 14.5:1 |
| `forest-800` | `#173B2C` | Hover sobre oscuro | snow encima: 11.7:1 |
| `forest-700` | `#1F4D3A` | **Primario** (botones, enlaces) | **9.1:1** |
| `forest-600` | `#2A6049` | Hover primario | 6.9:1 |
| `moss` | `#4F6B45` | Etiquetas naturaleza/deporte | 5.6:1 |
| `earth` | `#9A4A26` | Acento cálido con texto | 5.9:1 |
| `earth-500` | `#B5623A` | Acento **decorativo** (líneas, iconos grandes) | 4.2:1 — **no para texto normal** |
| `slate` | `#3B5162` | Información, enlaces secundarios | 7.8:1 |
| `mist` | `#A9C2B5` | Texto/iconos sobre verde oscuro | 8.1:1 sobre `forest-900` |
| `sand` | `#E8C9A0` | Acento sobre verde oscuro | 9.8:1 sobre `forest-900` |
| `urgent` | `#A3241A` | Avisos urgentes | 7.0:1 |
| `important` | `#7A4F00` | Avisos importantes | 6.7:1 |
| `ok` | `#2F6B3A` | Estado abierto / correcto | 6.0:1 |

Reglas: nunca se comunica un estado solo con color (siempre texto + icono). `earth-500` y `slate-400` no se usan para texto.

## 3. Tipografía

| Rol | Familia | Pesos | Notas |
|---|---|---|---|
| Interfaz y texto | **Public Sans** (OFL) | 400, 500, 600, 700 | Diseñada para administración pública, gran legibilidad en pantallas y a tamaños pequeños. |
| Titulares editoriales | **Newsreader** (OFL) | 500, 600 (+ itálica) | Serif de lectura con carácter editorial europeo. Solo en H1/H2 de portada, secciones y noticias. |

Ambas se sirven con `next/font` (autoalojadas en build, sin llamadas a Google en tiempo de ejecución, `display: swap`).

Escala (móvil → escritorio, `clamp`):

| Token | Tamaño | Interlineado |
|---|---|---|
| `display` | 40 → 72 px | 1.02 |
| `h1` | 34 → 52 px | 1.08 |
| `h2` | 26 → 36 px | 1.15 |
| `h3` | 20 → 24 px | 1.25 |
| `body-lg` | 19 → 20 px | 1.6 |
| `body` | **17 px** | 1.6 |
| `small` | 15 px | 1.5 (mínimo absoluto para metadatos) |

Texto corrido limitado a **68 caracteres** por línea (`max-w-prose`).

## 4. Espaciado, radios, sombras

- Escala de 4 px (Tailwind por defecto). Secciones: `py-16 md:py-24`.
- **Radios**: `4px` (inputs, badges), `10px` (tarjetas), `999px` (chips de filtro). Nada de esquinas exageradas.
- **Sombras**: prácticamente ausentes; se usa borde `stone-200`. Única sombra: `shadow-[0_1px_0_#E4DED2,0_8px_24px_-12px_rgba(18,41,31,.18)]` para tarjetas en hover y menús desplegables.

## 5. Retícula y breakpoints

- Contenedor máximo **1240 px**, márgenes laterales 20 px (móvil) / 32 px (tablet) / 48 px (escritorio).
- Retícula de 12 columnas en escritorio, 6 en tablet, 4 en móvil.
- Breakpoints Tailwind: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`. QA en 360, 390, 768, 1024, 1280, 1440, 1920.

## 6. Componentes

### Botones
- **Primario**: fondo `forest-700`, texto `snow`, 48 px de alto mínimo, radio 4 px, peso 600. Hover `forest-600`; foco anillo 3 px `earth-500` + offset.
- **Secundario**: borde 1.5 px `forest-700`, texto `forest-700`, fondo transparente.
- **Terciario/enlace**: texto `forest-700` subrayado con `text-underline-offset: 4px`.
- **Sede Electrónica**: botón primario con icono `ExternalLink` y texto "Sede Electrónica"; siempre indica que abre el sistema oficial.

### Enlaces
Siempre subrayados en texto corrido; los enlaces externos llevan icono y texto oculto "(abre sitio externo)".

### Tarjetas
Fondo blanco, borde `stone-200`, radio 10 px, padding 20-28 px. En hover: borde `forest-700` y leve desplazamiento `-2px` (desactivado con `prefers-reduced-motion`). La tarjeta entera es clicable mediante un enlace en el título con pseudo-elemento, para mantener un único enlace accesible.

Tipos: `NewsCard`, `EventCard` (bloque de fecha grande serif), `ProcedureCard` (icono + "Online"/"Presencial"), `GrantCard` (estado + fecha límite), `DocumentCard` (tipo, tamaño, fecha, contexto), `ContactCard`.

### Formularios
Label siempre visible encima; ayuda debajo en `muted`; error en `urgent` con icono y `aria-describedby`; campos de 48 px; foco con anillo visible. Obligatorios marcados con texto "(obligatorio)", no solo asterisco.

### Alerts / avisos
Banda con borde izquierdo de 4 px y icono: `urgent` (rojo), `important` (ámbar oscuro), `normal` (pizarra). Texto de prioridad visible.

### Badges
Mayúsculas pequeñas con tracking 0.06em, 13-14 px, peso 600, radio 4 px, fondo tintado + texto oscuro del mismo tono (contraste ≥ 4.5:1).

### Tablas
Cabecera `stone-100`, filas separadas por líneas `stone-200`, `caption` siempre presente (puede ser visualmente oculta), desplazamiento horizontal propio en móvil con `tabindex=0` y etiqueta.

### Navegación
- Barra superior institucional (acceso Sede, contacto, idioma futuro).
- Cabecera con wordmark "Ayuntamiento de **Jaca**" y **MegaMenu** de 7 bloques con descripciones cortas.
- En móvil: panel a pantalla completa con acordeones, botón de búsqueda siempre visible y CTA de Sede.
- Breadcrumbs en todas las páginas interiores (con JSON-LD `BreadcrumbList`).

## 7. Iconografía

**Lucide** (trazo 1.75 px, tamaños 20/24/32). Un icono por concepto, siempre acompañado de texto; `aria-hidden` cuando es decorativo.

## 8. Motion

- Duraciones 150–320 ms, curva `cubic-bezier(.2,.7,.2,1)`.
- Aparición progresiva de secciones (fade + 12 px) solo una vez, con `motion` y respetando `prefers-reduced-motion` (se desactiva por completo).
- Hover de tarjetas, apertura de MegaMenu y filtros animados.
- Sin carruseles automáticos ni animaciones en bucle.

## 9. Fotografía

- Fotografía **real de Jaca** con licencia libre verificada (ver `docs/assets-sources.md`), priorizando piedra, luz y escala humana; nada de stock de oficinas.
- Tratamiento: ligera desaturación y velo verde oscuro solo en el hero para asegurar contraste del texto.
- Siempre `next/image` con `sizes`, `alt` descriptivo y crédito visible cuando la licencia lo exige (CC BY/BY-SA).
- Si no hay imagen, se usa un **placeholder gráfico** (silueta de la Peña Oroel sobre `stone-100`), nunca una imagen genérica.

## 10. Identidad municipal

- Denominación oficial: **Ayuntamiento de Jaca** (en documentos: "Excmo. Ayuntamiento de Jaca").
- **El escudo oficial no se redibuja ni se modifica.** En la demo se reserva su espacio en la cabecera con un wordmark tipográfico y un hueco documentado para incorporar el archivo vectorial oficial facilitado por el Ayuntamiento.
- La paleta es compatible con el uso institucional actual y no pretende sustituir ningún manual de identidad.

## 11. Do / Don't

| ✅ Hacer | ❌ Evitar |
|---|---|
| Un CTA principal por bloque | Muchos botones del mismo peso |
| Resumir en HTML y enlazar el PDF oficial | PDF como única fuente de información |
| Fechas en formato claro: "martes, 22 de septiembre de 2026 · 9:30" | "Lun, 21/09/2026" |
| Estados con texto + icono + color | Estados solo por color |
| Espacio generoso y líneas finas | Cajas con sombra y degradados |
| Serif solo en titulares | Serif en botones, formularios o tablas |
| Tarjetas con información real o estado vacío útil | Tarjetas vacías o de relleno |
| Fotografía real y acreditada | Stock genérico, glassmorphism, degradados tecnológicos |
