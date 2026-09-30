# Procedencia de imágenes, identidad y datos

## Fotografías

Todas proceden de **Wikimedia Commons**, con licencia verificada mediante su API el 30/09/2026 (`scripts/fetch-images.mjs` guarda los metadatos en `data/images.json`). Se han redimensionado para la web. La autoría y licencia se muestran en la página pública **/creditos** y junto a cada imagen destacada.

| Archivo | Obra original | Autoría | Licencia |
|---|---|---|---|
| `public/images/hero-oroel.jpg` | [Jaca a los pies de la peña Oroel](https://commons.wikimedia.org/wiki/File:Jaca_a_los_pies_de_la_pe%C3%B1a_Oroel.JPG) | Elemaki | CC BY 3.0 |
| `public/images/ciudadela.jpg` | [Ciudadela Jaca Vista Aerea](https://commons.wikimedia.org/wiki/File:Ciudadela_Jaca_Vista_Aerea.JPG) | Juan Carlos Gil | CC BY-SA 3.0 ES |
| `public/images/crismon.jpg` | [Crismón de Jaca (Catedral de Jaca, Huesca)](https://commons.wikimedia.org/wiki/File:Crism%C3%B3n_de_Jaca_(Catedral_de_Jaca,_Huesca).jpg) | Jl FilpoC | CC BY-SA 4.0 |
| `public/images/puente-san-miguel.jpg` | [Puente de San Miguel de Jaca. 3](https://commons.wikimedia.org/wiki/File:Puente_de_San_Miguel_de_Jaca._3.jpg) | Lozano Manzanedo | CC0 |
| `public/images/calle-mayor.jpg` | [Jaca - Calle Mayor 32](https://commons.wikimedia.org/wiki/File:Jaca_-_Calle_Mayor_32.jpg) | Ecelan | CC BY-SA 4.0 |
| `public/images/vista-oroel.jpg` | [Jaca, view from Peña Oroel (1769m) 1](https://commons.wikimedia.org/wiki/File:Jaca,_view_from_Pe%C3%B1a_Oroel_(1769m)_1.jpg) | AndyScott | CC BY-SA 4.0 |
| `public/images/badaguas.jpg` | [Badaguás. Peña Oroel. Jaca. Huesca. España](https://commons.wikimedia.org/wiki/File:Badagu%C3%A1s_._Pe%C3%B1a_Oroel._Jaca._Huesca._Espa%C3%B1a.jpg) | Lozano Manzanedo | CC BY-SA 4.0 |
| `public/images/catedral-portico.jpg` | [Pórtico de la portada sur (Catedral de Jaca)](https://commons.wikimedia.org/wiki/File:P%C3%B3rtico_de_la_portada_sur_(Catedral_de_Jaca).jpg) | Jl FilpoC | CC BY-SA 4.0 |

**No se han reutilizado imágenes de jaca.es, visitjaca.es ni de prensa**, al no constar una licencia de reutilización. Las noticias del seed se muestran sin imagen.

### Dónde incorporar material oficial

- **Hero de la portada** y **turismo**: fotografías oficiales de la Oficina de Turismo o del archivo municipal (subir desde el panel → Medios, o sustituir en `public/images/` manteniendo el nombre).
- **Noticias**: fotografía propia del Ayuntamiento en cada nota (campo «Imagen» + texto alternativo).
- Al usar fotografías con personas identificables, confirmar las autorizaciones de imagen.

## Identidad municipal

- Denominación usada: **Ayuntamiento de Jaca** / «Excmo. Ayuntamiento de Jaca» (según documentos oficiales).
- **Escudo:** no se ha reproducido ni redibujado. La cabecera muestra un wordmark tipográfico con un hueco reservado (`data-escudo="pendiente-archivo-oficial"` en `components/public/Wordmark.tsx`) para incorporar el archivo vectorial oficial que facilite el Ayuntamiento.
- No se encontró manual de identidad público; la paleta propia es compatible y no sustituye a ninguno (ver `docs/design-system.md`).
- Favicon: pictograma genérico de montaña (no es un símbolo oficial).

## Tipografías

- **Public Sans** (U.S. Web Design System) — SIL Open Font License 1.1.
- **Newsreader** (Production Type) — SIL Open Font License 1.1.
- Servidas localmente mediante `next/font` (sin peticiones a Google en tiempo de ejecución).

## Iconos

**Lucide** — licencia ISC.

## Datos

Todas las fuentes de datos oficiales consultadas están en [discovery.md → Fuentes](discovery.md#34-fuentes-consultadas-el-30092026). Cada registro del seed guarda su `sourceUrl`.
