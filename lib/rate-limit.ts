/**
 * Limitador de peticiones en memoria (ventana deslizante simple).
 * Suficiente para una única instancia; para varias instancias sustituir por Redis.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfterMs: windowMs - (now - hits[0]) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
  }
  return { ok: true, retryAfterMs: 0 };
}

export function resetRateLimit(key?: string) {
  if (key) buckets.delete(key);
  else buckets.clear();
}
