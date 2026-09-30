/**
 * Carga inicial de datos.
 *
 *   npm run db:seed            → carga contenido solo si la BD está vacía y asegura el usuario admin
 *   npm run db:seed -- --force → borra el contenido (no los usuarios) y lo vuelve a cargar
 *
 * El usuario administrador se crea con ADMIN_EMAIL / ADMIN_NAME / ADMIN_PASSWORD del entorno.
 * Nunca se guardan contraseñas en el repositorio.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import type { CategoryScope } from "../lib/generated/prisma/enums";
import { buildSearchText } from "../lib/text";
import { documentKindFromUrl } from "../lib/labels";
import { AREAS } from "../data/seed/areas";
import { PROCEDURES, PROCEDURE_CATEGORIES } from "../data/seed/procedures";
import { NEWS, SESSIONS, GRANTS, JOBS, EVENTS, ALERTS, FEATURED, STREAMING_URL } from "../data/seed/content";
import { PAGES } from "../data/seed/pages";
import images from "../data/images.json";
import sedeTramites from "../data/source/sede-tramites.json";
import normativa from "../data/source/normativa.json";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const VERIFIED = new Date("2026-09-30T10:00:00Z");
const JACA = "jaca.es (web municipal oficial)";
const SEDE = "Sede Electrónica del Ayuntamiento de Jaca";
const sedeUrl = (id: number) => `https://jaca.sedipualba.es/carpetaciudadana/tramite.aspx?idtramite=${id}`;

type SedeTramite = { id: string; url: string; title: string; description: string; documents: string[]; requirements: string[] };
const SEDE_BY_ID = new Map((sedeTramites as SedeTramite[]).map((t) => [Number(t.id), t]));

async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email) {
    console.log("· ADMIN_EMAIL no definido: no se crea usuario administrador (use `npm run admin:create`).");
    return null;
  }
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`· Usuario administrador existente: ${email}`);
    return existing;
  }
  if (!password || password.length < 10) {
    console.log("· ADMIN_PASSWORD vacío o con menos de 10 caracteres: ejecute `npm run admin:create` para crear el administrador.");
    return null;
  }
  const user = await db.user.create({
    data: { email, name: process.env.ADMIN_NAME || "Administración web", role: "ADMIN", passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`· Usuario administrador creado: ${email}`);
  return user;
}

async function wipeContent() {
  await db.$transaction([
    db.auditLog.deleteMany(),
    db.featuredContent.deleteMany(),
    db.news.deleteMany(),
    db.event.deleteMany(),
    db.alert.deleteMany(),
    db.grant.deleteMany(),
    db.publicJob.deleteMany(),
    db.municipalSession.deleteMany(),
    db.procedure.deleteMany(),
    db.page.deleteMany(),
    db.document.deleteMany(),
    db.weeklyUpdate.deleteMany(),
    db.category.deleteMany(),
    db.media.deleteMany(),
    db.area.deleteMany(),
    db.setting.deleteMany(),
  ]);
}

async function category(scope: CategoryScope, slug: string, name: string, sortOrder = 0) {
  return db.category.upsert({ where: { scope_slug: { scope, slug } }, update: { name, sortOrder }, create: { scope, slug, name, sortOrder } });
}

function docInput(d: { title: string; url: string }, extra: { description?: string; categoryId?: string; documentDate?: Date } = {}) {
  return {
    title: d.title,
    url: d.url,
    kind: documentKindFromUrl(d.url),
    isExternal: true,
    sourceUrl: d.url,
    sourceName: /jaca\.es/.test(d.url) ? JACA : undefined,
    lastVerifiedAt: VERIFIED,
    searchText: buildSearchText(d.title, extra.description),
    ...extra,
  };
}

async function seedContent() {
  // Categorías
  const newsCats = Object.fromEntries(
    await Promise.all(
      [["institucional", "Institucional"], ["bandos", "Bandos"], ["cultura", "Cultura"], ["deporte", "Deporte"], ["turismo", "Turismo"], ["juventud", "Juventud"], ["participacion", "Participación"]].map(
        async ([slug, name], i) => [slug, (await category("NEWS", slug, name, i)).id],
      ),
    ),
  );
  const eventCats = Object.fromEntries(
    await Promise.all(
      [["cultura", "Cultura"], ["deporte", "Deporte"], ["turismo", "Turismo"], ["juventud", "Juventud"], ["participacion", "Participación"], ["institucional", "Institucional"], ["otros", "Otros"]].map(
        async ([slug, name], i) => [slug, (await category("EVENT", slug, name, i)).id],
      ),
    ),
  );
  const procCats = Object.fromEntries(await Promise.all(PROCEDURE_CATEGORIES.map(async (c, i) => [c.slug, (await category("PROCEDURE", c.slug, c.name, i)).id])));
  const docCats = Object.fromEntries(
    await Promise.all(
      [["impresos", "Impresos y solicitudes"], ["ordenanzas", "Ordenanzas"], ["ordenanzas-fiscales", "Ordenanzas fiscales y precios públicos"], ["reglamentos", "Reglamentos y protocolos"], ["planes", "Planes y estrategias"], ["convocatorias", "Convocatorias y boletines"], ["plenos", "Plenos"], ["otros", "Otros documentos"]].map(
        async ([slug, name], i) => [slug, (await category("DOCUMENT", slug, name, i)).id],
      ),
    ),
  );

  // Medios (fotografías con licencia libre)
  const media: Record<string, string> = {};
  for (const img of images as Array<{ key: string; file: string; width: number; height: number; author: string; license: string; sourceUrl: string; title: string }>) {
    const m = await db.media.create({
      data: {
        filename: img.file.split("/").pop()!,
        url: img.file,
        mimeType: "image/jpeg",
        size: 0,
        width: img.width,
        height: img.height,
        alt: img.title.replace(/^File:/, "").replace(/\.[a-z]+$/i, ""),
        credit: img.author,
        license: img.license,
        sourceUrl: img.sourceUrl,
      },
    });
    media[img.key] = m.id;
  }

  // Áreas
  const areas: Record<string, string> = {};
  for (const [i, a] of AREAS.entries()) {
    const row = await db.area.create({
      data: {
        slug: a.slug, name: a.name, description: a.description, phone: a.phone, email: a.email, address: a.address, schedule: a.schedule,
        webUrl: a.webUrl, mapUrl: a.mapUrl, sortOrder: i, sourceUrl: a.sourceUrl, sourceName: JACA, lastVerifiedAt: VERIFIED, pendingFields: a.pendingFields ?? [],
      },
    });
    areas[a.slug] = row.id;
  }

  // Trámites
  for (const [i, p] of PROCEDURES.entries()) {
    const sede = p.sedeId ? SEDE_BY_ID.get(p.sedeId) : undefined;
    const requirements = sede?.requirements.length ? sede.requirements.map((r) => `- ${r}`).join("\n") : null;
    const requiresCertificate = !!sede?.requirements.some((r) => /certificado digital/i.test(r));
    const description = p.description ?? (sede?.description ? sede.description.replace(/\n(?=[a-záéíóú,:])/g, " ").trim() : null);
    const howToApply =
      p.howToApply ??
      (p.sedeId
        ? "Preséntelo en la Sede Electrónica con **certificado digital o Cl@ve**: pulse «Hacer el trámite en la Sede», elija «Nueva instancia» y siga los pasos. Si no dispone de certificado, puede iniciarlo con su correo electrónico y firmarlo en las oficinas municipales en los 10 días siguientes."
        : null);
    await db.procedure.create({
      data: {
        slug: p.slug, title: p.title, summary: p.summary, description, whoCanApply: p.whoCanApply ?? null,
        requirements, documentation: p.documentation ?? (sede?.documents.length ? sede.documents.map((d) => `- ${d}`).join("\n") : null),
        deadline: p.deadline ?? null, cost: p.cost ?? null, howToApply,
        inPerson: "En el Registro del Ayuntamiento, Calle Mayor, 24 (Jaca). Horario de registro: [PENDIENTE DE VALIDACIÓN POR EL AYUNTAMIENTO].",
        online: p.online ?? !!p.sedeId, requiresCertificate, sedeUrl: p.sedeId ? sedeUrl(p.sedeId) : null,
        keywords: p.keywords, categoryId: procCats[p.category], areaId: areas[p.area], featured: !!p.featured, sortOrder: i,
        status: "PUBLISHED", publishAt: VERIFIED,
        sourceUrl: p.sourceUrl ?? (p.sedeId ? sedeUrl(p.sedeId) : null), sourceName: p.sedeId ? SEDE : JACA, lastVerifiedAt: VERIFIED,
        searchText: buildSearchText(p.title, p.summary, p.keywords, description, p.category.replace(/-/g, " ")),
        documents: p.documents ? { create: p.documents.map((d) => docInput(d, { categoryId: docCats.impresos, description: `Impreso · ${p.title}` })) } : undefined,
      },
    });
  }

  // Documentos de normativa (índice completo de jaca.es)
  const catFor = (c: string) => (c === "Ordenanzas Fiscales" ? "ordenanzas-fiscales" : c === "Reglamentos" ? "reglamentos" : "ordenanzas");
  for (const n of normativa as Array<{ cat: string; title: string; page: string; links: Array<{ url: string; label: string }> }>) {
    const cleanTitle = n.title.charAt(0) + n.title.slice(1).toLowerCase().replace(/jaca/g, "Jaca").replace(/ayuntamiento/g, "Ayuntamiento");
    for (const [i, l] of n.links.entries()) {
      const title = n.links.length > 1 ? `${cleanTitle} — ${l.label.replace(/\.pdf$/i, "")}` : cleanTitle;
      await db.document.create({ data: { ...docInput({ title, url: l.url }, { categoryId: docCats[catFor(n.cat)], description: n.cat }), sourceUrl: n.page, documentDate: i === 0 ? undefined : undefined } });
    }
  }
  // Otros planes
  for (const d of [
    { title: "Agenda Urbana de Jaca 2030", url: "https://www.jaca.es/sites/default/files/agenda_urbana_de_jaca_rev20abril2022.pdf" },
    { title: "Plan de Acción para el Clima y la Energía Sostenible", url: "https://www.jaca.es/sites/default/files/plan_de_accion_para_el_clima_y_la_energia_sostenible_rev20abril2022.pdf" },
    { title: "Plan Local de Infancia y Adolescencia 2025-2029", url: "https://www.jaca.es/sites/default/files/20250609_otros_plia_jaca_2025_2029_definitivo_1.pdf" },
    { title: "Plan Estratégico de Personas Mayores", url: "https://www.jaca.es/sites/default/files/plan_estrategico_personas_mayores_jaca2.pdf" },
    { title: "Formulario normalizado DEUC (Documento Europeo Único de Contratación)", url: "https://www.jaca.es/sites/default/files/declaracion_responsable_unica.pdf" },
  ]) {
    await db.document.create({ data: docInput(d, { categoryId: docCats.planes }) });
  }

  // Páginas
  for (const p of PAGES) {
    await db.page.create({
      data: {
        path: p.path, section: p.section, title: p.title, summary: p.summary, body: p.body, sortOrder: p.sortOrder ?? 0,
        imageId: p.image ? media[p.image] : null, areaId: p.area ? areas[p.area] : null,
        status: "PUBLISHED", publishAt: VERIFIED, sourceUrl: p.sourceUrl, sourceName: JACA, lastVerifiedAt: VERIFIED,
        searchText: buildSearchText(p.title, p.summary, p.body),
        documents: p.documents ? { create: p.documents.map((d) => docInput(d, { categoryId: docCats.otros, description: p.title })) } : undefined,
      },
    });
  }

  // Noticias
  for (const n of NEWS) {
    await db.news.create({
      data: {
        slug: n.slug, title: n.title, excerpt: n.excerpt, body: n.body, categoryId: newsCats[n.category], date: new Date(n.date),
        featured: !!n.featured, links: n.links ?? undefined, status: "PUBLISHED", publishAt: new Date(n.date),
        sourceUrl: n.sourceUrl, sourceName: n.sourceName ?? JACA, lastVerifiedAt: VERIFIED,
        searchText: buildSearchText(n.title, n.excerpt, n.body, n.category),
        documents: n.documents ? { create: n.documents.map((d) => docInput(d, { categoryId: n.category === "bandos" ? docCats.otros : docCats.otros, description: n.title, documentDate: new Date(n.date) })) } : undefined,
      },
    });
  }

  // Plenos
  for (const s of SESSIONS) {
    await db.municipalSession.create({
      data: {
        slug: s.slug, title: s.title, sessionType: s.type, date: new Date(s.date), timeText: s.timeText, location: "Salón de Plenos · Casa Consistorial, Calle Mayor, 24",
        streamingUrl: STREAMING_URL, agenda: s.agenda, status: "PUBLISHED", publishAt: VERIFIED, sourceUrl: s.sourceUrl, sourceName: JACA, lastVerifiedAt: VERIFIED,
        searchText: buildSearchText(s.title, "pleno sesion", s.agenda),
        documents: s.documents ? { create: s.documents.map((d) => docInput(d, { categoryId: docCats.plenos, description: s.title, documentDate: new Date(s.date) })) } : undefined,
      },
    });
  }

  // Subvenciones
  for (const g of GRANTS) {
    await db.grant.create({
      data: {
        slug: g.slug, title: g.title, grantStatus: g.status, openingDate: g.openingDate ? new Date(g.openingDate) : null, deadline: g.deadline ? new Date(g.deadline) : null,
        deadlineText: g.deadlineText, beneficiaries: g.beneficiaries, summary: g.summary, body: g.body, officialUrl: g.sourceUrl, sedeUrl: g.sedeId ? sedeUrl(g.sedeId) : null,
        areaId: areas[g.area], status: "PUBLISHED", publishAt: VERIFIED, sourceUrl: g.sourceUrl, sourceName: JACA, lastVerifiedAt: VERIFIED,
        searchText: buildSearchText(g.title, g.summary, g.beneficiaries, "subvencion ayuda convocatoria"),
        documents: { create: g.documents.map((d) => docInput(d, { categoryId: docCats.convocatorias, description: g.title })) },
      },
    });
  }

  // Empleo público
  for (const j of JOBS) {
    await db.publicJob.create({
      data: {
        slug: j.slug, title: j.title, jobStatus: j.status, staffType: j.staffType, positions: j.positions, openingDate: new Date(j.openingDate), deadline: new Date(j.deadline),
        summary: j.summary, body: j.body, officialUrl: j.sourceUrl, areaId: areas["recursos-humanos"], status: "PUBLISHED", publishAt: VERIFIED,
        sourceUrl: j.sourceUrl, sourceName: JACA, lastVerifiedAt: VERIFIED, searchText: buildSearchText(j.title, j.summary, j.staffType, "empleo oposicion plaza proceso selectivo"),
        documents: { create: j.documents.map((d) => docInput(d, { categoryId: docCats.convocatorias, description: j.title })) },
      },
    });
  }

  // Agenda
  for (const e of EVENTS) {
    await db.event.create({
      data: {
        slug: e.slug, title: e.title, description: e.description, categoryId: eventCats[e.category], startDate: new Date(e.start), endDate: e.end ? new Date(e.end) : null,
        timeText: e.timeText, location: e.location, address: e.address, organizer: e.organizer, price: e.price, bookingUrl: e.bookingUrl, url: e.url,
        featured: !!e.featured, recurrence: e.recurrence ?? "NONE", status: "PUBLISHED", publishAt: VERIFIED, expiresAt: e.expiresAt ? new Date(e.expiresAt) : null,
        sourceUrl: e.sourceUrl, sourceName: e.sourceName, lastVerifiedAt: VERIFIED, searchText: buildSearchText(e.title, e.description, e.location, e.category),
      },
    });
  }

  // Avisos
  for (const a of ALERTS) {
    await db.alert.create({
      data: {
        title: a.title, summary: a.summary, body: a.body, priority: a.priority, kind: a.kind, startsAt: new Date(a.startsAt), endsAt: a.endsAt ? new Date(a.endsAt) : null,
        url: a.url, areaId: a.area ? areas[a.area] : null, zone: a.zone, affectation: a.affectation, alternative: a.alternative, isDemo: !!a.isDemo,
        showOnHome: true, status: "PUBLISHED", publishAt: VERIFIED, sourceUrl: a.sourceUrl, sourceName: a.isDemo ? "DEMO" : JACA, lastVerifiedAt: a.isDemo ? null : VERIFIED,
        searchText: buildSearchText(a.title, a.summary, a.zone),
      },
    });
  }

  // Destacados
  for (const f of FEATURED) {
    await db.featuredContent.create({
      data: { title: f.title, description: f.description, url: f.url, kind: f.kind, position: f.position, imageId: f.image ? media[f.image] : null, status: "PUBLISHED", publishAt: VERIFIED, sourceUrl: f.sourceUrl },
    });
  }

  await db.setting.create({ data: { key: "general", value: { officeHours: "[PENDIENTE DE VALIDACIÓN POR EL AYUNTAMIENTO]", generalEmail: "[PENDIENTE DE VALIDACIÓN POR EL AYUNTAMIENTO]" } } });
}

async function main() {
  const force = process.argv.includes("--force");
  const hasContent = (await db.procedure.count()) > 0;
  if (hasContent && !force) {
    console.log("· La base de datos ya tiene contenido. Use `npm run db:seed -- --force` para recargarlo.");
  } else {
    if (hasContent) await wipeContent();
    await seedContent();
    const counts = await Promise.all([db.procedure.count(), db.news.count(), db.event.count(), db.alert.count(), db.grant.count(), db.publicJob.count(), db.municipalSession.count(), db.page.count(), db.document.count(), db.area.count()]);
    console.log(`· Contenido cargado: ${counts[0]} trámites, ${counts[1]} noticias, ${counts[2]} eventos, ${counts[3]} avisos, ${counts[4]} subvenciones, ${counts[5]} procesos de empleo, ${counts[6]} plenos, ${counts[7]} páginas, ${counts[8]} documentos, ${counts[9]} áreas.`);
  }
  await ensureAdmin();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
