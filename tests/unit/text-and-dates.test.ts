import { describe, expect, it } from "vitest";
import { buildSearchText, formatBytes, normalize, slugify, truncate } from "@/lib/text";
import { addDays, formatDate, madridDate, parseLocalInput, startOfDay, startOfWeek, toDateInput, toDateTimeInput, weekendRange } from "@/lib/dates";

describe("text", () => {
  it("normaliza tildes, mayúsculas y signos", () => {
    expect(normalize("¿Bonificación del IBI?")).toBe("bonificacion del ibi");
    expect(normalize("  Peña   Oroel ")).toBe("pena oroel");
  });
  it("genera slugs seguros", () => {
    expect(slugify("Pleno ordinario 22 de septiembre")).toBe("pleno-ordinario-22-de-septiembre");
    expect(slugify("Peña Oroel & Ñandú")).toBe("pena-oroel-nandu");
    expect(slugify("!!!")).toBe("contenido");
  });
  it("construye texto de búsqueda con arrays", () => {
    expect(buildSearchText("Alta en el padrón", ["mudanza", "Empadronarme"], null)).toBe("alta en el padron mudanza empadronarme");
  });
  it("recorta sin partir palabras", () => {
    expect(truncate("uno dos tres cuatro cinco", 12)).toBe("uno dos tres…");
  });
  it("formatea tamaños", () => {
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(1572864)).toBe("1,5 MB");
    expect(formatBytes(0)).toBeNull();
  });
});

describe("dates (Europe/Madrid)", () => {
  it("interpreta fechas locales en horario de verano e invierno", () => {
    expect(madridDate(2026, 9, 22, 9, 30).toISOString()).toBe("2026-09-22T07:30:00.000Z");
    expect(madridDate(2026, 1, 20, 9, 30).toISOString()).toBe("2026-01-20T08:30:00.000Z");
  });
  it("ida y vuelta entre inputs y fechas", () => {
    const d = parseLocalInput("2026-10-01T20:15")!;
    expect(toDateTimeInput(d)).toBe("2026-10-01T20:15");
    expect(toDateInput(parseLocalInput("2026-12-31"))).toBe("2026-12-31");
    expect(parseLocalInput("2026-02-30x")).toBeNull();
  });
  it("fin del día al interpretar fechas límite", () => {
    const end = parseLocalInput("2026-11-30", "end")!;
    expect(toDateTimeInput(end)).toBe("2026-11-30T23:59");
  });
  it("calcula inicio de día y de semana", () => {
    const wed = madridDate(2026, 9, 30, 18, 0);
    expect(startOfDay(wed).toISOString()).toBe("2026-09-29T22:00:00.000Z");
    expect(toDateInput(startOfWeek(wed))).toBe("2026-09-28");
    expect(toDateInput(addDays(wed, 3))).toBe("2026-10-03");
  });
  it("fin de semana: viernes a domingo", () => {
    const { from, to } = weekendRange(madridDate(2026, 9, 30, 12, 0));
    expect(toDateInput(from)).toBe("2026-10-02");
    expect(toDateInput(to)).toBe("2026-10-04");
    const sat = weekendRange(madridDate(2026, 10, 3, 12, 0));
    expect(toDateInput(sat.from)).toBe("2026-10-03");
  });
  it("formatea en español", () => {
    expect(formatDate(madridDate(2026, 9, 22), "long")).toBe("martes, 22 de septiembre de 2026");
  });
});
