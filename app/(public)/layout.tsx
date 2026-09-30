import { DemoBanner } from "@/components/public/DemoBanner";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { AlertStrip } from "@/components/public/AlertBanner";
import { JsonLd } from "@/components/ui/JsonLd";
import { listActiveAlerts } from "@/lib/queries/public";
import { siteUrl } from "@/lib/env";
import { SITE, EXTERNAL } from "@/lib/site";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const urgent = (await listActiveAlerts({ homeOnly: true }).catch(() => [])).filter((a) => a.priority === "URGENT");
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#contenido" className="sr-only z-[60] rounded-[4px] bg-forest-900 px-4 py-3 font-semibold text-snow focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Saltar al contenido principal
      </a>
      <DemoBanner />
      <Header />
      <AlertStrip alerts={urgent} />
      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "GovernmentOrganization",
          name: SITE.name,
          url: siteUrl(),
          telephone: "+34 974 355 758",
          address: {
            "@type": "PostalAddress",
            streetAddress: SITE.address.street,
            postalCode: SITE.address.postalCode,
            addressLocality: SITE.address.city,
            addressRegion: SITE.address.province,
            addressCountry: "ES",
          },
          sameAs: [EXTERNAL.x, EXTERNAL.youtube, EXTERNAL.visitJaca],
        }}
      />
    </div>
  );
}
