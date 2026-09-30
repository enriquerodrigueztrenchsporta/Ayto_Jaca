import Link from "next/link";
import { PageHeader } from "@/components/public/PageHeader";
import { NAV, FOOTER_LINKS } from "@/lib/site";
import { db } from "@/lib/db";
import { publishedWhere } from "@/lib/content/visibility";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Mapa web", description: "Índice de todas las secciones de la web del Ayuntamiento de Jaca.", path: "/mapa-web" });

export default async function SitemapPage() {
  const [pages, procedures] = await Promise.all([
    db.page.findMany({ where: publishedWhere(), orderBy: [{ section: "asc" }, { sortOrder: "asc" }], select: { path: true, title: true, section: true } }),
    db.procedure.findMany({ where: publishedWhere(), orderBy: { title: "asc" }, select: { slug: true, title: true } }),
  ]);
  return (
    <>
      <PageHeader title="Mapa web" crumbs={[{ label: "Mapa web" }]} tone="snow" />
      <div className="container-site grid gap-10 py-10 md:grid-cols-2 md:py-14 lg:grid-cols-3">
        {NAV.map((s) => (
          <section key={s.label} aria-label={s.label}>
            <h2 className="font-serif text-h3 font-medium"><Link href={s.href} className="hover:underline">{s.label}</Link></h2>
            <ul className="mt-3 space-y-1.5">
              {s.links.filter((l) => !l.external).map((l) => (
                <li key={l.href}><Link href={l.href} className="link">{l.label}</Link></li>
              ))}
              {pages.filter((p) => s.href === `/${p.section}`).map((p) => (
                <li key={p.path}><Link href={`/${p.path}`} className="link">{p.title}</Link></li>
              ))}
            </ul>
          </section>
        ))}
        <section aria-label="Todos los trámites" className="md:col-span-2">
          <h2 className="font-serif text-h3 font-medium">Todos los trámites</h2>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {procedures.map((p) => (
              <li key={p.slug}><Link href={`/tramites/${p.slug}`} className="link">{p.title}</Link></li>
            ))}
          </ul>
        </section>
        <section aria-label="Información legal">
          <h2 className="font-serif text-h3 font-medium">Información legal y ayuda</h2>
          <ul className="mt-3 space-y-1.5">
            {FOOTER_LINKS.filter((l) => !l.external).map((l) => (
              <li key={l.href}><Link href={l.href} className="link">{l.label}</Link></li>
            ))}
            <li><Link href="/documentos" className="link">Impresos y documentos</Link></li>
            <li><Link href="/buscar" className="link">Buscador</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
