import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { requireUser } from "@/lib/auth-guard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { logoutAction } from "../actions";
import { isDemoMode } from "@/lib/env";

/** Todas las páginas del panel exigen sesión (comprobación en servidor). */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[272px_1fr]">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[4px] focus:bg-snow focus:px-4 focus:py-3 focus:font-semibold">
        Saltar al contenido
      </a>
      <aside className="lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:bg-forest-900">
        <AdminSidebar isAdmin={user.role === "ADMIN"} />
      </aside>
      <div className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 bg-white px-5 py-3 lg:px-8">
          <p className="text-[0.9375rem] text-ink-2">
            Hola, <strong className="text-ink">{user.name}</strong>
            {isDemoMode() && <span className="ml-2 rounded-[4px] bg-ink px-2 py-0.5 text-xs font-semibold text-sand">DEMO</span>}
          </p>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="inline-flex min-h-11 items-center gap-1.5 rounded-[4px] px-3 font-semibold text-forest-700 hover:bg-forest-50">
              Ver la web <ExternalLink aria-hidden className="size-4" />
            </Link>
            <form action={logoutAction}>
              <button className="inline-flex min-h-11 items-center gap-1.5 rounded-[4px] border border-stone-300 px-3 font-semibold hover:bg-stone-100">
                <LogOut aria-hidden className="size-4" /> Salir
              </button>
            </form>
          </div>
        </header>
        <main id="contenido" className="px-5 py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
