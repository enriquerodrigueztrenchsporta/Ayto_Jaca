import { CmsPage, cmsPageMetadata } from "@/components/public/CmsPage";

type Props = { params: Promise<{ path: string[] }> };

export async function generateMetadata({ params }: Props) {
  return cmsPageMetadata("turismo", (await params).path);
}

export default async function Page({ params }: Props) {
  return <CmsPage section="turismo" segments={(await params).path} />;
}
