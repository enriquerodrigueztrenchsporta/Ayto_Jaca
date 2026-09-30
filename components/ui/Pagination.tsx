import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = { page: number; totalPages: number; hrefFor: Record<number, string> | ((page: number) => string); basePath?: string };

export function Pagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null;
  const href = (p: number) => (typeof hrefFor === "function" ? hrefFor(p) : hrefFor[p]);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);
  const itemClass = "inline-flex size-11 items-center justify-center rounded-[4px] font-semibold";
  return (
    <nav aria-label="Paginación" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={href(page - 1)} className="inline-flex min-h-11 items-center gap-1 rounded-[4px] px-3 font-semibold text-forest-700 hover:bg-forest-50">
          <ChevronLeft aria-hidden className="size-5" /> Anterior
        </Link>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && p - pages[i - 1] > 1 && <span aria-hidden className="text-muted">…</span>}
          <Link
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={p === page ? `${itemClass} bg-forest-700 text-snow` : `${itemClass} text-forest-700 hover:bg-forest-50`}
          >
            <span className="sr-only">Página </span>
            {p}
          </Link>
        </span>
      ))}
      {page < totalPages && (
        <Link href={href(page + 1)} className="inline-flex min-h-11 items-center gap-1 rounded-[4px] px-3 font-semibold text-forest-700 hover:bg-forest-50">
          Siguiente <ChevronRight aria-hidden className="size-5" />
        </Link>
      )}
    </nav>
  );
}
