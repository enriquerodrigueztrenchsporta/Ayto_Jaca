"use client";
import Link from "next/link";
import { ErrorState } from "@/components/ui/States";

export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-site py-16">
      <h1 className="mb-6 font-serif text-h1 font-medium text-forest-900">Algo no ha ido bien</h1>
      <ErrorState
        description="No hemos podido cargar esta página. Puede ser un problema temporal de conexión con el servidor."
        retry={
          <div className="flex flex-wrap gap-3">
            <button onClick={reset} className="inline-flex min-h-12 items-center rounded-[4px] bg-forest-700 px-5 font-semibold text-snow hover:bg-forest-600">
              Reintentar
            </button>
            <Link href="/" className="inline-flex min-h-12 items-center rounded-[4px] border-[1.5px] border-forest-700 px-5 font-semibold text-forest-700">
              Ir a la portada
            </Link>
          </div>
        }
      />
    </div>
  );
}
