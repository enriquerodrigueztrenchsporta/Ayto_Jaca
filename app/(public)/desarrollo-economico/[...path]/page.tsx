import { CmsPage, cmsPageMetadata } from "@/components/public/CmsPage";

type Props = { params: Promise<{ path: string[] }> };

export async function generateMetadata({ params }: Props) {
  return cmsPageMetadata("desarrollo-economico", (await params).path);
}

export default async function Page({ params }: Props) {
  return <CmsPage section="desarrollo-economico" segments={(await params).path} />;
}
