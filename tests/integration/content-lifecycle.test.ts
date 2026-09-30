import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { dbAvailable, inDays, values } from "./helpers";

const available = await dbAvailable();

describe.skipIf(!available)("ciclo de vida del contenido (BD real)", async () => {
  const { db } = await import("@/lib/db");
  const { saveItem, changeStatus, deleteItem, ValidationError } = await import("@/lib/admin/service");
  const { runLifecycle } = await import("@/lib/content/lifecycle");
  const { getNews, listNews, listUpcomingEvents, listActiveAlerts } = await import("@/lib/queries/public");
  let actor: { id: string; email: string };

  beforeAll(async () => {
    const u = await db.user.upsert({ where: { email: "tests@example.org" }, update: {}, create: { email: "tests@example.org", name: "Tests", passwordHash: "x", role: "ADMIN" } });
    actor = { id: u.id, email: u.email };
  });
  afterAll(async () => {
    await db.$disconnect();
  });

  it("crea una noticia como borrador (no visible) y genera slug único", async () => {
    const a = await saveItem({ resourceKey: "noticias", values: values("noticias", { title: "Noticia de integración", excerpt: "Resumen", date: inDays(0) }), intent: "draft", actor });
    const b = await saveItem({ resourceKey: "noticias", values: values("noticias", { title: "Noticia de integración", excerpt: "Otra", date: inDays(0) }), intent: "draft", actor });
    expect(a.status).toBe("DRAFT");
    expect(a.slug).toBe("noticia-de-integracion");
    expect(b.slug).toBe("noticia-de-integracion-2");
    expect(await getNews(String(a.slug))).toBeNull();
    await deleteItem({ resourceKey: "noticias", id: String(b.id), actor });
    expect(await db.news.findUnique({ where: { id: String(b.id) } })).toBeNull();
  });

  it("edita, publica y la noticia aparece en la web; queda registrado en el historial", async () => {
    const draft = await db.news.findFirstOrThrow({ where: { slug: "noticia-de-integracion" } });
    const edited = await saveItem({ resourceKey: "noticias", id: draft.id, values: values("noticias", { title: "Noticia de integración editada", excerpt: "Resumen editado", date: inDays(0), documents: [{ title: "Bases", url: "https://www.jaca.es/x.pdf" }] }), intent: "publish", actor });
    expect(edited.status).toBe("PUBLISHED");
    expect(edited.slug).toBe("noticia-de-integracion"); // el slug no cambia al editar
    const pub = await getNews("noticia-de-integracion");
    expect(pub?.title).toBe("Noticia de integración editada");
    expect(pub?.documents).toHaveLength(1);
    const { items } = await listNews({ pageSize: 50 });
    expect(items.some((n) => n.id === draft.id)).toBe(true);
    const logs = await db.auditLog.findMany({ where: { entityId: draft.id } });
    expect(logs.map((l) => l.action)).toEqual(expect.arrayContaining(["CREATE", "PUBLISH"]));
  });

  it("programa la publicación y el cron la publica al llegar la fecha", async () => {
    const s = await saveItem({ resourceKey: "noticias", values: values("noticias", { title: "Noticia programada", excerpt: "x", date: inDays(0), publishAt: inDays(2) }), intent: "publish", actor });
    expect(s.status).toBe("SCHEDULED");
    expect(await getNews(String(s.slug))).toBeNull();
    await runLifecycle(new Date(Date.now() + 3 * 86400000));
    expect((await db.news.findUniqueOrThrow({ where: { id: String(s.id) } })).status).toBe("PUBLISHED");
  });

  it("archiva automáticamente al caducar y permite restaurar", async () => {
    const n = await saveItem({ resourceKey: "noticias", values: values("noticias", { title: "Noticia que caduca", excerpt: "x", date: inDays(-3), expiresAt: inDays(1) }), intent: "publish", actor });
    expect(await getNews(String(n.slug))).not.toBeNull();
    const r = await runLifecycle(new Date(Date.now() + 2 * 86400000));
    expect(r.expiredArchived).toBeGreaterThanOrEqual(1);
    expect((await db.news.findUniqueOrThrow({ where: { id: String(n.id) } })).status).toBe("ARCHIVED");
    expect(await changeStatus({ resourceKey: "noticias", id: String(n.id), action: "restore", actor })).toBe("DRAFT");
  });

  it("valida en servidor (no se confía en el navegador)", async () => {
    await expect(saveItem({ resourceKey: "noticias", values: values("noticias", { title: "", excerpt: "", date: "" }), intent: "publish", actor })).rejects.toBeInstanceOf(ValidationError);
  });

  it("agenda: los eventos próximos aparecen y los pasados se archivan", async () => {
    const future = await saveItem({ resourceKey: "agenda", values: values("agenda", { title: "Concierto de prueba", description: "Música", startDate: inDays(3) }), intent: "publish", actor });
    const past = await saveItem({ resourceKey: "agenda", values: values("agenda", { title: "Evento pasado", description: "x", startDate: inDays(-5) }), intent: "publish", actor });
    const upcoming = await listUpcomingEvents();
    expect(upcoming.some((e) => e.id === future.id)).toBe(true);
    expect(upcoming.some((e) => e.id === past.id)).toBe(false);
    const r = await runLifecycle();
    expect(r.eventsArchived).toBeGreaterThanOrEqual(1);
    expect((await db.event.findUniqueOrThrow({ where: { id: String(past.id) } })).status).toBe("ARCHIVED");
  });

  it("avisos: dejan de mostrarse al pasar su fecha de fin y se ordenan por prioridad", async () => {
    const urgent = await saveItem({ resourceKey: "avisos", values: values("avisos", { title: "Corte de agua (test)", summary: "x", priority: "URGENT", kind: "CORTE", startsAt: inDays(-1), endsAt: inDays(1) }), intent: "publish", actor });
    const active = await listActiveAlerts();
    expect(active[0].priority).toBe("URGENT");
    expect(active.some((a) => a.id === urgent.id)).toBe(true);
    const later = await listActiveAlerts({ now: new Date(Date.now() + 2 * 86400000) });
    expect(later.some((a) => a.id === urgent.id)).toBe(false);
  });
});
