import { ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/dates";

/** Transparencia sobre el origen del dato: fuente oficial y fecha de la última verificación. */
export function SourceNote({ sourceUrl, sourceName, lastVerifiedAt, updatedAt }: { sourceUrl?: string | null; sourceName?: string | null; lastVerifiedAt?: Date | null; updatedAt?: Date | null }) {
  if (!sourceUrl && !lastVerifiedAt && !updatedAt) return null;
  return (
    <p className="mt-12 flex items-start gap-2 border-t border-stone-200 pt-5 text-[0.9375rem] text-muted">
      <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-moss" />
      <span>
        {sourceUrl && (
          <>
            Fuente oficial:{" "}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-forest-700">
              {sourceName ?? new URL(sourceUrl).hostname}
              <span className="sr-only"> (abre sitio externo)</span>
            </a>
            .{" "}
          </>
        )}
        {lastVerifiedAt && <>Información verificada el {formatDate(lastVerifiedAt, "medium")}. </>}
        {updatedAt && <>Última actualización: {formatDate(updatedAt, "medium")}.</>}
      </span>
    </p>
  );
}
