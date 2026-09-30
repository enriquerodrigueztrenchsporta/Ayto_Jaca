import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { dbAvailable, inDays } from "./helpers";

const available = await dbAvailable();

describe.skipIf(!available)("formulario de actualización semanal (BD real)", async () => {
  const { db } = await import("@/lib/db");
  const { ValidationError } = await import("@/lib/admin/service");
  const { createWeeklyUpdate, newItem, publishWeekly, saveWeeklyDraft, weeklySummary, saveChecklist } = await import("@/lib/weekly/service");
  const { getNews, listActiveAlerts, listUpcomingEvents } = await import("@/lib/queries/public");
  let actor: { id: string; email: string };

  beforeAll(async () => {
    const u = await db.user.upsert({ where: { email: "weekly@example.org" }, update: {}, create: { email: "weekly@example.org", name: "Semanal", passwordHash: "x", role: "EDITOR" } });
    actor = { id: u.id, email: u.email };
  });
  afterAll(() => db.$disconnect());

  it("guarda borrador, informa de errores por campo y publica todo de una vez", async () => {
    const w = await createWeeklyUpdate(actor);
    const payload = (await db.weeklyUpdate.findUniqueOrThrow({ where: { id: w.id } })).payload as never as Parameters<typeof saveWeeklyDraft>[1];

    // 1) Borrador con un error: noticia sin entradilla
    payload.news = [{ ...newItem("news"), title: "Noticia semanal", excerpt: "" }];
    payload.alerts = [{ ...newItem("alerts"), title: "Aviso semanal", summary: "Resumen del aviso", endsAt: inDays(5) }];
    payload.events = [{ ...newItem("events"), title: "Evento semanal", description: "Descripción", startDate: inDays(4), featured: true }];
    payload.mobility = [{ ...newItem("mobility"), title: "Corte calle Mayor (test)", summary: "Corte por obras", zone: "Calle Mayor", affectation: "Corte total", alternative: "Desvío", endsAt: inDays(3) }];
    const err = await saveWeeklyDraft(w.id, payload, actor).catch((e) => e);
    expect(err).toBeInstanceOf(ValidationError);
    expect(Object.keys((err as InstanceType<typeof ValidationError>).issues)).toContain("news.0.excerpt");

    // 2) Corrige y guarda: se crean borradores vinculados, no visibles
    payload.news[0].excerpt = "Entradilla corregida";
    const saved = await saveWeeklyDraft(w.id, payload, actor);
    expect(saved.news[0].id).toBeTruthy();
    expect(await weeklySummary(w.id)).toMatchObject({ news: 1, events: 1, alerts: 2 });
    const newsRow = await db.news.findUniqueOrThrow({ where: { id: saved.news[0].id! } });
    expect(newsRow.status).toBe("DRAFT");
    expect(await getNews(newsRow.slug)).toBeNull();

    // 3) Guardar de nuevo no duplica; quitar un elemento elimina su borrador
    saved.mobility = [];
    await saveWeeklyDraft(w.id, saved, actor);
    expect(await weeklySummary(w.id)).toMatchObject({ news: 1, events: 1, alerts: 1 });

    // 4) Checklist persistente
    await saveChecklist(w.id, { "Añadir noticias": true, "no-existe": true });
    const cl = (await db.weeklyUpdate.findUniqueOrThrow({ where: { id: w.id } })).checklist as Record<string, boolean>;
    expect(cl["Añadir noticias"]).toBe(true);
    expect(cl["no-existe"]).toBeUndefined();

    // 5) Publicar: todo visible en la web
    const counts = await publishWeekly(w.id, actor);
    expect(counts).toMatchObject({ news: 1, events: 1, alerts: 1 });
    expect(await getNews(newsRow.slug)).not.toBeNull();
    expect((await listActiveAlerts()).some((a) => a.title === "Aviso semanal")).toBe(true);
    const ev = (await listUpcomingEvents()).find((e) => e.title === "Evento semanal");
    expect(ev?.featured).toBe(true);
    expect((await db.weeklyUpdate.findUniqueOrThrow({ where: { id: w.id } })).status).toBe("PUBLISHED");
    const log = await db.auditLog.findFirst({ where: { entityId: w.id, action: "WEEKLY_PUBLISH" } });
    expect(log?.userEmail).toBe("weekly@example.org");

    // 6) Una actualización publicada queda bloqueada
    await expect(saveWeeklyDraft(w.id, saved, actor)).rejects.toThrow(/ya se publicó/);
  });
});

describe.skipIf(!available)("buscador global sobre el contenido real (seed)", async () => {
  const { getSearchProvider } = await import("@/lib/search");
  const search = getSearchProvider();

  it.each([
    ["empadronarme", "/tramites/alta-en-el-padron"],
    ["licencia de obra", "/tramites/licencia-urbanistica"],
    ["factura electrónica", "/tramites/factura-electronica"],
    ["bonificación IBI", "/tramites/bonificacion-ibi"],
    ["presentar una instancia", "/tramites/instancia-general"],
  ])("«%s» encuentra %s entre los primeros trámites", async (q, url) => {
    const res = await search.search(q);
    const procedures = res.groups.find((g) => g.type === "procedure")?.results ?? [];
    expect(procedures.slice(0, 3).map((r) => r.url)).toContain(url);
  });

  it("agrupa resultados por tipo e incluye subvenciones", async () => {
    const res = await search.search("subvención");
    expect(res.groups.map((g) => g.type)).toEqual(expect.arrayContaining(["grant", "procedure"]));
  });

  it("no devuelve borradores", async () => {
    const res = await search.search("noticia de integración borrador inexistente xyz");
    expect(res.groups.flatMap((g) => g.results).some((r) => /borrador/i.test(r.title))).toBe(false);
  });
});
