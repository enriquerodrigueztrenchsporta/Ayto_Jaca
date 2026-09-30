import { PostgresSearchProvider } from "./postgres-provider";
import type { SearchProvider } from "./types";

let provider: SearchProvider | null = null;

/** Punto único para obtener el motor de búsqueda configurado. */
export function getSearchProvider(): SearchProvider {
  provider ??= new PostgresSearchProvider();
  return provider;
}

export * from "./types";
