import type { MetadataRoute } from "next";
import { isDemoMode, siteUrl } from "@/lib/env";

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
