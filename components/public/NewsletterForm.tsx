"use client";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Interfaz de suscripción a avisos. En el MVP NO se almacena ningún correo:
 * se informa de que el servicio está en preparación (ver docs/content-migration.md).
 */
export function NewsletterForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const id = useId();
  const [state, setState] = useState<"idle" | "error" | "info">("idle");
  const dark = tone === "dark";
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        const consent = (form.elements.namedItem("consent") as HTMLInputElement).checked;
        setState(ok && consent ? "info" : "error");
      }}
      aria-describedby={`${id}-msg`}
    >
      <label htmlFor={`${id}-email`} className={cn("mb-2 block font-semibold", dark ? "text-snow" : "text-ink")}>
        Correo electrónico
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={state === "error"}
          className="h-12 min-w-0 flex-1 basis-52 rounded-[4px] border border-stone-300 bg-white px-4 text-ink"
        />
        <button type="submit" className={cn("h-12 rounded-[4px] px-5 font-semibold", dark ? "bg-sand text-forest-900 hover:bg-snow" : "bg-forest-700 text-snow hover:bg-forest-600")}>
          Suscribirme
        </button>
      </div>
      <label className={cn("mt-3 flex items-start gap-2 text-[0.9375rem]", dark ? "text-stone-300" : "text-ink-2")}>
        <input type="checkbox" name="consent" className="mt-1 size-5 shrink-0 accent-forest-700" />
        <span>
          Acepto recibir avisos municipales y he leído la{" "}
          <a href="/privacidad" className="underline">política de privacidad</a>.
        </span>
      </label>
      <p id={`${id}-msg`} role="status" aria-live="polite" className={cn("mt-3 text-[0.9375rem]", dark ? "text-sand" : "text-important")}>
        {state === "error" && "Revise el correo electrónico y marque la casilla de aceptación."}
        {state === "info" && "Gracias. El servicio de avisos por correo está en preparación en esta demo: no se ha guardado ningún dato."}
      </p>
    </form>
  );
}
