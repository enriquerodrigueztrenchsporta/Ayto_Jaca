import { CardSkeletonGrid, Skeleton } from "@/components/ui/States";

export default function Loading() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Cargando…</span>
      <div className="border-b border-stone-200 bg-stone-100">
        <div className="container-site space-y-4 py-12">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
      <div className="container-site py-12">
        <CardSkeletonGrid />
      </div>
    </div>
  );
}
