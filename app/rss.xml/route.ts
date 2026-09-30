import { listNews } from "@/lib/queries/public";
import { siteUrl } from "@/lib/env";

// Se genera en cada petición (lee la base de datos).
export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Canal RSS de noticias (se mantiene la URL /rss.xml de la web actual). */
export async function GET() {
  const base = siteUrl();
  const { items } = await listNews({ pageSize: 30 });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Ayuntamiento de Jaca — Noticias</title><link>${base}</link><description>Noticias del Ayuntamiento de Jaca</description><language>es-es</language>
${items
  .map(
    (n) => `<item><title>${esc(n.title)}</title><link>${base}/actualidad/noticias/${n.slug}</link><guid>${base}/actualidad/noticias/${n.slug}</guid><pubDate>${n.date.toUTCString()}</pubDate><description>${esc(n.excerpt)}</description></item>`,
  )
  .join("\n")}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
}
