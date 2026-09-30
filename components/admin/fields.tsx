"use client";
import { createContext, useContext, useId, useState } from "react";
import { useFieldArray, useFormContext, type FieldError, type FieldErrors } from "react-hook-form";
import { FileText, Link2, Plus, Trash2 } from "lucide-react";
import type { Field } from "@/lib/admin/resources";
import { MediaUploader } from "./MediaUploader";
import { cn } from "@/lib/cn";

export type Lookups = {
  categories: Record<string, Array<{ id: string; name: string }>>;
  areas: Array<{ id: string; name: string }>;
  media: Array<{ id: string; url: string; filename: string; alt: string; mimeType: string }>;
};

export const LookupsContext = createContext<Lookups>({ categories: {}, areas: [], media: [] });

const inputCls =
  "block w-full min-h-12 rounded-[4px] border border-stone-300 bg-white px-3 py-2 text-base text-ink placeholder:text-muted focus:border-forest-700 aria-[invalid=true]:border-urgent";

function getError(errors: FieldErrors, path: string): string | undefined {
  const e = path.split(".").reduce<unknown>((acc, k) => (acc as Record<string, unknown> | undefined)?.[k], errors) as FieldError | undefined;
  return e?.message as string | undefined;
}

function Wrapper({ id, field, error, children, inline = false }: { id: string; field: Field; error?: string; children: React.ReactNode; inline?: boolean }) {
  const helpId = `${id}-help`;
  const errId = `${id}-error`;
  if (inline) {
    return (
      <div>
        <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3">
          {children}
          <span className="pt-0.5 font-semibold text-ink">{field.label}</span>
        </label>
        {field.help && <p id={helpId} className="ml-8 text-sm text-muted">{field.help}</p>}
      </div>
    );
  }
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-semibold text-ink">
        {field.label} {field.required && <span className="text-sm font-normal text-muted">(obligatorio)</span>}
      </label>
      {children}
      {field.help && (
        <p id={helpId} className="mt-1.5 text-sm text-muted">
          {field.help}
        </p>
      )}
      {error && (
        <p id={errId} className="mt-1.5 text-sm font-semibold text-urgent">
          {error}
        </p>
      )}
    </div>
  );
}

/** Control de formulario para un campo declarado en lib/admin/resources.ts. */
export function FieldControl({ field, prefix = "" }: { field: Field; prefix?: string }) {
  const { register, formState } = useFormContext();
  const lookups = useContext(LookupsContext);
  const uid = useId();
  const name = prefix + field.name;
  const id = `${uid}-${field.name}`;
  const error = getError(formState.errors, name);
  const describedBy = [field.help ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  const common = { id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, "aria-required": field.required || undefined };

  switch (field.type) {
    case "checkbox":
      return (
        <Wrapper id={id} field={field} error={error} inline>
          <input type="checkbox" {...register(name)} {...common} className="mt-0.5 size-5 shrink-0 accent-forest-700" />
        </Wrapper>
      );
    case "textarea":
    case "markdown":
      return (
        <Wrapper id={id} field={field} error={error}>
          <textarea {...register(name)} {...common} rows={field.type === "markdown" ? 10 : 3} placeholder={field.placeholder} className={cn(inputCls, field.type === "markdown" && "font-mono text-[0.9375rem]")} />
        </Wrapper>
      );
    case "select":
      return (
        <Wrapper id={id} field={field} error={error}>
          <select {...register(name)} {...common} className={inputCls}>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Wrapper>
      );
    case "category":
    case "area": {
      const opts = field.type === "area" ? lookups.areas : (lookups.categories[field.scope ?? ""] ?? []);
      return (
        <Wrapper id={id} field={field} error={error}>
          <select {...register(name)} {...common} className={inputCls}>
            <option value="">— Sin asignar —</option>
            {opts.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </Wrapper>
      );
    }
    case "media":
      return <MediaField field={field} name={name} id={id} error={error} />;
    case "documents":
      return <DocumentsField field={field} name={name} />;
    case "links":
      return <LinksField field={field} name={name} />;
    default: {
      const type = field.type === "url" ? "url" : field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : field.type === "number" ? "number" : "text";
      return (
        <Wrapper id={id} field={field} error={error}>
          <input type={type} {...register(name)} {...common} placeholder={field.placeholder} className={inputCls} inputMode={field.type === "number" ? "numeric" : undefined} />
        </Wrapper>
      );
    }
  }
}

function MediaField({ field, name, id, error }: { field: Field; name: string; id: string; error?: string }) {
  const { register, setValue, watch } = useFormContext();
  const lookups = useContext(LookupsContext);
  const [extra, setExtra] = useState<Lookups["media"]>([]);
  const all = [...extra, ...lookups.media].filter((m) => m.mimeType.startsWith("image/"));
  const current = all.find((m) => m.id === watch(name));
  return (
    <Wrapper id={id} field={field} error={error}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="grid aspect-[4/3] w-40 shrink-0 place-items-center overflow-hidden rounded-[6px] border border-stone-200 bg-stone-100">
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm text-muted">Sin imagen</span>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <select {...register(name)} id={id} className={inputCls}>
            <option value="">— Sin imagen —</option>
            {all.map((m) => (
              <option key={m.id} value={m.id}>
                {m.filename}
              </option>
            ))}
          </select>
          <MediaUploader
            accept="image/jpeg,image/png,image/webp"
            label="Subir una imagen nueva"
            onUploaded={(m) => {
              setExtra((e) => [{ id: m.id, url: m.url, filename: m.filename, alt: "", mimeType: m.mimeType }, ...e]);
              setValue(name, m.id, { shouldDirty: true });
            }}
          />
        </div>
      </div>
    </Wrapper>
  );
}

function DocumentsField({ field, name }: { field: Field; name: string }) {
  const { control, register, setValue, formState } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });
  const uid = useId();
  return (
    <fieldset className="rounded-[8px] border border-stone-200 p-4">
      <legend className="px-1 font-semibold text-ink">{field.label}</legend>
      {fields.length === 0 && <p className="text-sm text-muted">Sin documentos. Añade enlaces oficiales o sube un PDF.</p>}
      <ul className="space-y-4">
        {fields.map((f, i) => {
          const tErr = getError(formState.errors, `${name}.${i}.title`);
          const uErr = getError(formState.errors, `${name}.${i}.url`);
          return (
            <li key={f.id} className="rounded-[6px] bg-stone-100 p-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-t${i}`} className="mb-1 flex items-center gap-1.5 text-sm font-semibold">
                    <FileText aria-hidden className="size-4 text-earth" /> Título del documento {i + 1}
                  </label>
                  <input id={`${uid}-t${i}`} {...register(`${name}.${i}.title`)} aria-invalid={tErr ? true : undefined} className={inputCls} />
                  {tErr && <p className="mt-1 text-sm font-semibold text-urgent">{tErr}</p>}
                </div>
                <div>
                  <label htmlFor={`${uid}-u${i}`} className="mb-1 flex items-center gap-1.5 text-sm font-semibold">
                    <Link2 aria-hidden className="size-4 text-earth" /> Enlace (https://… o archivo subido)
                  </label>
                  <input id={`${uid}-u${i}`} {...register(`${name}.${i}.url`)} aria-invalid={uErr ? true : undefined} className={inputCls} />
                  {uErr && <p className="mt-1 text-sm font-semibold text-urgent">{uErr}</p>}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                <MediaUploader accept="application/pdf" label="Subir PDF" onUploaded={(m) => setValue(`${name}.${i}.url`, m.url, { shouldDirty: true, shouldValidate: true })} />
                <button type="button" onClick={() => remove(i)} className="inline-flex min-h-11 items-center gap-1.5 rounded-[4px] px-3 font-semibold text-urgent hover:bg-urgent-50">
                  <Trash2 aria-hidden className="size-4" /> Quitar documento {i + 1}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={() => append({ title: "", url: "" })} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[4px] border border-forest-700 px-4 font-semibold text-forest-700 hover:bg-forest-50">
        <Plus aria-hidden className="size-4" /> Añadir documento
      </button>
    </fieldset>
  );
}

function LinksField({ field, name }: { field: Field; name: string }) {
  const { control, register, formState } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });
  const uid = useId();
  return (
    <fieldset className="rounded-[8px] border border-stone-200 p-4">
      <legend className="px-1 font-semibold text-ink">{field.label}</legend>
      <ul className="space-y-3">
        {fields.map((f, i) => (
          <li key={f.id} className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div>
              <label htmlFor={`${uid}-l${i}`} className="mb-1 block text-sm font-semibold">Texto del enlace</label>
              <input id={`${uid}-l${i}`} {...register(`${name}.${i}.label`)} className={inputCls} />
              {getError(formState.errors, `${name}.${i}.label`) && <p className="mt-1 text-sm font-semibold text-urgent">{getError(formState.errors, `${name}.${i}.label`)}</p>}
            </div>
            <div>
              <label htmlFor={`${uid}-h${i}`} className="mb-1 block text-sm font-semibold">Dirección</label>
              <input id={`${uid}-h${i}`} {...register(`${name}.${i}.url`)} className={inputCls} />
              {getError(formState.errors, `${name}.${i}.url`) && <p className="mt-1 text-sm font-semibold text-urgent">{getError(formState.errors, `${name}.${i}.url`)}</p>}
            </div>
            <button type="button" onClick={() => remove(i)} className="inline-flex min-h-12 items-center gap-1 rounded-[4px] px-3 font-semibold text-urgent hover:bg-urgent-50">
              <Trash2 aria-hidden className="size-4" /> Quitar
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => append({ label: "", url: "" })} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-[4px] border border-forest-700 px-4 font-semibold text-forest-700 hover:bg-forest-50">
        <Plus aria-hidden className="size-4" /> Añadir enlace
      </button>
    </fieldset>
  );
}
