import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type SessionUser = { id: string; email: string; name: string; role: "ADMIN" | "EDITOR" };

/** Exige sesión en páginas del panel. Redirige a /admin/login si no la hay. */
export async function requireUser(): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? "",
    role: session.user.role,
  };
}

/** Exige sesión en Server Actions / Route Handlers (lanza error en lugar de redirigir). */
export async function assertUser(roles: Array<"ADMIN" | "EDITOR"> = ["ADMIN", "EDITOR"]): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");
  if (!roles.includes(session.user.role)) throw new Error("Permisos insuficientes");
  return { id: session.user.id, email: session.user.email ?? "", name: session.user.name ?? "", role: session.user.role };
}
