"use client";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import type { CollectionStep } from "@/lib/weekly/steps";
import { newItem, type WeeklyPayload } from "@/lib/weekly/shared";
import { FieldControl } from "../fields";

const WIDE = new Set(["textarea", "markdown", "documents", "links", "media", "checkbox"]);

/** Paso con una lista 0..N de elementos (avisos, noticias, eventos…). */
export function CollectionStepView({ step, locked }: { step: CollectionStep; locked: boolean }) {
  const { control, formState } = useFormContext<WeeklyPayload>();
  const { fields, append, remove } = useFieldArray({ control, name: step.collection as never });
  const items = useWatch({ control, name: step.collection }) as Array<Record<string, unknown>> | undefined;
  const errors = (formState.errors as Record<string, unknown>)[step.collection] as unknown[] | undefined;

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="rounded-[8px] border border-dashed border-stone-300 bg-white px-5 py-6 text-center text-ink-2">
          No hay nada que añadir en este apartado esta semana. Si es así, pasa al siguiente paso.
        </p>
      )}
      {fields.map((f, i) => {
        const title = String(items?.[i]?.title ?? "") || `${step.itemLabel} ${i + 1} (sin título)`;
        const hasError = Boolean(errors?.[i]);
        return (
          <details key={f.id} open={!items?.[i]?.id || hasError} className="group rounded-[10px] border border-stone-200 bg-white open:border-forest-700/40">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3">
              <span className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-forest-50 font-semibold text-forest-700">{i + 1}</span>
                <span className="font-semibold text-ink">{title}</span>
                {hasError && <span className="rounded bg-urgent-50 px-2 text-sm font-semibold text-urgent">Revisar</span>}
                {Boolean(items?.[i]?.id) && <span className="rounded bg-stone-100 px-2 text-sm text-muted">Borrador guardado</span>}
              </span>
              <ChevronDown aria-hidden className="size-5 text-muted transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-stone-200 px-5 pb-5 pt-4">
              <div className="grid gap-5 md:grid-cols-2">
                {step.fields.map((field) => (
                  <div key={field.name} className={WIDE.has(field.type) || field.name === "title" ? "md:col-span-2" : undefined}>
                    <FieldControl field={field} prefix={`${step.collection}.${i}.`} />
                  </div>
                ))}
              </div>
              {!locked && (
                <button type="button" onClick={() => remove(i)} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[4px] px-3 font-semibold text-urgent hover:bg-urgent-50">
                  <Trash2 aria-hidden className="size-4" /> Quitar {step.itemLabel.toLowerCase()} {i + 1}
                </button>
              )}
            </div>
          </details>
        );
      })}
      {!locked && (
        <button
          type="button"
          onClick={() => append(newItem(step.collection) as never)}
          className="inline-flex min-h-12 items-center gap-2 rounded-[4px] border-[1.5px] border-forest-700 bg-white px-5 font-semibold text-forest-700 hover:bg-forest-50"
        >
          <Plus aria-hidden className="size-5" /> {step.addLabel}
        </button>
      )}
    </div>
  );
}
