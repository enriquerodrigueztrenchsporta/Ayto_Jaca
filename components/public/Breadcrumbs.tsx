import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteUrl } from "@/lib/env";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Inicio", href: "/" }, ...items];
  const base = siteUrl();
  return (
    <>
      <nav aria-label="Estás en" className="text-[0.9375rem]">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-ink-2">
          {all.map((c, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight aria-hidden className="size-4 text-muted" />}
              {c.href && i < all.length - 1 ? (
                <Link href={c.href} className="underline decoration-stone-300 underline-offset-4 hover:text-forest-700 hover:decoration-forest-700">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={i === all.length - 1 ? "page" : undefined} className="font-semibold text-ink">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: base + c.href } : {}),
          })),
        }}
      />
    </>
  );
}
