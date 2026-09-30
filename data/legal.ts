/**
 * Textos legales BASE de la propuesta. No constituyen asesoramiento jurídico.
 * Todo dato no facilitado por el Ayuntamiento figura como [PENDIENTE DE VALIDACIÓN POR EL AYUNTAMIENTO].
 */
const P = "**[PENDIENTE DE VALIDACIÓN POR EL AYUNTAMIENTO]**";

export const LEGAL: Record<string, { title: string; intro: string; body: string }> = {
  accesibilidad: {
    title: "Declaración de accesibilidad",
    intro: "Declaración de DEMOSTRACIÓN. Esta web es una propuesta de rediseño y no ha sido objeto de una auditoría oficial de accesibilidad.",
    body: `> **Aviso importante:** esta declaración es un **modelo de demostración**. No afirma el cumplimiento legal auditado. Antes de publicarse como web oficial deberá realizarse una revisión conforme a la metodología del Observatorio de Accesibilidad Web y actualizar esta declaración.

El Ayuntamiento de Jaca se compromete a hacer accesible su sitio web de conformidad con el **Real Decreto 1112/2018, de 7 de septiembre**, sobre accesibilidad de los sitios web y aplicaciones para dispositivos móviles del sector público, que transpone la Directiva (UE) 2016/2102.

La presente declaración se aplica a la propuesta de nueva web municipal.

## Situación de cumplimiento

Objetivo de diseño: **WCAG 2.2 nivel AA** y la norma **UNE-EN 301 549**. Estado verificado: **no auditado** ${P}.

Medidas aplicadas en el diseño y desarrollo de esta propuesta:

- Navegación completa por teclado, foco siempre visible y enlace para saltar al contenido.
- Estructura semántica con encabezados jerárquicos y regiones (cabecera, navegación, contenido, pie).
- Contraste de color validado (mínimo 4,5:1 en texto) y estados comunicados con texto e icono, no solo con color.
- Textos alternativos en imágenes informativas; imágenes decorativas ocultas a lectores de pantalla.
- Formularios con etiquetas visibles, ayudas y mensajes de error asociados.
- Respeto de la preferencia del sistema de reducir el movimiento.
- Zonas táctiles de al menos 44 × 44 píxeles.
- Tablas con encabezados y títulos accesibles.
- Pruebas automáticas con axe-core en cada versión (ver repositorio).

## Contenido no accesible conocido

- Algunos documentos PDF enlazados alojados en la web oficial pueden no ser accesibles. Se prioriza ofrecer su contenido esencial en HTML.
- Servicios externos (Sede Electrónica, Plataforma de Contratación, YouTube) tienen su propia declaración de accesibilidad.

## Preparación de la presente declaración

Fecha de elaboración: ${P}. Método: autoevaluación del equipo de desarrollo (propuesta).

## Observaciones y datos de contacto

Puede comunicar problemas de accesibilidad o solicitar información en formato accesible mediante el trámite [Solicitud de información accesible y quejas](/tramites/informacion-accesible-y-quejas) de la Sede Electrónica.

## Procedimiento de reclamación

Si una solicitud de información accesible o una queja no ha sido atendida, puede presentar una [Reclamación ante la Unidad de Accesibilidad](/tramites/reclamacion-unidad-de-accesibilidad).

Unidad responsable de accesibilidad: ${P}.`,
  },
  "aviso-legal": {
    title: "Aviso legal",
    intro: "Condiciones de uso de la propuesta de web municipal. Texto base pendiente de validación jurídica.",
    body: `> Esta página es una **plantilla de demostración**. No contiene información jurídica validada.

## Titular del sitio web

- Denominación: Ayuntamiento de Jaca
- NIF: P2217800H (según la Sede Electrónica municipal)
- Dirección: Calle Mayor, 24 · 22700 Jaca (Huesca)
- Teléfono: 974 355 758
- Correo electrónico de contacto: ${P}

## Objeto

Este sitio web ofrece información de interés general sobre el municipio y los servicios municipales. Los trámites con efectos jurídicos se realizan exclusivamente en la **Sede Electrónica** del Ayuntamiento.

## Propiedad intelectual

Los textos institucionales pueden reutilizarse citando la fuente, salvo indicación en contrario. Las fotografías indican su autoría y licencia en [Créditos fotográficos](/creditos). Condiciones de reutilización: ${P}.

## Responsabilidad

En caso de discrepancia entre la información de esta web y la publicada en diarios oficiales o en la Sede Electrónica, prevalece esta última. Régimen de responsabilidad: ${P}.

## Enlaces externos

Esta web enlaza a sitios de otras administraciones y entidades, identificados con un icono. El Ayuntamiento no es responsable de su contenido.

## Legislación aplicable

${P}`,
  },
  privacidad: {
    title: "Política de privacidad",
    intro: "Información sobre el tratamiento de datos personales en esta web. Texto base pendiente de validación por el Ayuntamiento y su Delegado/a de Protección de Datos.",
    body: `> Esta página es una **plantilla de demostración**. Las finalidades, bases jurídicas y plazos deben ser definidos y validados por el Ayuntamiento.

## Responsable del tratamiento

Ayuntamiento de Jaca · Calle Mayor, 24 · 22700 Jaca (Huesca).
Delegado/a de Protección de Datos: ${P}.

## Qué datos trata esta web

- **Navegación:** la web no utiliza herramientas de analítica ni publicidad. El servidor puede registrar datos técnicos (dirección IP, fecha, página solicitada) con fines de seguridad durante un plazo de ${P}.
- **Formulario de avisos por correo:** en esta demostración **no se almacena ningún dato**.
- **Panel de administración:** solo se tratan los datos de las personas usuarias autorizadas (nombre, correo, registro de actividad) para garantizar la seguridad y trazabilidad de los cambios.
- **Trámites:** los datos de los trámites se tratan en la Sede Electrónica, que dispone de su propia información de protección de datos.

## Base jurídica, destinatarios y plazos

${P}

## Derechos

Puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad mediante el trámite [Ejercicio de derechos de protección de datos](/tramites/proteccion-de-datos), y reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).`,
  },
  cookies: {
    title: "Política de cookies",
    intro: "Esta web solo utiliza cookies técnicas estrictamente necesarias. Por eso no muestra un banner de consentimiento.",
    body: `## Qué cookies usamos

| Cookie | Finalidad | Tipo | Duración |
|---|---|---|---|
| \`authjs.session-token\` (o \`__Secure-authjs.session-token\`) | Mantener la sesión de las personas que administran el contenido. Solo se crea al iniciar sesión en el panel privado. | Técnica, propia, necesaria | 8 horas |
| \`authjs.csrf-token\` | Proteger el inicio de sesión frente a falsificación de peticiones | Técnica, propia, necesaria | Sesión |
| \`authjs.callback-url\` | Redirigir tras el inicio de sesión | Técnica, propia, necesaria | Sesión |

Las personas que visitan la web pública **no reciben ninguna cookie**.

## Analítica

Esta web **no utiliza Google Analytics** ni otras herramientas de analítica o publicidad. Si en el futuro se incorpora una analítica respetuosa con la privacidad, se solicitará el consentimiento previo cuando sea necesario y se actualizará esta política.

## Servicios externos

Al pulsar enlaces a servicios externos (YouTube, Sede Electrónica, Plataforma de Contratación, visitjaca.es…) se aplican las políticas de cookies de esos sitios.

Fecha de la última revisión: ${P}.`,
  },
};
