import { LegalPage, legalMetadata } from "@/components/public/LegalPage";

export const metadata = legalMetadata("aviso-legal");

export default function Page() {
  return <LegalPage pageKey="aviso-legal" />;
}
