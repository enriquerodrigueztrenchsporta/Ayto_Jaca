import { describe, expect, it } from "vitest";
import { detectType, resolveUploadPath, validateUpload, UploadError, imageSize } from "@/lib/uploads";
import { renderMarkdown } from "@/lib/markdown";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";

const PNG = Buffer.from("89504e470d0a1a0a0000000d49484452000000100000000808060000", "hex");
const PDF = Buffer.from("%PDF-1.7\n%âãÏÓ\n", "latin1");
const HTML = Buffer.from("<html><script>alert(1)</script></html>");

describe("subida de archivos", () => {
  it("detecta el tipo por firma binaria", () => {
    expect(detectType(PNG)?.mime).toBe("image/png");
    expect(detectType(PDF)?.mime).toBe("application/pdf");
    expect(detectType(HTML)).toBeNull();
  });
  it("rechaza archivos disfrazados", () => {
    expect(() => validateUpload(HTML, "image/png")).toThrow(UploadError);
    expect(() => validateUpload(PDF, "image/png")).toThrow(/no coincide/);
  });
  it("rechaza archivos demasiado grandes", () => {
    const big = Buffer.concat([PDF, Buffer.alloc(16 * 1024 * 1024)]);
    expect(() => validateUpload(big, "application/pdf")).toThrow(/tamaño máximo/);
  });
  it("impide path traversal", () => {
    expect(resolveUploadPath(["..", "..", "etc", "passwd"])).toBeNull();
    expect(resolveUploadPath(["2026", "09", "a1b2.pdf"])).toMatch(/a1b2\.pdf$/);
  });
  it("lee dimensiones de PNG", () => {
    expect(imageSize(PNG)).toEqual({ width: 16, height: 8 });
  });
});

describe("markdown saneado (XSS)", () => {
  it("elimina scripts, manejadores y esquemas peligrosos", () => {
    const html = renderMarkdown('Hola <script>alert(1)</script> <img src=x onerror=alert(1)> [x](javascript:alert(1)) <a href="https://jaca.es" onclick="x()">ok</a>');
    expect(html).not.toMatch(/script|onerror|javascript:|onclick|<img/i);
    expect(html).toContain('href="https://jaca.es"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
  it("mantiene formato básico", () => {
    expect(renderMarkdown("**negrita**\n\n- uno")).toContain("<strong>negrita</strong>");
  });
});

describe("límite de peticiones", () => {
  it("bloquea tras superar el límite y se recupera tras la ventana", () => {
    resetRateLimit();
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(rateLimit("k", 5, 1000, t + i).ok).toBe(true);
    expect(rateLimit("k", 5, 1000, t + 10).ok).toBe(false);
    expect(rateLimit("k", 5, 1000, t + 2000).ok).toBe(true);
  });
});
