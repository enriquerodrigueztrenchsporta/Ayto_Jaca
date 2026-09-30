"use client";
import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="mt-6 space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="mb-1.5 block font-semibold">Correo electrónico</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="block min-h-12 w-full rounded-[4px] border border-stone-300 px-3" aria-describedby={state?.error ? "login-error" : undefined} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block font-semibold">Contraseña</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="block min-h-12 w-full rounded-[4px] border border-stone-300 px-3" aria-describedby={state?.error ? "login-error" : undefined} />
      </div>
      {state?.error && (
        <p id="login-error" role="alert" className="rounded-[6px] bg-urgent-50 px-4 py-3 font-semibold text-urgent">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] bg-forest-700 font-semibold text-snow hover:bg-forest-600 disabled:opacity-60">
        <LogIn aria-hidden className="size-5" /> {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
