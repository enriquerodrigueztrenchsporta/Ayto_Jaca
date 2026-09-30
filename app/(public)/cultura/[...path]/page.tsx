import { CmsPage, cmsPageMetadata } from "@/components/public/CmsPage";

type Props = { params: Promise<{ path: string[] }> };

export async function generateMetadata({ params }: Props) {
  return cmsPageMetadata("cultura", (await params).path);
}

export default async function Page({ params }: Props) {
  return <CmsPage section="cultura" segments={(await params).path} />;
}
