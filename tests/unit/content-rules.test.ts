import { describe, expect, it } from "vitest";
import { effectiveStatus, isVisible, publishedWhere, statusOnPublish } from "@/lib/content/visibility";
import { nextOccurrence, occursBetween } from "@/lib/content/events";
import { madridDate, toDateInput } from "@/lib/dates";

const now = madridDate(2026, 9, 30, 12, 0);
const past = madridDate(2026, 9, 1);
const future = madridDate(2026, 12, 1);

describe("publicación y caducidad", () => {
  it("un borrador nunca es visible", () => {
    expect(isVisible({ status: "DRAFT", publishAt: null, expiresAt: null }, now)).toBe(false);
  });
  it("programado con fecha futura no es visible; al llegar la fecha sí", () => {
    const item = { status: "SCHEDULED" as const, publishAt: future, expiresAt: null };
    expect(effectiveStatus(item, now)).toBe("SCHEDULED");
    expect(effectiveStatus(item, madridDate(2026, 12, 2))).toBe("PUBLISHED");
  });
  it("caduca automáticamente al pasar expiresAt", () => {
    const item = { status: "PUBLISHED" as const, publishAt: past, expiresAt: madridDate(2026, 9, 29) };
    expect(effectiveStatus(item, now)).toBe("ARCHIVED");
    expect(isVisible(item, now)).toBe(false);
  });
  it("publicar con fecha futura programa", () => {
    expect(statusOnPublish(future, now)).toBe("SCHEDULED");
    expect(statusOnPublish(null, now)).toBe("PUBLISHED");
    expect(statusOnPublish(past, now)).toBe("PUBLISHED");
  });
  it("el filtro Prisma incluye publicación y caducidad", () => {
    const w = publishedWhere(now);
    expect(w.status.in).toEqual(["PUBLISHED", "SCHEDULED"]);
    expect(JSON.stringify(w.AND)).toContain("publishAt");
    expect(JSON.stringify(w.AND)).toContain("expiresAt");
  });
});

describe("agenda", () => {
  it("evento pasado no tiene próxima fecha", () => {
    expect(nextOccurrence({ startDate: madridDate(2026, 9, 26, 10), endDate: null, recurrence: "NONE", recurrenceEnd: null }, now)).toBeNull();
  });
  it("exposición en curso aparece hoy", () => {
    const e = { startDate: madridDate(2026, 9, 24), endDate: madridDate(2026, 11, 8), recurrence: "NONE" as const, recurrenceEnd: null };
    expect(toDateInput(nextOccurrence(e, now))).toBe("2026-09-30");
    expect(occursBetween(e, madridDate(2026, 10, 2), madridDate(2026, 10, 4, 23))).toBe(true);
  });
  it("evento semanal calcula la siguiente repetición", () => {
    const e = { startDate: madridDate(2026, 9, 5, 11), endDate: null, recurrence: "WEEKLY" as const, recurrenceEnd: madridDate(2026, 10, 31) };
    expect(toDateInput(nextOccurrence(e, now))).toBe("2026-10-03");
    expect(nextOccurrence({ ...e, recurrenceEnd: madridDate(2026, 9, 20) }, now)).toBeNull();
  });
});
