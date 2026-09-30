import { db } from "@/lib/db";
import { formatDate } from "@/lib/dates";
import { formatBytes } from "@/lib/text";
import { MediaLibraryUpload } from "./MediaLibraryUpload";

export const metadata = { title: "Medios" };

export default async function MediaPage() {
  const media = await db.media.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div className="max-w-6xl">
      <h1 className="font-serif text-h1 font-medium text-forest-900">Medios</h1>
      <p className="mt-2 max-w-2xl text-ink-2">Imágenes y PDF subidos al servidor. Copia la dirección de un PDF para adjuntarlo como documento en cualquier contenido.</p>
      <div className="my-8 rounded-[10px] border border-stone-200 bg-white p-6">
        <MediaLibraryUpload />
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {media.map((m) => (
          <li key={m.id} className="overflow-hidden rounded-[10px] border border-stone-200 bg-white">
            <div className="grid aspect-[4/3] place-items-center bg-stone-100">
              {m.mimeType.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.alt || ""} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <span className="font-semibold text-earth">PDF</span>
              )}
            </div>
            <div className="space-y-1 p-3 text-sm">
              <p className="truncate font-semibold" title={m.filename}>{m.filename}</p>
              <p className="text-muted">
                {formatBytes(m.size) ?? "—"} · {formatDate(m.createdAt, "short")}
                {m.license ? ` · ${m.license}` : ""}
              </p>
              {m.credit && <p className="text-muted">Autoría: {m.credit}</p>}
              <label className="block">
                <span className="sr-only">Dirección del archivo {m.filename}</span>
                <input readOnly value={m.url} className="w-full rounded-[4px] border border-stone-200 bg-stone-100 px-2 py-1 font-mono text-xs" />
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
