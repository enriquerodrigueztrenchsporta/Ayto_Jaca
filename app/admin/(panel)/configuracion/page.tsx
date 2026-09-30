import { requireUser } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/dates";
import { isDemoMode } from "@/lib/env";
import { SettingsForms } from "./SettingsForms";

export const metadata = { title: "Configuración" };

export default async function SettingsPage() {
  const user = await requireUser();
  const [general, users] = await Promise.all([db.setting.findUnique({ where: { key: "general" } }), db.user.findMany({ orderBy: { createdAt: "asc" } })]);
  const value = (general?.value ?? {}) as { officeHours?: string; generalEmail?: string };
  return (
    <div className="max-w-5xl space-y-10">
      <div>
        <h1 className="font-serif text-h1 font-medium text-forest-900">Configuración</h1>
        <p className="mt-2 text-ink-2">
          Modo demostración: <strong>{isDemoMode() ? "activado" : "desactivado"}</strong> (variable <code>NEXT_PUBLIC_DEMO_MODE</code> del servidor).
        </p>
      </div>
      <section aria-labelledby="usuarios" className="rounded-[10px] border border-stone-200 bg-white p-6">
        <h2 id="usuarios" className="font-serif text-h3 font-medium">Usuarios</h2>
        <div className="mt-4 overflow-x-auto" role="region" aria-label="Usuarios" tabIndex={0}>
          <table className="w-full min-w-[560px] text-left text-[0.9375rem]">
            <caption className="sr-only">Usuarios del panel</caption>
            <thead className="bg-stone-100">
              <tr>
                <th scope="col" className="px-3 py-2">Nombre</th>
                <th scope="col" className="px-3 py-2">Correo</th>
                <th scope="col" className="px-3 py-2">Rol</th>
                <th scope="col" className="px-3 py-2">Último acceso</th>
                <th scope="col" className="px-3 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-stone-200">
                  <td className="px-3 py-2 font-semibold">{u.name}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.role === "ADMIN" ? "Administración" : "Edición"}</td>
                  <td className="px-3 py-2 text-muted">{u.lastLoginAt ? formatDateTime(u.lastLoginAt) : "—"}</td>
                  <td className="px-3 py-2">{u.active ? "Activo" : "Desactivado"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <SettingsForms isAdmin={user.role === "ADMIN"} general={{ officeHours: value.officeHours ?? "", generalEmail: value.generalEmail ?? "" }} users={users.filter((u) => u.id !== user.id).map((u) => ({ id: u.id, email: u.email, active: u.active }))} />
    </div>
  );
}
