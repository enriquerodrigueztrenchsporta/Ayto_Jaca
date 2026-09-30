import { expect, test } from "@playwright/test";

test.describe("web pública", () => {
  test("1. la portada responde a qué hacer, qué pasa y cómo contactar", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Ayuntamiento de Jaca/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Jaca");
    await expect(page.getByRole("combobox", { name: "¿Qué necesitas hacer?" })).toBeVisible();
    await expect(page.getByText("Propuesta de rediseño — demo no oficial")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Avisos importantes" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Actualidad" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Agenda", exact: true })).toBeVisible();
    await expect(page.getByRole("contentinfo").getByText("974 355 758")).toBeVisible();
  });

  test("2. navegación principal (menú de escritorio o móvil)", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) {
      await page.getByRole("button", { name: "Menú" }).click();
      const dialog = page.getByRole("dialog", { name: "Menú principal" });
      await dialog.getByRole("button", { name: "Ayuntamiento" }).click();
      await dialog.getByRole("link", { name: "Corporación municipal" }).click();
    } else {
      const nav = page.getByRole("navigation", { name: "Menú principal" });
      await nav.getByRole("button", { name: "Ayuntamiento" }).click();
      await nav.getByRole("link", { name: "Corporación municipal" }).click();
    }
    await expect(page).toHaveURL(/\/ayuntamiento\/corporacion$/);
    await expect(page.getByRole("heading", { level: 1, name: "Corporación municipal" })).toBeVisible();
    await expect(page.getByText("Carlos Serrano Pérez")).toBeVisible();
  });

  test("3. Caso A: «empadronarme» llega al trámite en dos pasos", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("combobox", { name: "¿Qué necesitas hacer?" }).fill("empadronarme");
    await page.getByRole("combobox", { name: "¿Qué necesitas hacer?" }).press("Enter");
    await expect(page).toHaveURL(/\/buscar\?q=empadronarme/);
    await page.getByRole("link", { name: /Alta en el padrón municipal/ }).first().click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Alta en el padrón");
    const sede = page.getByRole("link", { name: /Hacer el trámite en la Sede/ });
    await expect(sede).toHaveAttribute("href", /jaca\.sedipualba\.es\/carpetaciudadana\/tramite\.aspx\?idtramite=28441/);
    await expect(page.getByRole("heading", { name: "Documentación necesaria" })).toBeVisible();
  });

  test("4. abre una noticia", async ({ page }) => {
    await page.goto("/actualidad/noticias");
    await page.getByRole("link", { name: /FORTIUM/ }).first().click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("FORTIUM");
    await expect(page.getByText(/Fuente oficial/)).toBeVisible();
  });

  test("5. Caso B: consulta la agenda y un evento", async ({ page }) => {
    await page.goto("/agenda");
    await page.getByRole("link", { name: "Próximos 30 días" }).click();
    await expect(page).toHaveURL(/cuando=mes/);
    await page.getByRole("link", { name: /Mujeres ignoradas/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Mujeres ignoradas");
    await expect(page.getByText("Ciudadela de Jaca").first()).toBeVisible();
  });

  test("Caso C: subvenciones abiertas filtrables", async ({ page }) => {
    await page.goto("/convocatorias?estado=abierta");
    await expect(page.getByRole("link", { name: "Abiertas", exact: false })).toHaveAttribute("aria-current", "true");
    await expect(page.getByRole("main").getByText("Abierta", { exact: true }).first()).toBeVisible();
  });

  test("Caso D y E: último pleno y contacto con Urbanismo", async ({ page }) => {
    await page.goto("/plenos");
    await expect(page.getByRole("heading", { name: "Último pleno" })).toBeVisible();
    await expect(page.getByText("22 de septiembre de 2026").first()).toBeVisible();
    await page.goto("/ayuntamiento/areas/urbanismo");
    await expect(page.getByRole("link", { name: "obrasurbanismo@aytojaca.es" }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Trámites de esta área" })).toBeVisible();
  });

  test("404 útil con buscador y accesos", async ({ page }) => {
    const res = await page.goto("/esta-pagina-no-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "No encontramos esta página" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Trámites" }).last()).toBeVisible();
  });

  test("SEO técnico: robots, sitemap y healthcheck", async ({ request }) => {
    expect((await request.get("/sitemap.xml")).status()).toBe(200);
    expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
    const health = await (await request.get("/api/health")).json();
    expect(health).toMatchObject({ status: "ok", app: "ok", database: "ok" });
  });
});
