import { CmsPage, cmsPageMetadata } from "@/components/public/CmsPage";

type Props = { params: Promise<{ path: string[] }> };

export async function generateMetadata({ params }: Props) {
  return cmsPageMetadata("ciudad", (await params).path);
}

export default async function Page({ params }: Props) {
  return <CmsPage section="ciudad" segments={(await params).path} />;
}
