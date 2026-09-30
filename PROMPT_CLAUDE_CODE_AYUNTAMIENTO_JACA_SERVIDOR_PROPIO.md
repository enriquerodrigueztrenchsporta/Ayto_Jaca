# PROMPT MAESTRO — REDISEÑO WEB AYUNTAMIENTO DE JACA

## 0. Tu rol

Actúa como un **equipo senior completo de producto digital para Administración Pública**, compuesto por:

- Product Designer / UX Lead
- UI Designer
- Arquitecto de software
- Senior Frontend Engineer especializado en Next.js
- Senior Backend Engineer especializado en Node.js
- Especialista en accesibilidad web
- Especialista en SEO técnico
- Especialista en seguridad web
- Especialista en arquitectura de contenidos y CMS
- QA Engineer
- DevOps Engineer

Tu objetivo no es hacer una demo superficial, sino construir una **propuesta web municipal moderna, creíble, mantenible y enseñable a un cliente real**.

---

# 1. OBJETIVO DEL PROYECTO

Construye desde cero una propuesta profesional de nueva página web para el **Ayuntamiento de Jaca (Huesca, Aragón, España)**.

La web actual de referencia es:

https://www.jaca.es/

El repositorio de destino es:

https://github.com/enriquerodrigueztrenchsporta/Ayto_Jaca

## Objetivos principales

1. Mantener, como mínimo, las **mismas áreas, secciones, servicios e información pública relevante** que existen actualmente en `jaca.es`.
2. Reorganizar esa información para que sea mucho más fácil de encontrar.
3. Actualizar la información utilizando exclusivamente fuentes oficiales y verificables.
4. Crear una experiencia visual **moderna, institucional, diferencial y profesional**, alejada de la estética típica de una web municipal antigua.
5. Priorizar las necesidades reales de:
   - vecinos de Jaca;
   - habitantes de los núcleos rurales del municipio;
   - visitantes;
   - empresas;
   - asociaciones;
   - personas que necesitan hacer trámites;
   - medios de comunicación.
6. Permitir que una sola persona pueda mantener semanalmente los contenidos dinámicos mediante un **panel/formulario privado muy sencillo**.
7. Construir la solución con **Next.js + Node.js**, preparada para producción.
8. Publicar el código en el repositorio indicado.
9. Dejar una demo fácilmente accesible una vez terminada.
10. Conseguir que la propuesta pueda presentarse comercialmente al Ayuntamiento como una alternativa real a la web existente.

---

# 2. PRINCIPIO FUNDAMENTAL: NO INVENTES INFORMACIÓN

Antes de diseñar o programar:

1. Analiza exhaustivamente:
   - https://www.jaca.es/
   - todas sus secciones principales;
   - subsecciones;
   - menús;
   - enlaces útiles;
   - trámites;
   - noticias;
   - agenda;
   - normativa;
   - subvenciones;
   - transparencia;
   - áreas municipales;
   - información turística;
   - documentos;
   - datos de contacto.

2. Crea un inventario estructurado de contenidos.

3. Clasifica cada elemento como:
   - estructural / permanente;
   - actualización ocasional;
   - actualización semanal;
   - actualización frecuente;
   - enlace a servicio externo.

4. Para cualquier información que pueda haber cambiado, usa fuentes oficiales actuales.

## Fuentes permitidas y prioritarias

Prioridad 1:
- `jaca.es`
- sede electrónica oficial del Ayuntamiento de Jaca
- portales oficiales del Ayuntamiento
- organismos oficiales vinculados al municipio

Prioridad 2:
- Gobierno de Aragón
- Diputación Provincial de Huesca
- BOA / BOPH / BOE
- fuentes públicas institucionales

No uses blogs, agregadores o webs comerciales como fuente para información institucional.

## Regla

**Nunca inventes:**
- horarios;
- teléfonos;
- nombres;
- cargos públicos;
- convocatorias;
- plazos;
- eventos;
- subvenciones;
- documentos;
- direcciones;
- tasas;
- normativas;
- noticias.

Si una información no puede verificarse, déjala marcada internamente como pendiente de verificación, pero no la presentes al usuario como cierta.

---

# 3. ANÁLISIS PREVIO OBLIGATORIO

Antes de escribir código crea:

`docs/discovery.md`

Debe contener:

## 3.1 Inventario de la web actual

Tabla:

| Área | Sección actual | URL actual | Tipo de contenido | Frecuencia de actualización | Debe migrarse | Nueva ubicación propuesta |
|---|---|---|---|---|---|---|

## 3.2 Problemas UX detectados

Analiza:
- navegación;
- jerarquía;
- densidad;
- legibilidad;
- móvil;
- buscador;
- descubrimiento de trámites;
- agenda;
- noticias;
- accesibilidad;
- duplicidades;
- PDFs;
- enlaces externos;
- llamadas a la acción.

## 3.3 Arquitectura propuesta

Explica qué información se mantiene y cómo se reorganiza.

## 3.4 Fuentes

Incluye una lista de URLs oficiales consultadas y fecha de consulta.

---

# 4. ARQUITECTURA DE INFORMACIÓN

No copies simplemente el menú actual.

Conserva toda la información relevante, pero crea una estructura más intuitiva.

La navegación principal debe plantearse aproximadamente en torno a estos grandes bloques, adaptándolos tras analizar la web real:

## Inicio

## Ayuntamiento
Posibles contenidos:
- Alcaldía
- Corporación municipal
- Organización municipal
- Pleno
- Junta de Gobierno
- Áreas municipales
- Contacto
- Directorio
- Bandos
- Información institucional

## Trámites y servicios
Debe ser uno de los elementos más importantes de toda la web.

Incluir:
- acceso destacado a Sede Electrónica;
- impresos y solicitudes;
- padrón;
- urbanismo;
- tributos;
- pagos;
- licencias;
- certificados;
- registro;
- contratación;
- empleo;
- ayudas;
- subvenciones;
- otros trámites existentes.

Diseña también un:

### Buscador de trámites

Debe permitir buscar en lenguaje natural o por palabras clave.

Ejemplos:
- empadronarme;
- pagar una tasa;
- licencia de obra;
- bonificación IBI;
- presentar una instancia;
- subvención;
- certificado;
- factura electrónica.

## Actualidad
- Noticias
- Avisos
- Agenda
- Convocatorias
- Plenos
- Destacados

## Transparencia
- Portal de transparencia
- Presupuestos
- Contratación
- Normativa
- Ordenanzas
- Subvenciones
- Convenios
- patrimonio
- información pública
- otros apartados reales existentes

## Ciudad y municipio
- Jaca
- Barrios
- Núcleos rurales
- servicios
- movilidad
- residuos
- medio ambiente
- obras
- seguridad
- participación ciudadana
- educación
- juventud
- mayores
- igualdad
- servicios sociales

## Cultura

Mantén e integra los contenidos reales de cultura.

## Deportes

Mantén e integra los contenidos reales.

## Turismo

Mantén los contenidos de turismo actualmente existentes, incluyendo, cuando proceda:
- agenda;
- noticias;
- planificación del viaje;
- monumentos y museos;
- naturaleza;
- deportes;
- románico;
- modernismo;
- espacio rural;
- gastronomía;
- ocio;
- congresos.

Cuando sea conveniente, el portal turístico puede conservar personalidad propia dentro del mismo sistema de diseño.

## Desarrollo económico
- empresas;
- comercio;
- empleo;
- emprendimiento;
- formación;
- subvenciones;
- iniciativas municipales.

---

# 5. HOME PAGE

La homepage debe ser visual, útil y muy poco burocrática.

No quiero una portada llena de párrafos.

Debe responder inmediatamente a:

1. ¿Qué necesito hacer?
2. ¿Qué está pasando en Jaca?
3. ¿Qué necesito saber hoy?
4. ¿Cómo contacto con el Ayuntamiento?

## Hero

Diseña un hero contemporáneo con identidad de Jaca.

Puede utilizar fotografía o vídeo optimizado relacionado con:
- Jaca;
- Peña Oroel;
- entorno pirenaico;
- patrimonio;
- ciudad;
- paisaje urbano.

Evita clichés visuales exagerados de montaña.

### Elementos del hero

- identidad Ayuntamiento de Jaca;
- buscador central;
- acceso inmediato a Sede Electrónica;
- acceso a Trámites;
- acceso a Agenda;
- acceso a Avisos.

Ejemplo conceptual del buscador:

> ¿Qué necesitas hacer?

Placeholder:

> Buscar un trámite, servicio, noticia o lugar…

---

# 6. BLOQUES DE LA HOME

Diseña, como mínimo:

## 6.1 Accesos rápidos

Tarjetas o botones para los servicios de mayor uso.

Ejemplos:
- Sede electrónica
- Padrón
- Instancia general
- Tributos
- Urbanismo
- Subvenciones
- Empleo público
- Cita / contacto
- Transparencia

Adapta la lista a servicios reales.

## 6.2 Avisos importantes

Para:
- cortes;
- obras;
- cambios de tráfico;
- incidencias;
- plazos;
- cierres;
- alertas;
- cambios de servicio.

Los avisos deben poder tener:
- prioridad;
- fecha de inicio;
- fecha de expiración.

Cuando expiren deben dejar de mostrarse automáticamente.

## 6.3 Actualidad

Últimas noticias.

## 6.4 Agenda

Eventos próximos en formato muy visual.

Filtros:
- cultura;
- deporte;
- turismo;
- juventud;
- participación;
- institucional;
- otros.

## 6.5 Trámites destacados

## 6.6 Jaca hoy

Un pequeño bloque opcional que pueda incluir datos útiles como:
- agenda de hoy;
- teléfonos;
- servicios;
- enlaces útiles.

No inventar servicios en tiempo real.

## 6.7 Explora Jaca

Bloque más visual destinado a:
- turismo;
- cultura;
- patrimonio;
- deporte;
- naturaleza.

## 6.8 Ayuntamiento

Accesos institucionales y de transparencia.

## 6.9 Newsletter / avisos

Diseña la interfaz aunque no sea obligatorio conectar un servicio de email en el MVP.

---

# 7. DISEÑO VISUAL

Quiero algo distinto a una web institucional tradicional.

## Personalidad

Debe transmitir:

- Jaca;
- Pirineo;
- solvencia institucional;
- cercanía;
- claridad;
- modernidad;
- territorio;
- patrimonio;
- servicio público.

## Dirección visual

Inspiración conceptual:

> Administración pública contemporánea + editorial europea + identidad pirenaica.

No diseñar:
- una web corporativa tecnológica genérica;
- una plantilla Bootstrap;
- una landing de startup;
- una web llena de degradados;
- una web excesivamente turística.

## Paleta

Construye una paleta propia inspirada en:
- piedra;
- nieve;
- bosque;
- verde oscuro;
- tonos tierra;
- azul/gris pirenaico;
- blanco cálido.

Debe respetar ratios de contraste de accesibilidad.

## Tipografía

Utiliza tipografías profesionales y muy legibles.

Puede combinarse:
- una sans moderna para interfaz;
- una serif o display sobria para determinados titulares editoriales.

No sacrifiques legibilidad.

## Layout

- mucho espacio;
- retícula sólida;
- jerarquía clara;
- tarjetas elegantes;
- líneas finas;
- grandes titulares cuando tenga sentido;
- fotografías bien integradas;
- iconografía consistente;
- interacción sutil.

## Animación

Añade microinteracciones profesionales:
- hover;
- aparición progresiva;
- navegación;
- filtros;
- transición entre bloques;
- motion suave.

Usa Framer Motion si aporta valor.

Respeta:

`prefers-reduced-motion`.

No añadas animaciones decorativas que perjudiquen rendimiento o accesibilidad.

---

# 8. RESPONSIVE

Debe diseñarse mobile-first.

Prueba como mínimo:

- 360 px
- 390 px
- 768 px
- 1024 px
- 1280 px
- 1440 px
- 1920 px

La navegación y trámites deben funcionar especialmente bien en móvil.

---

# 9. TECNOLOGÍA

Utiliza:

## Frontend
- Next.js, versión estable actual
- App Router
- TypeScript
- React
- Tailwind CSS

## Backend
- Node.js mediante Next.js server runtime / Route Handlers / Server Actions según proceda

## Base de datos

Para una demo profesional y escalable utiliza preferentemente:

- PostgreSQL

Opciones aceptables:
- Supabase PostgreSQL
- Neon PostgreSQL

## ORM

- Prisma

o una alternativa equivalente si existe una razón técnica clara.

## Autenticación admin

Usa:
- Auth.js / NextAuth

o alternativa equivalente fiable.

Debe existir un único usuario administrador en el MVP, pero la arquitectura debe permitir varios usuarios en el futuro.

## Validación

- Zod

## Formularios

- React Hook Form o una solución equivalente.

## Imágenes

- `next/image`

## Iconos

- Lucide

---

# 10. NO CREES UN CMS EXCESIVAMENTE COMPLEJO

El objetivo comercial de este proyecto es que el mantenimiento semanal pueda hacerlo **una sola persona sin saber programar**.

Crea un pequeño CMS propio integrado.

Ruta privada:

`/admin`

Debe estar protegida mediante autenticación.

---

# 11. PANEL DE ADMINISTRACIÓN

Crear un dashboard sencillo.

## Navegación

- Resumen
- Actualización semanal
- Noticias
- Agenda
- Avisos
- Subvenciones / convocatorias
- Documentos
- Trámites
- Banners / destacados
- Páginas
- Medios
- Configuración

---

# 12. FORMULARIO DE ACTUALIZACIÓN SEMANAL

Esta parte es MUY IMPORTANTE.

Quiero un formulario específico:

`/admin/actualizacion-semanal`

Su objetivo es que, una vez por semana, el responsable pueda introducir todo lo que deba modificarse en la web sin revisar manualmente cada página.

## Flujo

### Paso 1 — Semana

- fecha de actualización;
- semana;
- notas internas.

### Paso 2 — Avisos

Permitir añadir 0..N avisos.

Campos:
- título;
- descripción corta;
- descripción completa;
- prioridad:
  - normal;
  - importante;
  - urgente;
- fecha inicio;
- fecha fin;
- enlace;
- área;
- mostrar en home: sí/no.

### Paso 3 — Noticias

0..N noticias.

Campos:
- titular;
- entradilla;
- cuerpo;
- categoría;
- imagen;
- texto alternativo;
- fecha;
- autor opcional;
- fuente;
- enlaces;
- documentos;
- destacado sí/no.

### Paso 4 — Agenda

0..N eventos.

Campos:
- nombre;
- fecha inicio;
- fecha fin;
- hora;
- ubicación;
- dirección;
- descripción;
- categoría;
- organizador;
- precio;
- reserva / entradas;
- enlace;
- imagen;
- destacar en home.

Debe permitir eventos recurrentes si resulta razonable.

### Paso 5 — Convocatorias y subvenciones

0..N entradas.

Campos:
- título;
- estado:
  - próxima;
  - abierta;
  - cerrada;
  - concedida;
- fecha de apertura;
- fecha límite;
- destinatarios;
- resumen;
- enlace oficial;
- documentación;
- área responsable.

### Paso 6 — Empleo y procesos selectivos

Campos equivalentes adaptados.

### Paso 7 — Plenos y actividad institucional

- fecha;
- tipo de sesión;
- hora;
- lugar;
- streaming;
- orden del día;
- documentos.

### Paso 8 — Cortes / obras / movilidad

- título;
- zona;
- fecha inicio;
- fecha fin;
- afectación;
- alternativa;
- mapa/enlace opcional.

### Paso 9 — Destacados de portada

Permitir seleccionar qué contenidos deben aparecer en la home.

### Paso 10 — Revisión

Mostrar un resumen de todos los cambios antes de publicar.

Botones:

- Guardar borrador
- Previsualizar
- Publicar cambios

---

# 13. AUTOMATISMOS DEL CMS

Implementa:

## Publicación programada

Un contenido puede tener:
- `publishAt`
- `expiresAt`

## Caducidad automática

Los avisos y eventos pasados no deben seguir apareciendo en portada.

No borrar necesariamente el contenido: archivarlo.

## Estados

- DRAFT
- SCHEDULED
- PUBLISHED
- ARCHIVED

## Historial

Guardar:
- fecha;
- usuario;
- tipo de cambio;
- contenido afectado.

## Confirmación

Antes de publicar, mostrar:

> Estás a punto de actualizar X noticias, Y eventos y Z avisos.

---

# 14. PREVISUALIZACIÓN

El administrador debe poder visualizar los cambios antes de publicar.

Idealmente:

`/preview/...`

La preview no debe estar indexada.

---

# 15. MODELO DE DATOS

Diseña un esquema sólido para, como mínimo:

- User
- Page
- News
- Event
- Alert
- Grant
- PublicJob
- MunicipalSession
- Procedure
- Document
- Category
- Media
- FeaturedContent
- WeeklyUpdate
- AuditLog

Añade las relaciones necesarias.

No dupliques contenido si puede resolverse con una relación.

---

# 16. DOCUMENTOS

Una web municipal maneja muchos PDF y documentos.

Crea un componente consistente:

`DocumentCard`

Debe mostrar:
- título;
- tipo;
- fecha;
- peso si está disponible;
- botón abrir/descargar;
- icono;
- contexto.

Los documentos deben poder asociarse a:
- noticias;
- trámites;
- plenos;
- subvenciones;
- normativa;
- páginas.

---

# 17. BUSCADOR

Implementa un buscador global.

Debe buscar al menos en:
- páginas;
- noticias;
- agenda;
- trámites;
- subvenciones;
- documentos;
- avisos.

Diseña una interfaz de resultados agrupados por tipo.

Para el MVP se puede implementar búsqueda PostgreSQL o una estrategia sencilla server-side.

La arquitectura debe permitir añadir posteriormente:
- Meilisearch;
- Algolia;
- Typesense;
- búsqueda semántica.

---

# 18. TRÁMITES

Los trámites son prioritarios.

Cada trámite debe tener una ficha clara:

- título;
- descripción;
- quién puede hacerlo;
- requisitos;
- documentación;
- plazo;
- coste/tasa;
- cómo realizarlo;
- presencial;
- online;
- enlace directo a Sede Electrónica;
- área responsable;
- contacto;
- documentos relacionados.

No copies contenido legal desactualizado.

---

# 19. INFORMACIÓN ACTUALIZADA

En el seed inicial de la aplicación:

- usa información pública actual;
- conserva la fuente original;
- guarda `sourceUrl`;
- guarda `lastVerifiedAt` cuando sea posible.

Esto permitirá saber cuándo debe revisarse un dato.

Para contenido sensible al tiempo, muestra internamente en `/admin` avisos como:

> Este dato no se verifica desde hace 90 días.

No hace falta automatizar scraping periódico para el MVP.

---

# 20. FUENTE DE LA INFORMACIÓN

En la base de datos permite campos:

- `sourceUrl`
- `sourceName`
- `lastVerifiedAt`

Especialmente en:
- trámites;
- normativa;
- contactos;
- subvenciones;
- cargos institucionales.

---

# 21. CONTENIDO INSTITUCIONAL Y NEUTRALIDAD

La web debe limitarse a información institucional.

Para información sobre:
- alcalde;
- concejales;
- grupos políticos;
- plenos;
- actividad municipal;

usa información objetiva procedente de fuentes oficiales.

No redactes mensajes partidistas, electorales ni promocionales sobre responsables políticos.

---

# 22. ACCESIBILIDAD

Es un requisito central, no opcional.

Diseña con objetivo:

**WCAG 2.2 nivel AA**

y ten en cuenta las obligaciones de accesibilidad aplicables a webs del sector público en España y la norma EN 301 549.

Implementa:

- navegación mediante teclado;
- foco visible;
- skip links;
- labels;
- aria cuando sea necesario;
- landmarks semánticos;
- contraste suficiente;
- alt text;
- jerarquía correcta de encabezados;
- formularios accesibles;
- mensajes de error accesibles;
- tablas accesibles;
- modales accesibles;
- `prefers-reduced-motion`;
- tamaño táctil adecuado.

Añade:

`/accesibilidad`

con una declaración de accesibilidad de DEMOSTRACIÓN claramente identificada como tal, sin afirmar cumplimiento legal auditado si no ha sido verificado.

---

# 23. SEGURIDAD

Implementa buenas prácticas:

- variables de entorno;
- ninguna secret en Git;
- validación server-side;
- sanitización;
- protección CSRF cuando corresponda;
- autenticación segura;
- autorización por roles;
- headers de seguridad;
- rate limiting en endpoints sensibles;
- validación MIME/tamaño en archivos;
- protección frente a XSS;
- evitar SQL injection mediante ORM;
- logs sin datos sensibles.

Crea:

`.env.example`

Nunca subas credenciales reales.

---

# 24. PRIVACIDAD

Crea páginas base:

- Aviso legal
- Política de privacidad
- Política de cookies
- Accesibilidad

Como se trata de una PROPUESTA / DEMO, no inventes datos jurídicos.

Cuando falten datos, utiliza placeholders visibles:

`[PENDIENTE DE VALIDACIÓN POR EL AYUNTAMIENTO]`

No presentes información jurídica ficticia como real.

---

# 25. COOKIES

No muestres un banner invasivo si la web solo usa cookies estrictamente necesarias.

Si añades analítica, debe ser consent-aware.

No añadas Google Analytics por defecto.

---

# 26. SEO

Configura:

- metadata API de Next.js;
- títulos;
- descripciones;
- canonical;
- Open Graph;
- sitemap;
- robots;
- breadcrumbs;
- schema.org cuando proceda.

Tipos útiles:
- GovernmentOrganization
- Event
- NewsArticle
- BreadcrumbList

---

# 27. RENDIMIENTO

Objetivo orientativo Lighthouse:

- Performance >= 90
- Accessibility >= 95
- Best Practices >= 95
- SEO >= 95

No sacrifiques funcionalidad real para obtener métricas artificiales.

Optimiza:
- imágenes;
- fuentes;
- JavaScript;
- lazy loading;
- caching;
- server components;
- revalidación cuando proceda.

---

# 28. FOTOGRAFÍA

Para la demo:

- prioriza imágenes oficiales o libres de derechos;
- documenta su procedencia;
- no descargues y republicques imágenes protegidas sin autorización.

Si no puede confirmarse una licencia, utiliza un placeholder visual elegante o deja documentado dónde debería incorporarse material oficial autorizado.

Crea:

`docs/assets-sources.md`

---

# 29. MAPAS

Si utilizas mapas:
- no expongas claves privadas;
- evita dependencias innecesarias;
- pueden ser enlaces o mapas OpenStreetMap según necesidad.

---

# 30. COMPONENTES

Crea un sistema reutilizable.

Ejemplos:

- Header
- MegaMenu
- MobileNavigation
- Search
- Breadcrumbs
- Hero
- QuickAccess
- AlertBanner
- NewsCard
- EventCard
- ProcedureCard
- DocumentCard
- GrantCard
- SectionHeader
- FilterBar
- Pagination
- Footer
- ContactCard
- EmptyState
- ErrorState
- Skeleton
- AdminSidebar
- AdminHeader
- EditorForm
- MediaUploader
- PublicationStatus

Evita componentes gigantes.

---

# 31. IDENTIDAD DEL MUNICIPIO

Analiza los elementos oficiales existentes:
- escudo;
- marca;
- colores;
- denominación.

No rediseñes el escudo oficial de forma arbitraria.

Si no existe un manual de identidad disponible, crea un sistema visual compatible sin alterar símbolos oficiales.

---

# 32. ESTRUCTURA TÉCNICA

Propón y crea una estructura semejante a:

```text
Ayto_Jaca/
├─ app/
│  ├─ (public)/
│  ├─ admin/
│  ├─ api/
│  └─ ...
├─ components/
│  ├─ ui/
│  ├─ public/
│  └─ admin/
├─ lib/
├─ prisma/
├─ public/
├─ styles/
├─ data/
├─ docs/
├─ tests/
├─ scripts/
├─ .env.example
├─ README.md
└─ package.json
```

Adáptala si hay una solución mejor.

---

# 33. TESTS

Incluye:

## Unitarios
Para lógica crítica.

## Integración
- creación de noticia;
- edición;
- publicación;
- expiración;
- agenda;
- formulario semanal.

## E2E con Playwright

Como mínimo:

1. usuario abre home;
2. usa navegación;
3. busca un trámite;
4. abre una noticia;
5. consulta un evento;
6. entra en admin;
7. crea contenido;
8. guarda borrador;
9. publica;
10. contenido aparece en web.

Añade también pruebas básicas de accesibilidad si es viable.

---

# 34. CALIDAD

Antes de dar el trabajo por terminado ejecuta:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

y corrige los errores.

No consideres terminado un proyecto que no compila.

---

# 35. README

Crea un `README.md` excelente que explique:

- qué es el proyecto;
- arquitectura;
- stack;
- instalación;
- variables de entorno;
- base de datos;
- migraciones;
- seed;
- ejecutar desarrollo;
- ejecutar tests;
- crear usuario admin;
- actualización de contenidos;
- despliegue;
- estructura del proyecto.

Incluye instrucciones Windows / PowerShell cuando proceda.

---

# 36. MANUAL PARA EL RESPONSABLE DE CONTENIDO

Crea:

`docs/manual-actualizacion.md`

Debe ser comprensible por una persona no técnica.

Explica:

1. entrar al panel;
2. abrir actualización semanal;
3. introducir avisos;
4. añadir noticias;
5. añadir agenda;
6. añadir convocatorias;
7. adjuntar PDF;
8. previsualizar;
9. publicar;
10. corregir;
11. archivar.

Incluye una checklist semanal.

---

# 37. CHECKLIST SEMANAL

Implementa también dentro del admin:

### Actualización semanal

- [ ] Revisar avisos activos
- [ ] Retirar avisos caducados
- [ ] Añadir noticias
- [ ] Revisar agenda próximos 14 días
- [ ] Actualizar subvenciones y convocatorias
- [ ] Revisar empleo público
- [ ] Revisar plenos
- [ ] Revisar cortes / obras / movilidad
- [ ] Actualizar destacados
- [ ] Verificar enlaces rotos relevantes
- [ ] Previsualizar
- [ ] Publicar

---

# 38. DEMO VS WEB OFICIAL

La web debe mostrar discretamente durante la fase de propuesta:

> Propuesta de rediseño — demo no oficial

Esto evita confundir la demo con la web institucional real.

Debe ser configurable mediante:

`NEXT_PUBLIC_DEMO_MODE=true`

Cuando sea `false`, el aviso desaparece.

---

# 39. DATOS DE DEMOSTRACIÓN

Utiliza contenido real y reciente cuando sea posible.

Para garantizar que el proyecto pueda ejecutarse sin depender inicialmente de un CMS externo:

- crea un seed;
- añade ejemplos reales verificados;
- añade ejemplos ficticios SOLO si están claramente etiquetados como DEMO.

Nunca mezcles ejemplos ficticios con información institucional como si fueran reales.

---

# 40. MIGRACIÓN DE CONTENIDOS

No necesito un scraper de producción que clone permanentemente `jaca.es`.

Sí quiero un proceso de migración inicial razonable.

Crea:

`docs/content-migration.md`

Explica:

- qué contenido se ha migrado;
- qué no;
- qué requiere revisión manual;
- qué enlaces siguen apuntando al sistema oficial;
- qué PDFs permanecen alojados en la web oficial;
- posibles riesgos.

---

# 41. ENLACES A SERVICIOS OFICIALES

No intentes reconstruir sistemas administrativos críticos.

Cuando un trámite dependa de:
- sede electrónica;
- plataforma de contratación;
- carpeta ciudadana;
- pasarela de pago;
- servicios externos oficiales;

la nueva web debe actuar como interfaz clara y enlazar al sistema oficial correspondiente.

No copies autenticación institucional ni simules un trámite administrativo real.

---

# 42. EXPERIENCIA DEL CIUDADANO

Diseña varias rutas UX.

## Caso A
“Necesito empadronarme.”

Debe llegar al trámite en muy pocos pasos.

## Caso B
“¿Qué hay este fin de semana en Jaca?”

Debe llegar a agenda rápidamente.

## Caso C
“Quiero saber si hay una subvención abierta.”

Debe tener vista filtrable.

## Caso D
“Necesito consultar el último pleno.”

Debe ser directo.

## Caso E
“Quiero ponerme en contacto con Urbanismo.”

Debe encontrar:
- área;
- contacto;
- trámites asociados;
- ubicación si procede.

## Caso F
“Soy turista.”

Debe poder descubrir la parte turística sin dominar toda la navegación municipal.

---

# 43. FOOTER

Debe contener, si está oficialmente disponible:

- Ayuntamiento de Jaca
- dirección
- teléfono
- contacto
- Sede Electrónica
- Transparencia
- Accesibilidad
- Aviso legal
- Privacidad
- Cookies
- mapa web
- redes sociales oficiales

Comprueba cada enlace antes de incorporarlo.

---

# 44. PÁGINA 404

Crea una 404 útil.

Incluye:
- buscador;
- trámites;
- home;
- contacto.

---

# 45. ERRORES Y ESTADOS VACÍOS

Nunca mostrar páginas rotas o cajas vacías.

Diseña:
- loading;
- error;
- empty;
- offline/failed request cuando proceda.

---

# 46. DEPLOYMENT

El código debe quedar en:

https://github.com/enriquerodrigueztrenchsporta/Ayto_Jaca

## Git

Si el repositorio está vacío:

1. inicializa el proyecto allí;
2. crea `.gitignore`;
3. trabaja con commits claros;
4. no subas secrets;
5. push a `main` una vez verificado.

Ejemplos de commits:

```text
chore: initialize Next.js project
feat: create public information architecture
feat: implement municipal homepage
feat: add procedures and global search
feat: build admin weekly update workflow
feat: add accessibility and SEO improvements
test: add e2e coverage
docs: add content management manual
```

---

# 47. DESPLIEGUE EN SERVIDOR PROPIO

IMPORTANTE:

La versión final NO debe depender de Vercel ni de GitHub Pages.

GitHub se utilizará únicamente como repositorio del código fuente:

`https://github.com/enriquerodrigueztrenchsporta/Ayto_Jaca`

La aplicación debe quedar preparada para desplegarse en un **servidor propio / VPS Linux**.

## Arquitectura de producción preferida

Utiliza una arquitectura sencilla, robusta y mantenible:

- Ubuntu Server LTS
- Docker
- Docker Compose
- Next.js / Node.js
- PostgreSQL
- Nginx como reverse proxy
- HTTPS mediante Let's Encrypt / Certbot
- volúmenes persistentes para PostgreSQL
- variables de entorno fuera del repositorio
- reinicio automático de servicios
- logs persistentes
- backups automatizables

## Docker

Crea:

- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`

El `docker-compose.yml` debe incluir al menos:

- aplicación Next.js
- PostgreSQL
- Nginx si se considera conveniente dentro de Compose

La aplicación debe poder levantarse con:

```bash
docker compose up -d
```

## Base de datos

PostgreSQL debe ejecutarse de forma persistente.

Configura:

- volumen persistente;
- usuario;
- contraseña mediante variables de entorno;
- base de datos;
- healthcheck;
- migraciones Prisma;
- seed inicial.

Nunca incluir credenciales reales en Git.

## Reverse proxy

Configura Nginx para:

- servir el dominio;
- redirigir HTTP a HTTPS;
- proxy hacia la aplicación Node;
- headers apropiados;
- compresión;
- límites de subida razonables;
- soporte para archivos estáticos.

Crea ejemplo de configuración en:

`deploy/nginx/ayto-jaca.conf`

## HTTPS

Documenta la instalación de HTTPS mediante:

- Let's Encrypt
- Certbot

Crea instrucciones para renovación automática.

## Dominio

La aplicación debe poder funcionar con un dominio personalizado, por ejemplo:

`demo.aytojaca.es`

o cualquier dominio/subdominio que se configure posteriormente.

No inventes ni compres ningún dominio.

## Variables de entorno

Crea:

`.env.example`

Debe incluir únicamente nombres y ejemplos seguros de:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- credenciales admin iniciales si procede
- storage
- configuración de email si existe
- flags como `NEXT_PUBLIC_DEMO_MODE`

Nunca incluir secrets reales.

## CI/CD

Deja preparado un flujo sencillo de despliegue desde GitHub.

Opción recomendada:

- push a `main`
- GitHub Actions ejecuta tests y build
- si existe configuración SSH válida:
  - conexión al servidor;
  - `git pull` o despliegue de imagen;
  - `docker compose build`;
  - `docker compose up -d`;
  - migraciones;
  - healthcheck.

Nunca añadas claves SSH reales al repositorio.

Documenta los secrets necesarios de GitHub Actions.

## Healthcheck

Crea un endpoint:

`/api/health`

Debe responder con estado de:

- aplicación;
- base de datos;
- timestamp.

No debe revelar información sensible.

## Backups

Crea documentación para backup de PostgreSQL.

Añade ejemplo de script:

`deploy/scripts/backup-db.sh`

Debe permitir:

- backup manual;
- ejecución por cron;
- rotación básica.

## Recuperación

Crea:

`docs/disaster-recovery.md`

Incluye:

- restaurar base de datos;
- desplegar nueva instancia;
- recuperar variables de entorno;
- comprobar aplicación.

## Seguridad del servidor

Documenta como mínimo:

- usuario no root;
- SSH con clave;
- deshabilitar password SSH si procede;
- firewall UFW;
- puertos 22, 80 y 443;
- actualizaciones;
- Fail2ban opcional;
- no exponer PostgreSQL públicamente;
- permisos de archivos;
- backups.

## Documentación

Crea:

`docs/deployment-server.md`

Debe explicar paso a paso, pensado para una persona no experta:

1. contratar o preparar un VPS;
2. conectarse por SSH;
3. instalar Docker;
4. instalar Docker Compose;
5. clonar el repositorio;
6. crear `.env`;
7. levantar PostgreSQL;
8. ejecutar migraciones;
9. crear usuario administrador;
10. levantar la aplicación;
11. configurar Nginx;
12. configurar dominio;
13. instalar HTTPS;
14. comprobar `/api/health`;
15. actualizar la web en el futuro.

Incluye comandos Linux exactos.

## Entorno de staging

Si es razonable, deja preparado soporte para:

- `staging`
- `production`

No dupliques infraestructura innecesariamente.

## Preview local

Antes del despliegue final, la web debe poder probarse localmente con:

```bash
npm run dev
```

o mediante Docker:

```bash
docker compose up
```

## Regla

No dependas de servicios propietarios obligatorios para que la web funcione.

La aplicación debe poder ejecutarse íntegramente en infraestructura propia.

---

# 48. GITHUB ACTIONS

Añade CI para:

- instalación;
- lint;
- typecheck;
- tests;
- build.

Ejecutar en pull requests y `main`.

---

# 49. FASES DE EJECUCIÓN

Trabaja en este orden:

## Fase 1 — Discovery
Analiza la web existente y fuentes.

## Fase 2 — Arquitectura
IA + contenido + modelos.

## Fase 3 — Diseño
Define design system.

## Fase 4 — Base técnica
Next.js + DB + auth.

## Fase 5 — Web pública
Home + navegación + páginas.

## Fase 6 — Trámites y búsqueda

## Fase 7 — CMS y formulario semanal

## Fase 8 — Migración inicial de contenido

## Fase 9 — Accesibilidad, SEO y rendimiento

## Fase 10 — Tests

## Fase 11 — QA visual

## Fase 12 — GitHub + despliegue en servidor propio

No empieces por producir decenas de páginas copiadas sin haber definido antes el sistema.

---

# 50. DESIGN SYSTEM

Antes de diseñar todas las pantallas crea:

`docs/design-system.md`

Debe incluir:

- concepto visual;
- colores;
- tipografía;
- spacing;
- radios;
- sombras;
- grids;
- breakpoints;
- botones;
- enlaces;
- cards;
- formularios;
- alerts;
- badges;
- tablas;
- navegación;
- iconografía;
- motion;
- fotografía;
- ejemplos do/don't.

---

# 51. NO QUIERO

Evita:

- apariencia de plantilla;
- Bootstrap visual;
- exceso de cards iguales;
- degradados tecnológicos;
- glassmorphism gratuito;
- animaciones constantes;
- fotografías stock de oficinas;
- texto pequeño;
- menús infinitos;
- 7 niveles de navegación;
- páginas que sean únicamente un listado de enlaces;
- PDFs como única forma de transmitir información que debería ser HTML;
- bloques gigantes de texto;
- copiar literalmente la estética actual;
- inventar información.

---

# 52. QUIERO

Quiero que al abrirla alguien piense:

> “Esto sí parece el portal digital de una ciudad europea moderna.”

Y al mismo tiempo:

> “Esto sigue siendo Jaca.”

Debe existir identidad territorial sin convertir toda la web en una web turística.

---

# 53. ADMINISTRACIÓN SENCILLA

Ten presente el modelo de negocio:

La propuesta incluye no solo vender la web, sino ofrecer un **servicio recurrente de mantenimiento de contenido**.

Por eso el panel semanal es un elemento comercial clave.

Debe demostrar que una actualización que antes requería editar muchas páginas puede hacerse desde una única interfaz.

Añade al dashboard un resumen:

### Esta semana

- X avisos activos
- X noticias publicadas
- X eventos próximos
- X convocatorias abiertas
- X contenidos pendientes de revisión
- X contenidos que caducan esta semana

---

# 54. FUTURAS FUNCIONALIDADES

No hace falta construirlas todas ahora, pero deja arquitectura compatible con:

- multidioma ES/FR/EN;
- notificaciones push;
- newsletter;
- WhatsApp municipal;
- chatbot informativo basado únicamente en contenido municipal;
- Open Data;
- API pública;
- reservas;
- incidencias ciudadanas;
- participación;
- encuestas;
- analítica privacy-friendly;
- app móvil / PWA.

No sobrearquitectes el MVP.

---

# 55. ENTREGA FINAL

Antes de considerar el trabajo terminado:

1. Comprueba que el repositorio contiene todo el código.
2. Comprueba que no hay secrets.
3. Comprueba que instala desde cero.
4. Comprueba que la base de datos puede inicializarse.
5. Comprueba que existe seed.
6. Comprueba login admin.
7. Comprueba creación de contenido.
8. Comprueba edición.
9. Comprueba preview.
10. Comprueba publicación.
11. Comprueba expiración.
12. Comprueba navegación móvil.
13. Comprueba buscador.
14. Comprueba enlaces clave.
15. Ejecuta tests.
16. Ejecuta build.
17. Corrige warnings importantes.
18. Revisa accesibilidad.
19. Haz QA visual completo.
20. Haz push final.

---

# 56. REPORTE FINAL QUE DEBES DARME

Al acabar, responde con:

## A. Resultado
Qué has construido.

## B. URLs
- repositorio;
- preview local;
- URL del servidor propio si ya está desplegada;
- `/admin`.

## C. Acceso admin
Explica cómo crear/configurar el usuario.

NO publiques contraseñas en Git.

## D. Contenido
Qué información de `jaca.es` se ha migrado.

## E. Fuentes
Qué fuentes oficiales se han utilizado.

## F. Pendientes
Qué necesitaría validación del Ayuntamiento antes de ser una web oficial.

## G. Mantenimiento semanal
Explícame en 10 pasos cómo actualizarla.

## H. Comandos
Dame los comandos exactos para volver a abrir el proyecto otro día en Windows PowerShell.

Ejemplo esperado:

```powershell
cd <ruta-del-proyecto>
npm install
npm run dev
```

Adáptalo a la ruta real.

## I. Estado técnico
Resultado de:
- lint;
- typecheck;
- tests;
- build.

---

# 57. CRITERIO DE FINALIZACIÓN

No me preguntes por decisiones menores de diseño o implementación.

Toma decisiones profesionales basadas en estas instrucciones.

Solo detente para pedir intervención si existe un bloqueo que realmente requiere acción humana, por ejemplo:

- login de GitHub;
- autorización Vercel;
- credencial externa;
- acceso que no posees.

En esos casos:

1. termina primero todo lo demás que puedas;
2. explícame exactamente qué acción tengo que hacer;
3. no abandones el proyecto a mitad.

---

# 58. PRIMERA ACCIÓN

Empieza ahora por:

1. comprobar el estado del repositorio;
2. analizar `jaca.es`;
3. crear `docs/discovery.md`;
4. crear `docs/design-system.md`;
5. definir arquitectura técnica;
6. y después comienza la implementación.

No empieces escribiendo una home genérica.

El objetivo es construir una propuesta municipal real, moderna y demostrable.
