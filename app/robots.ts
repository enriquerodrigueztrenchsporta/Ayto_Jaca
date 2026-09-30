import type { MetadataRoute } from "next";
import { isDemoMode, siteUrl } from "@/lib/env";

// Se genera en cada petición: depende de la BD y de NEXT_PUBLIC_DEMO_MODE en tiempo de ejecución.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  // Durante la fase de propuesta (demo) no se indexa para no competir con la web oficial.
  if (isDemoMode()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/preview", "/api/"] }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
