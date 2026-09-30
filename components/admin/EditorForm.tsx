"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, BadgeCheck, Eye, RotateCcw, Save, Send, Trash2 } from "lucide-react";
import { getResource, type Field } from "@/lib/admin/resources";
import { formSchema, type FormValues } from "@/lib/admin/schema";
import { changeStatusAction, deleteResourceAction, markVerifiedAction, saveResourceAction } from "@/app/admin/actions";
import { FieldControl, LookupsContext, type Lookups } from "./fields";
import { ConfirmDialog } from "./ConfirmDialog";
import { StatusMessage } from "./StatusMessage";

type Props = {
  resourceKey: string;
  id: string | null;
  initialValues: FormValues;
  lookups: Lookups;
  status?: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  previewHref?: string | null;
  initialMessage?: string | null;
};

const GROUPS: Array<{ key: NonNullable<Field["group"]>; title: string; description?: string }> = [
  { key: "principal", title: "Contenido" },
  { key: "detalle", title: "Detalles, imágenes y documentos" },
  { key: "publicacion", title: "Publicación", description: "Programa cuándo aparece y cuándo se retira automáticamente." },
  { key: "fuente", title: "Fuente y verificación", description: "Indica de dónde procede la información para poder revisarla." },
];

/** Formulario genérico de edición, dirigido por la configuración del recurso. */
export function EditorForm({ resourceKey, id, initialValues, lookups, status, previewHref, initialMessage }: Props) {
  const resource = getResource(resourceKey)!;
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(initialMessage ? { tone: "ok", text: initialMessage } : null);
  const [confirm, setConfirm] = useState<null | "delete" | "archive">(null);
  const methods = useForm<FormValues>({ defaultValues: initialValues, resolver: zodResolver(formSchema(resource)) as never, mode: "onBlur" });
  const isLive = status === "PUBLISHED" || status === "SCHEDULED";

  function submit(intent: "draft" | "publish" | "save") {
    return methods.handleSubmit(
      (values) =>
        start(async () => {
          setMsg(null);
          const res = await saveResourceAction(resourceKey, id, values, intent);
          if (!res.ok) {
            Object.entries(res.errors ?? {}).forEach(([k, m]) => methods.setError(k as never, { message: m }));
            setMsg({ tone: "error", text: res.message });
            return;
          }
          setMsg({ tone: "ok", text: res.message ?? "Guardado." });
          methods.reset(values);
          if (!id && res.data) router.replace(`/admin/${resourceKey}/${res.data.id}?guardado=${intent}`);
          else router.refresh();
        }),
      () => setMsg({ tone: "error", text: "Revisa los campos marcados en rojo." }),
    )();
  }

  function simple(action: () => Promise<{ ok: boolean; message?: string }>) {
    start(async () => {
      const res = await action();
      setMsg({ tone: res.ok ? "ok" : "error", text: res.message ?? "" });
      setConfirm(null);
      router.refresh();
    });
  }

  const hasField = (name: string) => resource.fields.some((f) => f.name === name);

  return (
    <LookupsContext.Provider value={lookups}>
      <FormProvider {...methods}>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            submit(resource.publishable ? (isLive ? "save" : "draft") : "save");
          }}
          className="grid gap-8 xl:grid-cols-[1fr_300px]"
        >
          <div className="space-y-8">
            {GROUPS.map((g) => {
              const fields = resource.fields.filter((f) => (f.group ?? "principal") === g.key);
              if (!fields.length) return null;
              return (
                <fieldset key={g.key} className="rounded-[10px] border border-stone-200 bg-white p-5 md:p-7">
                  <legend className="sr-only">{g.title}</legend>
                  <h2 className="font-serif text-h3 font-medium" aria-hidden>
                    {g.title}
                  </h2>
                  {g.description && <p className="mt-1 text-sm text-muted">{g.description}</p>}
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    {fields.map((f) => (
                      <div key={f.name} className={["textarea", "markdown", "documents", "links", "media", "checkbox"].includes(f.type) || f.name === "title" ? "md:col-span-2" : undefined}>
                        <FieldControl field={f} />
                      </div>
                    ))}
                  </div>
                </fieldset>
              );
            })}
          </div>

          <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start" aria-label="Acciones">
            <div className="space-y-3 rounded-[10px] border border-stone-200 bg-white p-5">
              <StatusMessage message={msg?.text} tone={msg?.tone ?? "ok"} />
              {resource.publishable ? (
                <>
                  {!isLive && (
                    <button type="button" disabled={pending} onClick={() => submit("draft")} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] border-[1.5px] border-forest-700 font-semibold text-forest-700 hover:bg-forest-50 disabled:opacity-60">
                      <Save aria-hidden className="size-4" /> Guardar borrador
                    </button>
                  )}
                  <button type="button" disabled={pending} onClick={() => submit(isLive ? "save" : "publish")} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] bg-forest-700 font-semibold text-snow hover:bg-forest-600 disabled:opacity-60">
                    <Send aria-hidden className="size-4" /> {isLive ? "Guardar y actualizar la web" : "Publicar"}
                  </button>
                </>
              ) : (
                <button type="submit" disabled={pending} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] bg-forest-700 font-semibold text-snow hover:bg-forest-600 disabled:opacity-60">
                  <Save aria-hidden className="size-4" /> Guardar
                </button>
              )}
              {previewHref && id && (
                <Link href={previewHref} target="_blank" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] border border-stone-300 font-semibold hover:bg-stone-100">
                  <Eye aria-hidden className="size-4" /> Previsualizar
                </Link>
              )}
              {methods.formState.isDirty && <p className="text-sm text-important">Hay cambios sin guardar.</p>}
            </div>

            {id && (
              <div className="space-y-2 rounded-[10px] border border-stone-200 bg-white p-5">
                {hasField("lastVerifiedAt") && (
                  <button type="button" disabled={pending} onClick={() => simple(() => markVerifiedAction(resourceKey, id))} className="flex min-h-11 w-full items-center gap-2 rounded-[4px] px-3 font-semibold text-forest-700 hover:bg-forest-50">
                    <BadgeCheck aria-hidden className="size-4" /> Marcar como verificado hoy
                  </button>
                )}
                {resource.publishable && status !== "ARCHIVED" && status !== "DRAFT" && (
                  <button type="button" onClick={() => setConfirm("archive")} className="flex min-h-11 w-full items-center gap-2 rounded-[4px] px-3 font-semibold text-important hover:bg-important-50">
                    <Archive aria-hidden className="size-4" /> Archivar (retirar de la web)
                  </button>
                )}
                {resource.publishable && status === "ARCHIVED" && (
                  <button type="button" disabled={pending} onClick={() => simple(() => changeStatusAction(resourceKey, id, "restore"))} className="flex min-h-11 w-full items-center gap-2 rounded-[4px] px-3 font-semibold text-forest-700 hover:bg-forest-50">
                    <RotateCcw aria-hidden className="size-4" /> Recuperar como borrador
                  </button>
                )}
                {(!resource.publishable || status === "DRAFT") && (
                  <button type="button" onClick={() => setConfirm("delete")} className="flex min-h-11 w-full items-center gap-2 rounded-[4px] px-3 font-semibold text-urgent hover:bg-urgent-50">
                    <Trash2 aria-hidden className="size-4" /> Eliminar
                  </button>
                )}
              </div>
            )}
          </aside>
        </form>
        <ConfirmDialog
          open={confirm === "archive"}
          title={`¿Archivar ${resource.article} ${resource.singular}?`}
          confirmLabel="Archivar"
          busy={pending}
          onCancel={() => setConfirm(null)}
          onConfirm={() => simple(() => changeStatusAction(resourceKey, id!, "archive"))}
        >
          Dejará de mostrarse en la web, pero no se borra: podrás recuperarlo cuando quieras.
        </ConfirmDialog>
        <ConfirmDialog
          open={confirm === "delete"}
          title={`¿Eliminar ${resource.article} ${resource.singular}?`}
          confirmLabel="Eliminar definitivamente"
          tone="danger"
          busy={pending}
          onCancel={() => setConfirm(null)}
          onConfirm={() => start(async () => { const r = await deleteResourceAction(resourceKey, id!); if (r && !r.ok) { setMsg({ tone: "error", text: r.message }); setConfirm(null); } })}
        >
          Esta acción no se puede deshacer.
        </ConfirmDialog>
      </FormProvider>
    </LookupsContext.Provider>
  );
}
