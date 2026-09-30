import path from "node:path";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Política de seguridad de contenidos. La web no carga scripts, fuentes ni analítica de terceros:
 * las fuentes se autoalojan con next/font y las imágenes son locales.
 * 'unsafe-inline' en scripts es necesario para los scripts de hidratación de Next.js sin nonce.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "media-src 'self'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  turbopack: { root: path.resolve(__dirname) },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    localPatterns: [{ pathname: "/images/**" }, { pathname: "/uploads/**" }],
  },
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/preview/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }] },
    ];
  },
  async redirects() {
    // Equivalencias de URLs antiguas de jaca.es más consultadas (útil si se despliega en el dominio oficial).
    return [
      { source: "/ayuntamiento/noticias.html", destination: "/actualidad/noticias", permanent: true },
      { source: "/ayuntamiento/subvenciones.html", destination: "/convocatorias", permanent: true },
      { source: "/ayuntamiento/recursos-humanos.html", destination: "/empleo-publico", permanent: true },
      { source: "/ayuntamiento/impresos-y-solicitudes.html", destination: "/documentos?categoria=impresos", permanent: true },
      { source: "/ayuntamiento/normativa-municipal.html", destination: "/transparencia/normativa", permanent: true },
      { source: "/ayuntamiento/gobierno.html", destination: "/ayuntamiento/corporacion", permanent: true },
      { source: "/perfil-de-contratante.html-0", destination: "/transparencia/contratacion", permanent: true },
      { source: "/oficina.html", destination: "/turismo/oficina-de-turismo", permanent: true },
      { source: "/turismo.html", destination: "/turismo", permanent: true },
      { source: "/cultura.html", destination: "/cultura", permanent: true },
      { source: "/deporte.html", destination: "/deportes", permanent: true },
    ];
  },
};

export default nextConfig;
