import type { Metadata } from "next";
import { Eye } from "lucide-react";
import { requireUser } from "@/lib/auth-guard";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";

export const metadata: Metadata = { title: "Previsualización", robots: { index: false, follow: false, nocache: true } };

/** Previsualización privada: requiere sesión y nunca se indexa (también cabecera X-Robots-Tag). */
export default async function PreviewLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-50 bg-important text-white" role="note">
        <p className="container-site flex items-center gap-2 py-2 font-semibold">
          <Eye aria-hidden className="size-5" /> Vista previa — este contenido aún no es público. Cierra esta pestaña para volver al panel.
        </p>
      </div>
      <Header />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
