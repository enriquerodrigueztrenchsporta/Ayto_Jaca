"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, useTransition } from "react";
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, Lock, Save, Send } from "lucide-react";
import { STEPS } from "@/lib/weekly/steps";
import type { WeeklyPayload } from "@/lib/weekly/shared";
import { publishWeeklyAction, saveWeeklyAction } from "@/app/admin/actions";
import { LookupsContext, type Lookups } from "../fields";
import { ConfirmDialog } from "../ConfirmDialog";
import { StatusMessage } from "../StatusMessage";
import { CollectionStepView } from "./CollectionStepView";
import { FeaturedStep, type FeaturedCandidates } from "./FeaturedStep";
import { cn } from "@/lib/cn";

type Props = { weeklyId: string; initial: WeeklyPayload; lookups: Lookups; candidates: FeaturedCandidates; locked: boolean; checklist: React.ReactNode };

const COUNT_LABELS: Array<[keyof WeeklyPayload, string, string]> = [
  ["news", "noticia", "noticias"],
  ["events", "evento", "eventos"],
  ["alerts", "aviso", "avisos"],
  ["mobility", "corte u obra", "cortes u obras"],
  ["grants", "convocatoria", "convocatorias"],
  ["jobs", "proceso de empleo", "procesos de empleo"],
  ["sessions", "sesión", "sesiones"],
];

export function WeeklyWizard({ weeklyId, initial, lookups, candidates, locked, checklist }: Props) {
  const router = useRouter();
  const uid = useId();
  const [step, setStep] = useState(0);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [published, setPublished] = useState<Record<string, number> | null>(null);
  const methods = useForm<WeeklyPayload>({ defaultValues: initial });
  const values = useWatch({ control: methods.control }) as WeeklyPayload;
  const current = STEPS[step];

  const counts = COUNT_LABELS.map(([k, s, p]) => ({ key: k, n: (values[k] as unknown[] | undefined)?.length ?? 0, s, p }));
  const n = (k: keyof WeeklyPayload) => counts.find((c) => c.key === k)?.n ?? 0;
  const summaryText = `Estás a punto de actualizar ${n("news")} noticias, ${n("events")} eventos y ${n("alerts") + n("mobility")} avisos`;

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (methods.formState.isDirty && !locked) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [methods.formState.isDirty, locked]);

  async function save(): Promise<boolean> {
    setMsg(null);
    methods.clearErrors();
    const res = await saveWeeklyAction(weeklyId, methods.getValues());
    if (!res.ok) {
      Object.entries(res.errors ?? {}).forEach(([k, m]) => methods.setError(k as never, { message: m }));
      const first = Object.keys(res.errors ?? {})[0]?.split(".")[0];
      const idx = STEPS.findIndex((s) => s.kind === "collection" && s.collection === first);
      if (idx >= 0) setStep(idx);
      setMsg({ tone: "error", text: `${res.message} Hay campos pendientes en «${idx >= 0 ? STEPS[idx].title : "el formulario"}».` });
      return false;
    }
    if (res.data) methods.reset(res.data);
    setMsg({ tone: "ok", text: res.message ?? "Borrador guardado." });
    return true;
  }

  function goTo(i: number) {
    setStep(i);
    document.getElementById(`${uid}-step-title`)?.focus();
  }

  if (published) {
    return (
      <div className="max-w-3xl rounded-[10px] border border-ok/30 bg-white p-8">
        <CheckCircle2 aria-hidden className="size-10 text-ok" />
        <h2 className="mt-3 font-serif text-h2 font-medium">Cambios publicados</h2>
        <p className="mt-2 text-ink-2" role="status">
          Se han publicado {published.news} noticias, {published.events} eventos, {published.alerts} avisos, {published.grants} convocatorias, {published.jobs} procesos de empleo y {published.sessions} sesiones. Los contenidos con fecha futura quedan programados.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" target="_blank" className="inline-flex min-h-12 items-center rounded-[4px] bg-forest-700 px-5 font-semibold text-snow">Ver la web</Link>
          <Link href="/admin" className="inline-flex min-h-12 items-center rounded-[4px] border border-stone-300 px-5 font-semibold">Volver al resumen</Link>
        </div>
      </div>
    );
  }

  return (
    <LookupsContext.Provider value={lookups}>
      <FormProvider {...methods}>
        <div className="grid gap-8 xl:grid-cols-[240px_1fr_300px]">
          <nav aria-label="Pasos de la actualización semanal" className="xl:sticky xl:top-6 xl:self-start">
            <ol className="flex gap-1 overflow-x-auto pb-2 xl:flex-col xl:overflow-visible">
              {STEPS.map((s, i) => {
                const count = s.kind === "collection" ? n(s.collection) : null;
                return (
                  <li key={s.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === step ? "step" : undefined}
                      className={cn(
                        "flex min-h-11 w-full items-center gap-3 rounded-[6px] px-3 text-left text-[0.9375rem] font-semibold",
                        i === step ? "bg-forest-700 text-snow" : "text-ink-2 hover:bg-white",
                      )}
                    >
                      <span className={cn("grid size-7 shrink-0 place-items-center rounded-full text-sm", i === step ? "bg-snow text-forest-700" : "bg-stone-200")}>{i + 1}</span>
                      <span className="whitespace-nowrap xl:whitespace-normal">{s.title}</span>
                      {count ? <span className={cn("ml-auto rounded-full px-2 text-sm", i === step ? "bg-forest-800" : "bg-stone-200")}>{count}</span> : null}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <form noValidate onSubmit={(e) => e.preventDefault()} className="min-w-0">
            <p className="eyebrow">Paso {step + 1} de {STEPS.length}</p>
            <h2 id={`${uid}-step-title`} tabIndex={-1} className="mt-1 font-serif text-h2 font-medium text-forest-900 focus:outline-none">
              {current.title}
            </h2>
            <p className="mb-6 mt-1 text-ink-2">{current.description}</p>
            {locked && (
              <p className="mb-6 flex items-center gap-2 rounded-[8px] bg-stone-200 px-4 py-3 font-semibold text-ink-2">
                <Lock aria-hidden className="size-5" /> Esta actualización ya está publicada. Para corregir un contenido, edítalo desde su sección.
              </p>
            )}

            {current.kind === "week" && <WeekStep />}
            {current.kind === "collection" && <CollectionStepView step={current} locked={locked} />}
            {current.kind === "featured" && <FeaturedStep candidates={candidates} />}
            {current.kind === "review" && (
              <div className="space-y-6">
                <div className="rounded-[10px] border border-stone-200 bg-white p-6">
                  <h3 className="font-serif text-h3 font-medium">Resumen de cambios</h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {counts.map((c) => (
                      <li key={String(c.key)} className="flex items-center justify-between rounded-[6px] bg-stone-100 px-4 py-3">
                        <span className="font-semibold">{c.n === 1 ? c.s : c.p}</span>
                        <span className="font-serif text-2xl text-forest-900">{c.n}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-5 space-y-1 text-[0.9375rem] text-ink-2">
                    {(["alerts", "news", "events", "grants", "jobs", "sessions", "mobility"] as const).flatMap((k) =>
                      ((values[k] as Array<{ title?: string }> | undefined) ?? []).map((it, i) => (
                        <li key={`${k}-${i}`}>· {it.title || "(sin título)"}</li>
                      )),
                    )}
                  </ul>
                </div>
                {!locked && (
                  <p className="text-ink-2">
                    Guarda el borrador para revisar en la previsualización cómo quedará la portada. Al publicar, lo que tenga una fecha de publicación futura quedará programado.
                  </p>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-6">
              <button type="button" disabled={step === 0} onClick={() => goTo(step - 1)} className="inline-flex min-h-12 items-center gap-2 rounded-[4px] border border-stone-300 bg-white px-4 font-semibold disabled:opacity-40">
                <ArrowLeft aria-hidden className="size-4" /> Anterior
              </button>
              {step < STEPS.length - 1 && (
                <button type="button" onClick={() => goTo(step + 1)} className="inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-forest-700 px-5 font-semibold text-snow hover:bg-forest-600">
                  Siguiente: {STEPS[step + 1].title} <ArrowRight aria-hidden className="size-4" />
                </button>
              )}
            </div>
          </form>

          <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start" aria-label="Acciones de la actualización">
            <div className="space-y-3 rounded-[10px] border border-stone-200 bg-white p-5">
              <StatusMessage message={msg?.text} tone={msg?.tone ?? "ok"} />
              {!locked && (
                <>
                  <button type="button" disabled={pending} onClick={() => start(async () => void (await save()))} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] border-[1.5px] border-forest-700 font-semibold text-forest-700 hover:bg-forest-50 disabled:opacity-60">
                    <Save aria-hidden className="size-4" /> Guardar borrador
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      start(async () => {
                        if (await save()) window.open(`/preview/semana/${weeklyId}`, "_blank", "noopener");
                      })
                    }
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] border border-stone-300 font-semibold hover:bg-stone-100 disabled:opacity-60"
                  >
                    <Eye aria-hidden className="size-4" /> Previsualizar
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      start(async () => {
                        if (await save()) setConfirming(true);
                      })
                    }
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] bg-forest-700 font-semibold text-snow hover:bg-forest-600 disabled:opacity-60"
                  >
                    <Send aria-hidden className="size-4" /> Publicar cambios
                  </button>
                  {methods.formState.isDirty && <p className="text-sm text-important">Hay cambios sin guardar.</p>}
                </>
              )}
            </div>
            {checklist}
          </aside>
        </div>
        <ConfirmDialog
          open={confirming}
          title="Confirmar publicación"
          confirmLabel="Publicar ahora"
          busy={pending}
          onCancel={() => setConfirming(false)}
          onConfirm={() =>
            start(async () => {
              const res = await publishWeeklyAction(weeklyId);
              setConfirming(false);
              if (res.ok) {
                setPublished(res.data ?? {});
                router.refresh();
              } else setMsg({ tone: "error", text: res.message });
            })
          }
        >
          <p className="text-lg font-semibold text-ink">{summaryText}.</p>
          <p className="mt-2">
            Además: {n("grants")} convocatorias, {n("jobs")} procesos de empleo, {n("sessions")} sesiones y {n("mobility")} cortes u obras (incluidos en los avisos).
          </p>
        </ConfirmDialog>
      </FormProvider>
    </LookupsContext.Provider>
  );
}

function WeekStep() {
  const uid = useId();
  const { register } = useFormContext<WeeklyPayload>();
  const cls = "block w-full min-h-12 rounded-[4px] border border-stone-300 bg-white px-3 py-2";
  return (
    <div className="grid gap-5 rounded-[10px] border border-stone-200 bg-white p-6 md:grid-cols-2">
      <div>
        <label htmlFor={`${uid}-date`} className="mb-1.5 block font-semibold">Fecha de actualización</label>
        <input id={`${uid}-date`} type="date" {...register("week.updateDate")} className={cls} />
      </div>
      <div>
        <label htmlFor={`${uid}-label`} className="mb-1.5 block font-semibold">Semana</label>
        <input id={`${uid}-label`} {...register("week.weekLabel")} className={cls} />
      </div>
      <div className="md:col-span-2">
        <label htmlFor={`${uid}-notes`} className="mb-1.5 block font-semibold">Notas internas</label>
        <textarea id={`${uid}-notes`} rows={4} {...register("week.notes")} className={cls} aria-describedby={`${uid}-notes-help`} />
        <p id={`${uid}-notes-help`} className="mt-1.5 text-sm text-muted">Solo las ve el equipo del panel. Ej.: «Pendiente confirmar horario del pleno».</p>
      </div>
    </div>
  );
}
