import { normalize } from "@/lib/text";

const STOPWORDS = new Set(
  "a al algo como con cual de del donde el en es esta este hacer la las lo los me mi mis necesito para por puedo que quiero se sobre su sus un una uno y o tengo como quiero hay ver saber cuando".split(" "),
);

/**
 * Sinónimos y lenguaje natural → términos presentes en los contenidos.
 * La clave es un prefijo normalizado; si un término de la consulta empieza por ella,
 * se añaden los términos asociados.
 */
export const SYNONYMS: Record<string, string[]> = {
  empadron: ["padron", "empadronamiento"],
  padron: ["padron", "empadronamiento"],
  censo: ["padron"],
  mudanza: ["padron", "domicilio"],
  volante: ["certificado", "padron"],
  certific: ["certificado"],
  tasa: ["tasa", "tributo", "ordenanza fiscal", "pago"],
  pagar: ["pago", "domiciliacion", "tasa", "recibo"],
  pago: ["pago", "domiciliacion", "recibo"],
  recibo: ["recibo", "domiciliacion"],
  impuesto: ["impuesto", "tributo", "ibi", "iivtnu", "plusvalia"],
  ibi: ["ibi", "bonificacion", "bienes inmuebles"],
  bonific: ["bonificacion"],
  plusval: ["plusvalia", "iivtnu"],
  devol: ["devolucion", "ingresos indebidos"],
  obra: ["obra", "urbanistica", "licencia", "comunicacion previa"],
  reforma: ["obra", "urbanistica", "comunicacion previa"],
  licencia: ["licencia", "autorizacion"],
  construir: ["obra", "licencia", "urbanistica"],
  urbanis: ["urbanismo", "urbanistica", "obra"],
  instancia: ["instancia general", "registro"],
  registro: ["instancia general", "registro"],
  solicitud: ["instancia", "solicitud"],
  queja: ["reclamaciones", "quejas", "sugerencias"],
  reclam: ["reclamaciones", "quejas"],
  sugeren: ["sugerencias", "reclamaciones"],
  subvenc: ["subvencion", "ayuda", "convocatoria"],
  ayuda: ["ayuda", "subvencion"],
  beca: ["beca", "ayuda", "subvencion"],
  factura: ["factura electronica", "facturas", "proveedor"],
  proveedor: ["factura", "ficha de terceros", "contratacion"],
  empleo: ["empleo", "convocatoria", "plaza", "oposicion", "proceso selectivo"],
  trabajo: ["empleo", "plaza", "oposicion"],
  oposic: ["oposicion", "plaza", "proceso selectivo"],
  terraza: ["terrazas", "via publica"],
  calle: ["via publica"],
  nicho: ["funerario", "cementerio", "nichos"],
  cementer: ["funerario", "nichos", "cementerio"],
  difunt: ["funerario", "defuncion"],
  negocio: ["actividad", "licencia de actividad", "declaracion responsable"],
  abrir: ["actividad", "apertura"],
  tienda: ["actividad", "comercio"],
  bar: ["actividad", "terrazas"],
  multa: ["denuncias de trafico", "policia local"],
  accidente: ["atestado", "policia local"],
  grua: ["grua", "policia local"],
  policia: ["policia local"],
  bus: ["autobus", "transporte urbano"],
  autobus: ["autobus", "transporte urbano"],
  aparcar: ["estacionamiento", "zonas peatonales"],
  basura: ["residuos", "recogida"],
  reciclaje: ["residuos", "vidrio", "reciclaje"],
  agua: ["agua", "contadores", "abastecimiento"],
  pleno: ["pleno", "sesion"],
  concejal: ["corporacion", "concejal"],
  alcalde: ["alcalde", "corporacion"],
  transparen: ["transparencia", "informacion publica"],
  contrato: ["contratacion", "perfil del contratante", "licitacion"],
  licitac: ["contratacion", "licitacion"],
  turism: ["turismo", "oficina de turismo"],
  museo: ["museo", "monumentos"],
  musica: ["escuela de musica", "musica"],
  guarder: ["escuela infantil", "cervatillos"],
  bebe: ["escuela infantil", "musica para bebes"],
  arma: ["tarjeta de armas"],
  datos: ["proteccion de datos"],
  accesib: ["accesibilidad"],
  notific: ["notificaciones"],
};

export function parseQuery(query: string): { terms: string[]; expanded: string[] } {
  const norm = normalize(query);
  const terms = norm
    .split(" ")
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t))
    .slice(0, 8);
  const expanded = new Set<string>();
  for (const t of terms) {
    expanded.add(t);
    // Raíz simple para plurales y formas verbales frecuentes.
    if (t.length > 5) expanded.add(t.replace(/(es|s|ar|er|ir|arme|erme|irme|cion|ciones)$/, ""));
    for (const [prefix, words] of Object.entries(SYNONYMS)) {
      if (t.startsWith(prefix)) words.forEach((w) => expanded.add(normalize(w)));
    }
  }
  return { terms, expanded: [...expanded].filter((t) => t.length >= 2) };
}

/** Puntuación: coincidencias en título pesan más; frase completa suma. */
export function scoreText(title: string, body: string, terms: string[], expanded: string[], phrase: string): number {
  const t = normalize(title);
  const b = body;
  let score = 0;
  if (phrase && t.includes(phrase)) score += 12;
  for (const term of expanded) {
    const original = terms.includes(term);
    if (t.includes(term)) score += original ? 6 : 4;
    else if (b.includes(term)) score += original ? 3 : 1;
  }
  if (terms.length && terms.every((term) => t.includes(term))) score += 5;
  return score;
}
