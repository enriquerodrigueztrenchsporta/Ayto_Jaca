import { LegalPage, legalMetadata } from "@/components/public/LegalPage";

export const metadata = legalMetadata("accesibilidad");

export default function Page() {
  return <LegalPage pageKey="accesibilidad" />;
}
