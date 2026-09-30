"use client";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { changePasswordAction, createUserAction, saveSettingsAction, toggleUserAction } from "../../actions";
import { StatusMessage } from "@/components/admin/StatusMessage";

const input = "block w-full min-h-12 rounded-[4px] border border-stone-300 bg-white px-3";

function Field({ label, name, type = "text", error, defaultValue, help }: { label: string; name: string; type?: string; error?: string; defaultValue?: string; help?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-semibold">{label}</label>
      <input id={id} name={name} type={type} defaultValue={defaultValue} className={input} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-e` : help ? `${id}-h` : undefined} autoComplete={type === "password" ? "new-password" : undefined} />
      {help && !error && <p id={`${id}-h`} className="mt-1 text-sm text-muted">{help}</p>}
      {error && <p id={`${id}-e`} className="mt-1 text-sm font-semibold text-urgent">{error}</p>}
    </div>
  );
}

export function SettingsForms({ isAdmin, general, users }: { isAdmin: boolean; general: { officeHours: string; generalEmail: string }; users: Array<{ id: string; email: string; active: boolean }> }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<Record<string, { ok: boolean; message: string; errors?: Record<string, string> }>>({});
  const run = (key: string, fn: () => Promise<{ ok: boolean; message?: string; errors?: Record<string, string> }>, reset?: HTMLFormElement) =>
    start(async () => {
      const r = await fn();
      setResult((s) => ({ ...s, [key]: { ok: r.ok, message: r.message ?? "", errors: "errors" in r ? r.errors : undefined } }));
      if (r.ok) {
        reset?.reset();
        router.refresh();
      }
    });

  return (
    <>
      {isAdmin && (
        <section aria-labelledby="general" className="rounded-[10px] border border-stone-200 bg-white p-6">
          <h2 id="general" className="font-serif text-h3 font-medium">Datos generales</h2>
          <form
            className="mt-4 grid gap-4 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              run("general", () => saveSettingsAction({ officeHours: String(fd.get("officeHours")), generalEmail: String(fd.get("generalEmail")) }));
            }}
          >
            <Field label="Horario de atención general" name="officeHours" defaultValue={general.officeHours} help="Solo datos confirmados por el Ayuntamiento." />
            <Field label="Correo electrónico general" name="generalEmail" defaultValue={general.generalEmail} />
            <div className="md:col-span-2 space-y-3">
              <StatusMessage message={result.general?.message} tone={result.general?.ok ? "ok" : "error"} />
              <button disabled={pending} className="min-h-12 rounded-[4px] bg-forest-700 px-5 font-semibold text-snow disabled:opacity-60">Guardar</button>
            </div>
          </form>
        </section>
      )}

      {isAdmin && (
        <section aria-labelledby="nuevo-usuario" className="rounded-[10px] border border-stone-200 bg-white p-6">
          <h2 id="nuevo-usuario" className="font-serif text-h3 font-medium">Añadir usuario</h2>
          <p className="mt-1 text-sm text-muted">La arquitectura admite varias personas usuarias con roles de administración o edición.</p>
          <form
            className="mt-4 grid gap-4 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const fd = new FormData(form);
              run("user", () => createUserAction({ name: String(fd.get("name")), email: String(fd.get("email")), role: String(fd.get("role")) as "EDITOR", password: String(fd.get("password")) }), form);
            }}
          >
            <Field label="Nombre" name="name" error={result.user?.errors?.name} />
            <Field label="Correo electrónico" name="email" type="email" error={result.user?.errors?.email} />
            <div>
              <label htmlFor="role" className="mb-1.5 block font-semibold">Rol</label>
              <select id="role" name="role" className={input}>
                <option value="EDITOR">Edición (contenidos)</option>
                <option value="ADMIN">Administración (contenidos, usuarios y configuración)</option>
              </select>
            </div>
            <Field label="Contraseña inicial" name="password" type="password" error={result.user?.errors?.password} help="Mínimo 12 caracteres. Comunícala por un canal seguro." />
            <div className="md:col-span-2 space-y-3">
              <StatusMessage message={result.user?.message} tone={result.user?.ok ? "ok" : "error"} />
              <button disabled={pending} className="min-h-12 rounded-[4px] bg-forest-700 px-5 font-semibold text-snow disabled:opacity-60">Crear usuario</button>
            </div>
          </form>
          {users.length > 0 && (
            <ul className="mt-6 space-y-2">
              {users.map((u) => (
                <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[6px] bg-stone-100 px-4 py-2">
                  <span>{u.email}</span>
                  <button type="button" disabled={pending} onClick={() => run("toggle", () => toggleUserAction(u.id))} className="min-h-11 rounded-[4px] border border-stone-300 bg-white px-3 font-semibold">
                    {u.active ? "Desactivar" : "Activar"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section aria-labelledby="password" className="rounded-[10px] border border-stone-200 bg-white p-6">
        <h2 id="password" className="font-serif text-h3 font-medium">Cambiar mi contraseña</h2>
        <form
          className="mt-4 grid gap-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            run("password", () => changePasswordAction({ current: String(fd.get("current")), next: String(fd.get("next")) }), form);
          }}
        >
          <Field label="Contraseña actual" name="current" type="password" error={result.password?.errors?.current} />
          <Field label="Nueva contraseña" name="next" type="password" error={result.password?.errors?.next} help="Mínimo 12 caracteres." />
          <div className="md:col-span-2 space-y-3">
            <StatusMessage message={result.password?.message} tone={result.password?.ok ? "ok" : "error"} />
            <button disabled={pending} className="min-h-12 rounded-[4px] bg-forest-700 px-5 font-semibold text-snow disabled:opacity-60">Actualizar contraseña</button>
          </div>
        </form>
      </section>
    </>
  );
}
