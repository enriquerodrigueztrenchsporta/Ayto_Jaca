"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn, signOut } from "@/lib/auth";
import { assertUser } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { runLifecycle } from "@/lib/content/lifecycle";
import { changeStatus, deleteItem, markVerified, saveItem, ValidationError, type SaveIntent } from "@/lib/admin/service";
import type { FormValues } from "@/lib/admin/schema";
import { createWeeklyUpdate, publishWeekly, saveChecklist, saveWeeklyDraft, type WeeklyPayload } from "@/lib/weekly/service";

export type ActionResult<T = unknown> = { ok: true; data?: T; message?: string } | { ok: false; message: string; errors?: Record<string, string> };

function fail(err: unknown): ActionResult<never> {
  if (err instanceof ValidationError) return { ok: false, message: err.message, errors: err.issues };
  const isDb = err instanceof Error && /Prisma|Invalid `/.test(err.name + err.message);
  const message = !(err instanceof Error) ? "Error inesperado" : isDb ? "No se ha podido guardar en la base de datos. Inténtalo de nuevo." : err.message;
  // No se registran datos personales ni contenidos completos en los logs: solo el tipo de error.
  const firstLine = err instanceof Error ? (err.message.split("\n").find((l) => l.trim()) ?? "") : "";
  console.error("[admin]", err instanceof Error ? `${err.name}: ${firstLine}`.slice(0, 200) : "error");
  return { ok: false, message };
}

// ─── Sesión ────────────────────────────────────────────────
export async function loginAction(_prev: { error?: string } | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/admin",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      const code = (err as AuthError & { code?: string }).code;
      return { error: code === "rate_limited" ? "Demasiados intentos. Espera 15 minutos antes de volver a intentarlo." : "Correo o contraseña incorrectos." };
    }
    throw err; // redirección de éxito
  }
  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

// ─── Contenidos ────────────────────────────────────────────
export async function saveResourceAction(resourceKey: string, id: string | null, values: FormValues, intent: SaveIntent): Promise<ActionResult<{ id: string; status?: string }>> {
  try {
    const actor = await assertUser();
    const saved = await saveItem({ resourceKey, id, values, intent, actor });
    const status = saved.status as string | undefined;
    const message =
      intent === "draft" ? "Borrador guardado." : status === "SCHEDULED" ? "Programado: se publicará automáticamente en la fecha indicada." : status === "PUBLISHED" ? "Publicado. Ya es visible en la web." : "Cambios guardados.";
    return { ok: true, data: { id: String(saved.id), status }, message };
  } catch (err) {
    return fail(err);
  }
}

export async function changeStatusAction(resourceKey: string, id: string, action: "archive" | "restore" | "publish"): Promise<ActionResult> {
  try {
    const actor = await assertUser();
    const status = await changeStatus({ resourceKey, id, action, actor });
    return { ok: true, message: action === "archive" ? "Archivado. Ya no se muestra en la web." : action === "restore" ? "Recuperado como borrador." : status === "SCHEDULED" ? "Programado." : "Publicado." };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteResourceAction(resourceKey: string, id: string): Promise<ActionResult> {
  try {
    const actor = await assertUser();
    await deleteItem({ resourceKey, id, actor });
  } catch (err) {
    return fail(err);
  }
  redirect(`/admin/${resourceKey}`);
}

export async function markVerifiedAction(resourceKey: string, id: string): Promise<ActionResult> {
  try {
    const actor = await assertUser();
    await markVerified({ resourceKey, id, actor });
    return { ok: true, message: "Marcado como verificado hoy." };
  } catch (err) {
    return fail(err);
  }
}

export async function runLifecycleAction(): Promise<ActionResult> {
  try {
    await assertUser();
    const r = await runLifecycle();
    return { ok: true, message: `Publicados ${r.scheduledToPublished} programados · archivados ${r.expiredArchived + r.alertsArchived + r.eventsArchived} caducados.` };
  } catch (err) {
    return fail(err);
  }
}

// ─── Actualización semanal ─────────────────────────────────
export async function createWeeklyAction() {
  const actor = await assertUser();
  const w = await createWeeklyUpdate(actor);
  redirect(`/admin/actualizacion-semanal/${w.id}`);
}

export async function saveWeeklyAction(id: string, payload: WeeklyPayload): Promise<ActionResult<WeeklyPayload>> {
  try {
    const actor = await assertUser();
    const next = await saveWeeklyDraft(id, payload, actor);
    return { ok: true, data: next, message: "Borrador guardado." };
  } catch (err) {
    return fail(err);
  }
}

export async function publishWeeklyAction(id: string): Promise<ActionResult<Record<string, number>>> {
  try {
    const actor = await assertUser();
    const counts = await publishWeekly(id, actor);
    return { ok: true, data: counts, message: "Cambios publicados en la web." };
  } catch (err) {
    return fail(err);
  }
}

export async function saveChecklistAction(id: string, checklist: Record<string, boolean>): Promise<ActionResult> {
  try {
    await assertUser();
    await saveChecklist(id, checklist);
    return { ok: true };
  } catch (err) {
    return fail(err);
  }
}

// ─── Configuración y usuarios ──────────────────────────────
const settingsSchema = z.object({ officeHours: z.string().trim().max(500), generalEmail: z.string().trim().max(200) });

export async function saveSettingsAction(values: { officeHours: string; generalEmail: string }): Promise<ActionResult> {
  try {
    const actor = await assertUser(["ADMIN"]);
    const parsed = settingsSchema.parse(values);
    await db.setting.upsert({ where: { key: "general" }, update: { value: parsed }, create: { key: "general", value: parsed } });
    await audit({ action: "SETTINGS", entityType: "Setting", entityId: "general", entityTitle: "Configuración general", user: actor });
    return { ok: true, message: "Configuración guardada." };
  } catch (err) {
    return fail(err);
  }
}

const passwordRule = z.string().min(12, "La contraseña debe tener al menos 12 caracteres.").max(200);
const newUserSchema = z.object({
  name: z.string().trim().min(2, "Indica el nombre.").max(120),
  email: z.string().trim().toLowerCase().email("Correo no válido."),
  role: z.enum(["ADMIN", "EDITOR"]),
  password: passwordRule,
});

export async function createUserAction(values: z.input<typeof newUserSchema>): Promise<ActionResult> {
  try {
    const actor = await assertUser(["ADMIN"]);
    const v = newUserSchema.safeParse(values);
    if (!v.success) return { ok: false, message: "Revisa los campos.", errors: Object.fromEntries(v.error.issues.map((i) => [String(i.path[0]), i.message])) };
    if (await db.user.findUnique({ where: { email: v.data.email } })) return { ok: false, message: "Ya existe un usuario con ese correo.", errors: { email: "Ya existe un usuario con ese correo." } };
    const u = await db.user.create({ data: { name: v.data.name, email: v.data.email, role: v.data.role, passwordHash: await bcrypt.hash(v.data.password, 12) } });
    await audit({ action: "CREATE", entityType: "User", entityId: u.id, entityTitle: u.email, user: actor });
    return { ok: true, message: "Usuario creado." };
  } catch (err) {
    return fail(err);
  }
}

export async function changePasswordAction(values: { current: string; next: string }): Promise<ActionResult> {
  try {
    const actor = await assertUser();
    const next = passwordRule.safeParse(values.next);
    if (!next.success) return { ok: false, message: next.error.issues[0].message, errors: { next: next.error.issues[0].message } };
    const user = await db.user.findUnique({ where: { id: actor.id } });
    if (!user || !(await bcrypt.compare(values.current, user.passwordHash))) return { ok: false, message: "La contraseña actual no es correcta.", errors: { current: "La contraseña actual no es correcta." } };
    await db.user.update({ where: { id: actor.id }, data: { passwordHash: await bcrypt.hash(values.next, 12) } });
    await audit({ action: "UPDATE", entityType: "User", entityId: actor.id, entityTitle: "Cambio de contraseña", user: actor });
    return { ok: true, message: "Contraseña actualizada." };
  } catch (err) {
    return fail(err);
  }
}

export async function toggleUserAction(userId: string): Promise<ActionResult> {
  try {
    const actor = await assertUser(["ADMIN"]);
    if (userId === actor.id) return { ok: false, message: "No puedes desactivar tu propio usuario." };
    const u = await db.user.findUnique({ where: { id: userId } });
    if (!u) return { ok: false, message: "Usuario no encontrado." };
    await db.user.update({ where: { id: userId }, data: { active: !u.active } });
    await audit({ action: "UPDATE", entityType: "User", entityId: userId, entityTitle: `${u.email} ${u.active ? "desactivado" : "activado"}`, user: actor });
    return { ok: true, message: u.active ? "Usuario desactivado." : "Usuario activado." };
  } catch (err) {
    return fail(err);
  }
}
