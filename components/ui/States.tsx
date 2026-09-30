import Link from "next/link";
import { AlertTriangle, Inbox } from "lucide-react";
import { OroelLine } from "./OroelLine";
import { cn } from "@/lib/cn";

export function EmptyState({ title, description, action, className }: { title: string; description?: string; action?: { href: string; label: string }; className?: string }) {
  return (
    <div className={cn("rounded-[10px] border border-dashed border-stone-300 bg-white/60 px-6 py-10 text-center", className)} role="status">
      <Inbox aria-hidden className="mx-auto mb-3 size-8 text-muted" />
      <p className="font-serif text-h3 text-ink">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-md text-ink-2">{description}</p>}
      {action && (
        <Link href={action.href} className="link mt-4 inline-block font-semibold">
          {action.label}
        </Link>
      )}
      <OroelLine className="mx-auto mt-6 h-6 max-w-xs text-stone-300" />
    </div>
  );
}

export function ErrorState({ title = "No hemos podido cargar este contenido", description, retry }: { title?: string; description?: string; retry?: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border border-urgent/30 bg-urgent-50 px-6 py-8" role="alert">
      <div className="flex items-start gap-3">
        <AlertTriangle aria-hidden className="mt-1 size-6 shrink-0 text-urgent" />
        <div>
          <p className="font-semibold text-ink">{title}</p>
          <p className="mt-1 text-ink-2">{description ?? "Puede deberse a un problema temporal de conexión. Inténtelo de nuevo en unos instantes."}</p>
          {retry && <div className="mt-4">{retry}</div>}
        </div>
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-[6px] bg-stone-200/70", className)} />;
}

export function CardSkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-3" aria-busy="true" aria-label="Cargando contenido">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-[10px] border border-stone-200 bg-white p-6">
          <Skeleton className="mb-4 h-40 w-full" />
          <Skeleton className="mb-2 h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
