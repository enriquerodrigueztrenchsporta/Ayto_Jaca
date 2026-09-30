import { db } from "@/lib/db";
import type { AuditAction } from "@/lib/generated/prisma/enums";
import type { Prisma } from "@/lib/generated/prisma/client";

type AuditInput = {
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  entityTitle?: string | null;
  user?: { id?: string | null; email?: string | null } | null;
  details?: Prisma.InputJsonValue;
};

/** Registra un cambio en el historial. Nunca guarda contraseñas ni datos personales de ciudadanos. */
export async function audit(input: AuditInput) {
  try {
    await db.auditLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        entityTitle: input.entityTitle?.slice(0, 240) ?? null,
        userId: input.user?.id ?? null,
        userEmail: input.user?.email ?? null,
        details: input.details,
      },
    });
  } catch (err) {
    console.error("[audit] no se pudo registrar el cambio", (err as Error).message);
  }
}
