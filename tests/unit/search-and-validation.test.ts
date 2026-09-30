import { describe, expect, it } from "vitest";
import { parseQuery, scoreText } from "@/lib/search/query";
import { formSchema } from "@/lib/admin/schema";
import { RESOURCES } from "@/lib/admin/resources";
import { normalize } from "@/lib/text";

describe("búsqueda en lenguaje natural", () => {
  it.each([
    ["empadronarme", "padron"],
    ["pagar una tasa", "domiciliacion"],
    ["licencia de obra", "urbanistica"],
    ["bonificación IBI", "bonificacion"],
    ["presentar una instancia", "instancia general"],
    ["quiero una subvención", "ayuda"],
    ["factura electrónica", "factura electronica"],
  ])("«%s» se expande con «%s»", (q, expected) => {
    expect(parseQuery(q).expanded).toContain(expected);
  });
  it("elimina palabras vacías", () => {
    expect(parseQuery("quiero hacer una instancia").terms).toEqual(["instancia"]);
  });
  it("puntúa más las coincidencias en el título", () => {
    const { terms, expanded } = parseQuery("empadronarme");
    const alta = scoreText("Alta en el padrón municipal (empadronarse)", normalize("empadronarme mudanza padron"), terms, expanded, "empadronarme");
    const otro = scoreText("Bonificación de tasas de agua y padrón múltiple", normalize("agua padron multiple"), terms, expanded, "empadronarme");
    expect(alta).toBeGreaterThan(otro);
  });
});

describe("validación de formularios del panel (Zod)", () => {
  const news = formSchema(RESOURCES.noticias);
  const base = { ...Object.fromEntries(RESOURCES.noticias.fields.map((f) => [f.name, f.type === "checkbox" ? false : ["documents", "links"].includes(f.type) ? [] : ""])) };

  it("exige titular, entradilla y fecha", () => {
    const r = news.safeParse(base);
    expect(r.success).toBe(false);
    const paths = r.error!.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["title", "excerpt", "date"]));
  });
  it("acepta una noticia válida", () => {
    expect(news.safeParse({ ...base, title: "Título", excerpt: "Resumen", date: "2026-09-30T10:00" }).success).toBe(true);
  });
  it("rechaza enlaces inseguros y fechas incoherentes", () => {
    const r = news.safeParse({ ...base, title: "T", excerpt: "E", date: "2026-09-30T10:00", sourceUrl: "javascript:alert(1)", publishAt: "2026-10-10T10:00", expiresAt: "2026-10-01T10:00" });
    expect(r.success).toBe(false);
    const paths = r.error!.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["sourceUrl", "expiresAt"]));
  });
  it("valida documentos adjuntos", () => {
    const r = news.safeParse({ ...base, title: "T", excerpt: "E", date: "2026-09-30T10:00", documents: [{ title: "", url: "ftp://x" }] });
    expect(r.success).toBe(false);
  });
  it("aviso: la fecha de fin no puede ser anterior al inicio", () => {
    const alerts = formSchema(RESOURCES.avisos);
    const v = Object.fromEntries(RESOURCES.avisos.fields.map((f) => [f.name, f.type === "checkbox" ? false : f.type === "documents" ? [] : ""]));
    const r = alerts.safeParse({ ...v, title: "Corte", summary: "S", priority: "URGENT", kind: "CORTE", startsAt: "2026-10-05T08:00", endsAt: "2026-10-04T08:00" });
    expect(r.success).toBe(false);
  });
});
