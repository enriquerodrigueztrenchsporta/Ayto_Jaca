import { db } from "@/lib/db";
import { publishedWhere } from "@/lib/content/visibility";
import { normalize, truncate, stripMarkdown } from "@/lib/text";
import { parseQuery, scoreText } from "./query";
import { TYPE_LABEL, TYPE_ORDER, type SearchProvider, type SearchResponse, type SearchResult, type SearchResultType } from "./types";

const CANDIDATES = 60;

/**
 * Búsqueda server-side sobre la columna normalizada `searchText` (sin tildes, minúsculas)
 * con expansión de sinónimos y puntuación en aplicación. Adecuada para el volumen de un municipio
 * (cientos o pocos miles de registros). Ver lib/search/types.ts para sustituir el motor.
 */
export class PostgresSearchProvider implements SearchProvider {
  async search(query: string, opts: { types?: SearchResultType[]; limitPerType?: number } = {}): Promise<SearchResponse> {
    const { terms, expanded } = parseQuery(query);
    const phrase = normalize(query);
    const limit = opts.limitPerType ?? 8;
    const types = opts.types ?? TYPE_ORDER;
    if (!expanded.length) return { query, terms, total: 0, groups: [] };

    const now = new Date();
    const pub = publishedWhere(now);
    const textWhere = { OR: expanded.map((e) => ({ searchText: { contains: e } })) };
    const where = { AND: [pub, textWhere] };

    const collect: Record<SearchResultType, () => Promise<SearchResult[]>> = {
      procedure: async () =>
        (await db.procedure.findMany({ where, take: CANDIDATES, select: { id: true, slug: true, title: true, summary: true, searchText: true } })).map((p) => ({
          type: "procedure", id: p.id, title: p.title, summary: p.summary, url: `/tramites/${p.slug}`,
          score: scoreText(p.title, p.searchText, terms, expanded, phrase) + 3,
        })),
      area: async () => {
        const areas = await db.area.findMany({ take: 50, select: { id: true, slug: true, name: true, description: true } });
        return areas
          .map((a) => ({ a, text: normalize(`${a.name} ${a.description ?? ""}`) }))
          .filter(({ text }) => expanded.some((e) => text.includes(e)))
          .map(({ a, text }) => ({
            type: "area" as const, id: a.id, title: a.name, summary: truncate(a.description ?? "Área municipal", 160), url: `/ayuntamiento/areas/${a.slug}`,
            score: scoreText(a.name, text, terms, expanded, phrase) + 2,
          }));
      },
      alert: async () =>
        (await db.alert.findMany({ where: { AND: [where, { OR: [{ endsAt: null }, { endsAt: { gte: now } }] }] }, take: CANDIDATES })).map((a) => ({
          type: "alert", id: a.id, title: a.title, summary: a.summary, url: `/avisos#aviso-${a.id}`, date: a.startsAt.toISOString(),
          score: scoreText(a.title, a.searchText, terms, expanded, phrase) + 1,
        })),
      news: async () =>
        (await db.news.findMany({ where, take: CANDIDATES, orderBy: { date: "desc" } })).map((n) => ({
          type: "news", id: n.id, title: n.title, summary: n.excerpt, url: `/actualidad/noticias/${n.slug}`, date: n.date.toISOString(),
          score: scoreText(n.title, n.searchText, terms, expanded, phrase),
        })),
      event: async () =>
        (await db.event.findMany({ where, take: CANDIDATES, orderBy: { startDate: "asc" } })).map((e) => ({
          type: "event", id: e.id, title: e.title, summary: truncate(stripMarkdown(e.description), 160), url: `/agenda/${e.slug}`, date: e.startDate.toISOString(),
          score: scoreText(e.title, e.searchText, terms, expanded, phrase),
        })),
      grant: async () =>
        (await db.grant.findMany({ where, take: CANDIDATES })).map((g) => ({
          type: "grant", id: g.id, title: g.title, summary: g.summary, url: `/convocatorias/${g.slug}`, date: g.deadline?.toISOString() ?? null,
          score: scoreText(g.title, g.searchText, terms, expanded, phrase) + (g.grantStatus === "OPEN" ? 2 : 0),
        })),
      job: async () =>
        (await db.publicJob.findMany({ where, take: CANDIDATES })).map((j) => ({
          type: "job", id: j.id, title: j.title, summary: j.summary, url: `/empleo-publico/${j.slug}`, date: j.deadline?.toISOString() ?? null,
          score: scoreText(j.title, j.searchText, terms, expanded, phrase),
        })),
      session: async () =>
        (await db.municipalSession.findMany({ where, take: CANDIDATES, orderBy: { date: "desc" } })).map((s) => ({
          type: "session", id: s.id, title: s.title, summary: `Sesión ${s.sessionType.toLowerCase().replace("_", " ")}`, url: `/plenos/${s.slug}`, date: s.date.toISOString(),
          score: scoreText(s.title, s.searchText, terms, expanded, phrase),
        })),
      page: async () =>
        (await db.page.findMany({ where, take: CANDIDATES })).map((p) => ({
          type: "page", id: p.id, title: p.title, summary: p.summary ?? truncate(stripMarkdown(p.body), 160), url: `/${p.path}`,
          score: scoreText(p.title, p.searchText, terms, expanded, phrase),
        })),
      document: async () =>
        (await db.document.findMany({ where: textWhere, take: CANDIDATES })).map((d) => ({
          type: "document", id: d.id, title: d.title, summary: d.description ?? "Documento", url: d.url, external: d.isExternal,
          date: d.documentDate?.toISOString() ?? null,
          score: scoreText(d.title, d.searchText, terms, expanded, phrase) - 1,
        })),
    };

    const groups = await Promise.all(
      types.map(async (type) => {
        const results = (await collect[type]()).filter((r) => r.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
        return { type, label: TYPE_LABEL[type], results };
      }),
    );
    const nonEmpty = groups.filter((g) => g.results.length);
    // Grupos ordenados por relevancia del mejor resultado, con trámites primero si empatan.
    nonEmpty.sort((a, b) => b.results[0].score - a.results[0].score || TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type));
    return { query, terms, total: nonEmpty.reduce((n, g) => n + g.results.length, 0), groups: nonEmpty };
  }
}
