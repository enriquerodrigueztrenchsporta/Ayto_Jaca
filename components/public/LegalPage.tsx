import { PageHeader } from "./PageHeader";
import { Prose } from "@/components/ui/Prose";
import { LEGAL } from "@/data/legal";
import { pageMetadata } from "@/lib/seo";

export function legalMetadata(key: string) {
  const l = LEGAL[key];
  return pageMetadata({ title: l.title, description: l.intro, path: `/${key}` });
}

export function LegalPage({ pageKey }: { pageKey: string }) {
  const l = LEGAL[pageKey];
  return (
    <>
      <PageHeader title={l.title} intro={l.intro} crumbs={[{ label: l.title }]} tone="snow" />
      <div className="container-site py-10 md:py-14">
        <Prose markdown={l.body} className="max-w-3xl" />
      </div>
    </>
  );
}
