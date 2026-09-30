import pg from "pg";
import { toDateTimeInput } from "@/lib/dates";
import { emptyValues, type FormValues } from "@/lib/admin/schema";
import { RESOURCES, type ResourceKey } from "@/lib/admin/resources";

/** ¿Hay PostgreSQL de tests disponible? Si no, los tests de integración se omiten con aviso. */
export async function dbAvailable(): Promise<boolean> {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.query("SELECT 1 FROM \"User\" LIMIT 1");
    return true;
  } catch {
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}

export function values(resource: ResourceKey, overrides: Record<string, unknown>): FormValues {
  return { ...emptyValues(RESOURCES[resource]), ...overrides } as FormValues;
}

export const inDays = (d: number) => toDateTimeInput(new Date(Date.now() + d * 86400000));
