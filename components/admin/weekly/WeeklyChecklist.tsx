"use client";
import { useState, useTransition } from "react";
import { CHECKLIST } from "@/lib/weekly/shared";
import { saveChecklistAction } from "@/app/admin/actions";

/** Checklist semanal persistente (se guarda al marcar cada casilla). */
export function WeeklyChecklist({ weeklyId, initial }: { weeklyId: string; initial: Record<string, boolean> }) {
  const [state, setState] = useState<Record<string, boolean>>(initial);
  const [, start] = useTransition();
  const done = CHECKLIST.filter((c) => state[c]).length;
  return (
    <section aria-labelledby="checklist-title" className="rounded-[10px] border border-stone-200 bg-white p-5">
      <h2 id="checklist-title" className="font-serif text-h3 font-medium">Checklist semanal</h2>
      <p className="text-sm text-muted" aria-live="polite">{done} de {CHECKLIST.length} completadas</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200" aria-hidden>
        <div className="h-full bg-forest-700 transition-[width]" style={{ width: `${(done / CHECKLIST.length) * 100}%` }} />
      </div>
      <ul className="mt-4 space-y-0.5">
        {CHECKLIST.map((item) => (
          <li key={item}>
            <label className="flex min-h-10 cursor-pointer items-start gap-3 rounded-[6px] px-1.5 py-1 hover:bg-stone-100">
              <input
                type="checkbox"
                checked={Boolean(state[item])}
                onChange={(e) => {
                  const next = { ...state, [item]: e.target.checked };
                  setState(next);
                  start(async () => {
                    await saveChecklistAction(weeklyId, next);
                  });
                }}
                className="mt-0.5 size-5 shrink-0 accent-forest-700"
              />
              <span className={state[item] ? "text-muted line-through" : "text-ink"}>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
