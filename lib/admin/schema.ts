import { z } from "zod";
import type { Field, Resource } from "./resources";

const REQUIRED = "Este campo es obligatorio.";
const urlOrEmpty = z.string().trim().refine((v) => v === "" || /^https?:\/\/[^\s]+$/i.test(v), "Introduce una dirección completa que empiece por https://");
const internalOrUrl = z.string().trim().refine((v) => v === "" || /^https?:\/\/[^\s]+$/i.test(v) || /^\/[^\s]*$/.test(v), "Introduce una ruta interna (/…) o una dirección https://");
const dateOrEmpty = z.string().refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Fecha no válida (dd/mm/aaaa).");
const dateTimeOrEmpty = z.string().refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v), "Fecha y hora no válidas.");

export const documentRow = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Indica el título del documento.").max(300),
  url: z.string().trim().refine((v) => /^https?:\/\//i.test(v) || /^\/uploads\//.test(v), "Enlace no válido (https://… o archivo subido)."),
});
export const linkRow = z.object({
  label: z.string().trim().min(1, "Indica el texto del enlace.").max(200),
  url: z.string().trim().refine((v) => /^https?:\/\//i.test(v) || /^\//.test(v), "Enlace no válido."),
});

export function fieldSchema(f: Field): z.ZodTypeAny {
  switch (f.type) {
    case "checkbox":
      return z.boolean();
    case "documents":
      return z.array(documentRow).max(50);
    case "links":
      return z.array(linkRow).max(20);
    case "url": {
      const s = f.name === "url" && f.required ? internalOrUrl : urlOrEmpty;
      return f.required ? s.refine((v) => v !== "", REQUIRED) : s;
    }
    case "date":
      return f.required ? dateOrEmpty.refine((v) => v !== "", REQUIRED) : dateOrEmpty;
    case "datetime":
      return f.required ? dateTimeOrEmpty.refine((v) => v !== "", REQUIRED) : dateTimeOrEmpty;
    case "number":
      return z.string().refine((v) => v === "" || /^-?\d+$/.test(v), "Debe ser un número entero.");
    default: {
      if (f.type === "text" && f.name === "url") {
        return f.required ? internalOrUrl.refine((v) => v !== "", REQUIRED) : internalOrUrl;
      }
      let s = z.string().trim().max(f.max ?? 40000, `Máximo ${f.max ?? 40000} caracteres.`);
      if (f.required) s = s.min(1, REQUIRED);
      return s;
    }
  }
}

/** Esquema Zod del formulario (valores tal como los maneja el navegador: cadenas y booleanos). */
export function formSchema(resource: Resource) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of resource.fields) shape[f.name] = fieldSchema(f);
  return z.object(shape).superRefine((v, ctx) => {
    const pairs: Array<[string, string, string]> = [
      ["publishAt", "expiresAt", "La fecha de retirada debe ser posterior a la de publicación."],
      ["startDate", "endDate", "La fecha de fin no puede ser anterior a la de inicio."],
      ["startsAt", "endsAt", "La fecha de fin no puede ser anterior a la de inicio."],
      ["openingDate", "deadline", "La fecha límite no puede ser anterior a la de apertura."],
    ];
    for (const [a, b, msg] of pairs) {
      const va = v[a] as string | undefined;
      const vb = v[b] as string | undefined;
      if (va && vb && vb.slice(0, 16) < va.slice(0, 16)) ctx.addIssue({ code: "custom", path: [b], message: msg });
    }
  });
}

export type FormValues = Record<string, string | boolean | Array<Record<string, string>>>;

/** Valores vacíos por defecto para un formulario nuevo. */
export function emptyValues(resource: Resource): FormValues {
  const v: FormValues = {};
  for (const f of resource.fields) {
    if (f.type === "checkbox") v[f.name] = f.name === "showOnHome" || f.name === "online";
    else if (f.type === "documents" || f.type === "links") v[f.name] = [];
    else if (f.type === "select") v[f.name] = f.options?.[0]?.value ?? "";
    else v[f.name] = "";
  }
  return v;
}
