import { NextResponse, type NextRequest } from "next/server";
import { getSearchProvider, TYPE_LABEL } from "@/lib/search";
import { rateLimit } from "@/lib/rate-limit";

/** Sugerencias del buscador (JSON). Público, con límite de peticiones por IP. */
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!rateLimit(`search:${ip}`, 60, 60_000).ok) {
    return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });
  }
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 120);
  const scope = req.nextUrl.searchParams.get("scope");
  if (q.trim().length < 2) return NextResponse.json({ suggestions: [] });
  const res = await getSearchProvider().search(q, { limitPerType: 4, types: scope === "procedures" ? ["procedure"] : undefined });
  const suggestions = res.groups
    .flatMap((g) => g.results)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((r) => ({ type: r.type, label: TYPE_LABEL[r.type].replace(/ y .*/, ""), title: r.title, url: r.url, external: r.external }));
  return NextResponse.json({ suggestions }, { headers: { "Cache-Control": "no-store" } });
}
