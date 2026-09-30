export type SearchResultType = "procedure" | "news" | "event" | "page" | "grant" | "job" | "document" | "alert" | "session" | "area";

export type SearchResult = {
  type: SearchResultType;
  id: string;
  title: string;
  summary: string;
  url: string;
  date?: string | null;
  external?: boolean;
  score: number;
};

export type SearchResponse = {
  query: string;
  terms: string[];
  total: number;
  groups: { type: SearchResultType; label: string; results: SearchResult[] }[];
};

/**
 * Contrato del motor de búsqueda. El MVP usa PostgreSQL (`PostgresSearchProvider`);
 * puede sustituirse por Meilisearch, Typesense, Algolia o búsqueda semántica
 * implementando esta misma interfaz.
 */
export interface SearchProvider {
  search(query: string, opts?: { types?: SearchResultType[]; limitPerType?: number }): Promise<SearchResponse>;
}

export const TYPE_LABEL: Record<SearchResultType, string> = {
  procedure: "Trámites",
  area: "Áreas y servicios",
  alert: "Avisos",
  news: "Noticias",
  event: "Agenda",
  grant: "Subvenciones y ayudas",
  job: "Empleo público",
  session: "Plenos",
  page: "Información",
  document: "Documentos",
};

export const TYPE_ORDER: SearchResultType[] = ["procedure", "area", "alert", "grant", "job", "event", "news", "session", "page", "document"];
