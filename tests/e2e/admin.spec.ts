import { expect, test, type Page } from "@playwright/test";
import { E2E_ADMIN } from "../../playwright.config";

async function login(page: Page) {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByLabel("Correo electrónico").fill(E2E_ADMIN.email);
  await page.getByLabel("Contraseña").fill(E2E_ADMIN.password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Esta semana" })).toBeVisible();
}

test.describe("panel de administración", () => {
  test("rechaza credenciales incorrectas y protege el panel", async ({ page, request }) => {
    const r = await request.get("/admin/noticias", { maxRedirects: 0 });
    expect([302, 303, 307, 200]).toContain(r.status());
    await page.goto("/admin/noticias");
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.getByLabel("Correo electrónico").fill(E2E_ADMIN.email);
    await page.getByLabel("Contraseña").fill("incorrecta");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.locator("#login-error")).toContainText("incorrectos");
  });

  test("6-10. entra, crea un evento, guarda borrador, publica y aparece en la web", async ({ page }) => {
    await login(page);
    await page.getByRole("link", { name: "Agenda" }).first().click();
    await page.getByRole("link", { name: "Añadir evento" }).click();
    const title = `Concierto E2E ${Date.now()}`;
    await page.getByLabel("Nombre del evento").fill(title);
    const d = new Date(Date.now() + 2 * 86400000);
    const local = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T19:00`;
    await page.getByLabel("Fecha de inicio").fill(local);
    await page.getByLabel("Descripción").fill("Concierto creado por la prueba automática.");
    await page.getByLabel("Lugar").fill("Palacio de Congresos");
    await page.getByRole("button", { name: "Guardar borrador" }).click();
    await expect(page.getByText("Borrador guardado.")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/agenda\/c/);

    // Borrador no visible en la web
    const slug = title.toLowerCase().replace(/ /g, "-");
    expect((await page.request.get(`/agenda/${slug}`)).status()).toBe(404);

    // Previsualización (privada)
    const [preview] = await Promise.all([page.waitForEvent("popup"), page.getByRole("link", { name: "Previsualizar" }).click()]);
    await expect(preview.getByText("Vista previa — este contenido aún no es público")).toBeVisible();
    await preview.close();

    await page.getByRole("button", { name: "Publicar", exact: true }).click();
    await expect(page.getByText("Publicado. Ya es visible en la web.")).toBeVisible();
    await page.goto("/agenda");
    await expect(page.getByRole("link", { name: title })).toBeVisible();
  });

  test("formulario semanal: aviso + noticia, confirmación y publicación", async ({ page }) => {
    await login(page);
    await page.getByRole("link", { name: "Actualización semanal" }).first().click();
    await page.getByRole("button", { name: /Empezar la actualización/ }).click();
    await expect(page.getByRole("heading", { name: "Semana", exact: true })).toBeVisible();

    await page.getByRole("button", { name: /Siguiente: Avisos/ }).click();
    await page.getByRole("button", { name: "Añadir aviso" }).click();
    await page.getByLabel("Título").fill("Aviso E2E: cierre temporal");
    await page.getByLabel("Descripción corta").fill("Cierre de prueba durante la mañana.");

    await page.getByRole("button", { name: /Siguiente: Noticias/ }).click();
    await page.getByRole("button", { name: "Añadir noticia" }).click();
    await page.getByLabel("Titular").fill("Noticia E2E semanal");
    await page.getByLabel("Entradilla").fill("Entradilla de la noticia semanal.");

    await page.getByRole("navigation", { name: "Pasos de la actualización semanal" }).getByRole("button", { name: /Revisión y publicación/ }).click();
    await page.getByRole("button", { name: "Publicar cambios" }).click();
    const dialog = page.getByRole("dialog", { name: "Confirmar publicación" });
    await expect(dialog).toContainText("Estás a punto de actualizar 1 noticias, 0 eventos y 1 avisos");
    await dialog.getByRole("button", { name: "Publicar ahora" }).click();
    await expect(page.getByRole("heading", { name: "Cambios publicados" })).toBeVisible();

    await page.goto("/avisos");
    await expect(page.getByText("Aviso E2E: cierre temporal")).toBeVisible();
    await page.goto("/actualidad/noticias");
    await expect(page.getByRole("link", { name: "Noticia E2E semanal" })).toBeVisible();
  });
});
