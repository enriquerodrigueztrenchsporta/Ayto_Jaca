import { LegalPage, legalMetadata } from "@/components/public/LegalPage";

export const metadata = legalMetadata("cookies");

export default function Page() {
  return <LegalPage pageKey="cookies" />;
}
