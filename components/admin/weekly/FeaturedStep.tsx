"use client";
import { useFormContext, useWatch } from "react-hook-form";
import type { WeeklyPayload } from "@/lib/weekly/shared";

export type FeaturedCandidates = {
  news: Array<{ id: string; title: string; featured: boolean }>;
  events: Array<{ id: string; title: string; featured: boolean }>;
  alerts: Array<{ id: string; title: string; featured: boolean }>;
};

function Group({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-[10px] border border-stone-200 bg-white p-5">
      <legend className="px-1 font-serif text-h3 font-medium">{legend}</legend>
      <div className="mt-2 space-y-1">{children}</div>
    </fieldset>
  );
}

function Check({ name, label, hint }: { name: string; label: string; hint?: string }) {
  const { register } = useFormContext();
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-[6px] px-2 py-1.5 hover:bg-stone-100">
      <input type="checkbox" {...register(name)} className="mt-1 size-5 shrink-0 accent-forest-700" />
      <span>
        <span className="font-semibold text-ink">{label}</span>
        {hint && <span className="block text-sm text-muted">{hint}</span>}
      </span>
    </label>
  );
}

/** Paso 9: selección de lo que aparece en la portada (contenidos nuevos y ya publicados). */
export function FeaturedStep({ candidates }: { candidates: FeaturedCandidates }) {
  const { control } = useFormContext<WeeklyPayload>();
  const news = useWatch({ control, name: "news" }) ?? [];
  const events = useWatch({ control, name: "events" }) ?? [];
  const alerts = [...(useWatch({ control, name: "alerts" }) ?? []), ...(useWatch({ control, name: "mobility" }) ?? [])];
  const mobilityOffset = (useWatch({ control, name: "alerts" }) ?? []).length;

  return (
    <div className="grid gap-5">
      <Group legend="Noticias destacadas">
        {news.map((n, i) => (
          <Check key={`new-n-${i}`} name={`news.${i}.featured`} label={String(n.title || `Noticia ${i + 1}`)} hint="Nueva esta semana" />
        ))}
        {candidates.news.map((n) => (
          <Check key={n.id} name={`featured.news.${n.id}`} label={n.title} hint="Ya publicada" />
        ))}
      </Group>
      <Group legend="Eventos destacados">
        {events.map((e, i) => (
          <Check key={`new-e-${i}`} name={`events.${i}.featured`} label={String(e.title || `Evento ${i + 1}`)} hint="Nuevo esta semana" />
        ))}
        {candidates.events.map((e) => (
          <Check key={e.id} name={`featured.events.${e.id}`} label={e.title} hint="Ya publicado" />
        ))}
      </Group>
      <Group legend="Avisos en la portada">
        {alerts.map((a, i) => (
          <Check
            key={`new-a-${i}`}
            name={i < mobilityOffset ? `alerts.${i}.showOnHome` : `mobility.${i - mobilityOffset}.showOnHome`}
            label={String(a.title || `Aviso ${i + 1}`)}
            hint="Nuevo esta semana"
          />
        ))}
        {candidates.alerts.map((a) => (
          <Check key={a.id} name={`featured.alerts.${a.id}`} label={a.title} hint="Vigente" />
        ))}
      </Group>
    </div>
  );
}
