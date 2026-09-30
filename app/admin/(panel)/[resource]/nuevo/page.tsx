import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getResource } from "@/lib/admin/resources";
import { emptyValues } from "@/lib/admin/schema";
import { loadLookups } from "@/lib/admin/lookups";
import { EditorForm } from "@/components/admin/EditorForm";
import { toDateTimeInput } from "@/lib/dates";

type Props = { params: Promise<{ resource: string }> };

export async function generateMetadata({ params }: Props) {
  const r = getResource((await params).resource);
  return { title: r ? `Nuevo: ${r.singular}` : "Nuevo" };
}

export default async function NewResourcePage({ params }: Props) {
  const resource = getResource((await params).resource);
  if (!resource) notFound();
  const values = emptyValues(resource);
  const now = toDateTimeInput(new Date());
  for (const k of ["date", "startsAt"]) if (k in values) values[k] = now;
  if ("grantStatus" in values) values.grantStatus = "OPEN";
  if ("jobStatus" in values) values.jobStatus = "OPEN";
  return (
    <div className="max-w-6xl">
      <Link href={`/admin/${resource.key}`} className="mb-4 inline-flex items-center gap-1.5 font-semibold text-forest-700 hover:underline">
        <ArrowLeft aria-hidden className="size-4" /> {resource.label}
      </Link>
      <h1 className="mb-6 font-serif text-h1 font-medium text-forest-900">
        Nuevo: {resource.singular}
      </h1>
      <EditorForm resourceKey={resource.key} id={null} initialValues={values} lookups={await loadLookups()} />
    </div>
  );
}
