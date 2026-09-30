import { db } from "@/lib/db";
import type { Lookups } from "@/components/admin/fields";

export async function loadLookups(): Promise<Lookups> {
  const [cats, areas, media] = await Promise.all([
    db.category.findMany({ orderBy: [{ scope: "asc" }, { sortOrder: "asc" }] }),
    db.area.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.media.findMany({ orderBy: { createdAt: "desc" }, take: 200, select: { id: true, url: true, filename: true, alt: true, mimeType: true } }),
  ]);
  const categories: Lookups["categories"] = {};
  for (const c of cats) (categories[c.scope] ??= []).push({ id: c.id, name: c.name });
  return { categories, areas, media };
}
