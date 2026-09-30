import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { publishedWhere } from "@/lib/content/visibility";
import { siteUrl } from "@/lib/env";

const STATIC = [
  "", "/tramites", "/actualidad", "/actualidad/noticias", "/avisos", "/agenda", "/plenos", "/convocatorias", "/empleo-publico",
  "/ayuntamiento", "/ayuntamiento/corporacion", "/ayuntamiento/organizacion", "/ayuntamiento/areas", "/contacto",
  "/transparencia", "/transparencia/normativa", "/transparencia/contratacion", "/documentos",
  "/ciudad", "/cultura", "/deportes", "/turismo", "/desarrollo-economico",
  "/accesibilidad", "/aviso-legal", "/privacidad", "/cookies", "/mapa-web", "/creditos",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const w = publishedWhere();
  const [pages, procedures, news, events, grants, jobs, sessions, areas] = await Promise.all([
    db.page.findMany({ where: w, select: { path: true, updatedAt: true } }),
    db.procedure.findMany({ where: w, select: { slug: true, updatedAt: true } }),
    db.news.findMany({ where: w, select: { slug: true, updatedAt: true } }),
    db.event.findMany({ where: w, select: { slug: true, updatedAt: true } }),
    db.grant.findMany({ where: w, select: { slug: true, updatedAt: true } }),
    db.publicJob.findMany({ where: w, select: { slug: true, updatedAt: true } }),
    db.municipalSession.findMany({ where: w, select: { slug: true, updatedAt: true } }),
    db.area.findMany({ select: { slug: true, updatedAt: true } }),
  ]);
  const entry = (path: string, lastModified?: Date) => ({ url: `${base}${path}`, lastModified });
  return [
    ...STATIC.map((p) => entry(p)),
    ...pages.map((p) => entry(`/${p.path}`, p.updatedAt)),
    ...procedures.map((p) => entry(`/tramites/${p.slug}`, p.updatedAt)),
    ...news.map((p) => entry(`/actualidad/noticias/${p.slug}`, p.updatedAt)),
    ...events.map((p) => entry(`/agenda/${p.slug}`, p.updatedAt)),
    ...grants.map((p) => entry(`/convocatorias/${p.slug}`, p.updatedAt)),
    ...jobs.map((p) => entry(`/empleo-publico/${p.slug}`, p.updatedAt)),
    ...sessions.map((p) => entry(`/plenos/${p.slug}`, p.updatedAt)),
    ...areas.map((p) => entry(`/ayuntamiento/areas/${p.slug}`, p.updatedAt)),
  ];
}
