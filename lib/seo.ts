import type { Metadata } from "next";

/** Metadatos por página con canonical y Open Graph coherentes. */
export function pageMetadata({ title, description, path, image, type = "website", noindex = false }: { title: string; description?: string; path: string; image?: string; type?: "website" | "article"; noindex?: boolean }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type, ...(image ? { images: [{ url: image }] } : {}) },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export function param(sp: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}
