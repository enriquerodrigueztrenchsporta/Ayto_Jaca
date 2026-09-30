/** Normaliza texto para búsqueda: minúsculas, sin tildes ni signos, espacios simples. */
export function normalize(input: string | null | undefined): string {
  return (input ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Construye el campo `searchText` a partir de varios fragmentos. */
export function buildSearchText(...parts: Array<string | null | undefined | string[]>): string {
  return normalize(parts.flat().filter(Boolean).join(" ")).slice(0, 20000);
}

export function slugify(input: string, maxLength = 90): string {
  const s = normalize(input).replace(/ñ/g, "n").replace(/\s+/g, "-").replace(/-+/g, "-");
  return s.slice(0, maxLength).replace(/-+$/, "") || "contenido";
}

/** Recorta texto plano a una longitud máxima sin partir palabras. */
export function truncate(text: string, max = 180): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const atBoundary = clean[max] === " ";
  return (atBoundary ? cut : cut.slice(0, cut.lastIndexOf(" "))).replace(/[,.;:]$/, "") + "…";
}

/** Quita marcas de markdown básicas para extractos. */
export function stripMarkdown(md: string): string {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatBytes(bytes?: number | null): string | null {
  if (!bytes || bytes <= 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}
