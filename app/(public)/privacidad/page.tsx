import { LegalPage, legalMetadata } from "@/components/public/LegalPage";

export const metadata = legalMetadata("privacidad");

export default function Page() {
  return <LegalPage pageKey="privacidad" />;
}
