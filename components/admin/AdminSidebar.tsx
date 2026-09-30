"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell, Briefcase, CalendarDays, CalendarRange, FileStack, FileText, Gavel, HandCoins, History, Image as ImageIcon, LayoutDashboard, Menu, Newspaper, Settings, Sparkles, Users, X, Building2,
} from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/actualizacion-semanal", label: "Actualización semanal", icon: CalendarRange, highlight: true },
  { href: "/admin/noticias", label: "Noticias", icon: Newspaper },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/admin/avisos", label: "Avisos", icon: Bell },
  { href: "/admin/convocatorias", label: "Subvenciones / convocatorias", icon: HandCoins },
  { href: "/admin/empleo", label: "Empleo público", icon: Briefcase },
  { href: "/admin/plenos", label: "Plenos", icon: Gavel },
  { href: "/admin/documentos", label: "Documentos", icon: FileStack },
  { href: "/admin/tramites", label: "Trámites", icon: FileText },
  { href: "/admin/destacados", label: "Banners / destacados", icon: Sparkles },
  { href: "/admin/paginas", label: "Páginas", icon: FileText },
  { href: "/admin/areas", label: "Áreas y contactos", icon: Building2 },
  { href: "/admin/medios", label: "Medios", icon: ImageIcon },
  { href: "/admin/historial", label: "Historial de cambios", icon: History },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = (
    <nav aria-label="Panel de administración">
      <ul className="space-y-0.5">
        {NAV.map((n) => {
          const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
          return (
            <li key={n.href}>
              <Link
                href={n.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-[6px] px-3 text-[0.9688rem] font-semibold transition-colors",
                  active ? "bg-forest-700 text-snow" : n.highlight ? "text-sand hover:bg-forest-800" : "text-stone-300 hover:bg-forest-800 hover:text-snow",
                )}
              >
                <n.icon aria-hidden className="size-5 shrink-0" />
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 flex items-center gap-2 px-3 text-xs text-mist">
        <Users aria-hidden className="size-4" /> {isAdmin ? "Administrador/a" : "Editor/a"}
      </p>
    </nav>
  );
  return (
    <>
      <div className="flex items-center justify-between bg-forest-900 px-4 py-3 lg:hidden">
        <Link href="/admin" className="font-serif text-xl text-snow">Panel · Jaca</Link>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="admin-nav" className="inline-flex min-h-11 items-center gap-2 rounded-[4px] border border-mist/40 px-3 font-semibold text-snow">
          {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />} Menú
        </button>
      </div>
      <div id="admin-nav" className={cn("bg-forest-900 p-4 lg:block", open ? "block" : "hidden")}>
        <Link href="/admin" className="mb-6 hidden px-3 lg:block">
          <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-mist">Ayuntamiento de</span>
          <span className="font-serif text-2xl font-semibold text-snow">Jaca · Panel</span>
        </Link>
        {nav}
      </div>
    </>
  );
}
