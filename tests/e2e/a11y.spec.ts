import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** Pruebas automáticas de accesibilidad (axe-core, reglas WCAG 2.x A/AA). No sustituyen una auditoría manual. */
const PAGES = ["/", "/tramites", "/tramites/alta-en-el-padron", "/agenda", "/actualidad/noticias", "/avisos", "/convocatorias", "/contacto", "/turismo", "/ciudad/movilidad", "/accesibilidad", "/admin/login"];

for (const path of PAGES) {
  test(`sin infracciones graves de accesibilidad en ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")})`)).toEqual([]);
  });
}

test("navegación por teclado: enlace para saltar al contenido", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Saltar al contenido principal" });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page).toHaveURL(/#contenido$/);
});
