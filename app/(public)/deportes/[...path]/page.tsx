import { CmsPage, cmsPageMetadata } from "@/components/public/CmsPage";

type Props = { params: Promise<{ path: string[] }> };

export async function generateMetadata({ params }: Props) {
  return cmsPageMetadata("deportes", (await params).path);
}

export default async function Page({ params }: Props) {
  return <CmsPage section="deportes" segments={(await params).path} />;
}
