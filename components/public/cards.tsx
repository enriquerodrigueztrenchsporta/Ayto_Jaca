import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarClock, Clock, FileSpreadsheet, FileText, Globe, Link2, Mail, MapPin, Monitor, Phone, Users, Video } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { dateBlock, formatDate } from "@/lib/dates";
import { formatBytes } from "@/lib/text";
import { RECURRENCE_LABEL, DOCUMENT_KIND_LABEL, GRANT_STATUS_LABEL, GRANT_STATUS_TONE, JOB_STATUS_LABEL, JOB_STATUS_TONE, SESSION_TYPE_LABEL } from "@/lib/labels";
import type { DocumentKind, GrantStatus, JobStatus, SessionType } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/cn";

const card =
  "group relative flex h-full flex-col rounded-[10px] border border-stone-200 bg-white transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-forest-700 motion-reduce:hover:translate-y-0";

function DemoTag({ isDemo }: { isDemo?: boolean }) {
  return isDemo ? <Badge tone="demo">Demo</Badge> : null;
}

// ─── Noticia ────────────────────────────────────────────────
export type NewsCardData = {
  slug: string;
  title: string;
  excerpt: string;
  date: Date;
  category?: { name: string } | null;
  image?: { url: string; alt: string; width?: number | null; height?: number | null } | null;
  imageAlt?: string | null;
  isDemo?: boolean;
};

export function NewsCard({ item, variant = "default", headingLevel = "h3" }: { item: NewsCardData; variant?: "default" | "feature" | "compact"; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  if (variant === "compact") {
    return (
      <article className="relative border-t border-stone-200 py-5">
        <p className="mb-1 text-[0.9375rem] text-muted">
          <time dateTime={item.date.toISOString()}>{formatDate(item.date, "medium")}</time>
          {item.category && <> · {item.category.name}</>}
        </p>
        <H className="font-serif text-xl font-medium leading-snug text-ink">
          <Link href={`/actualidad/noticias/${item.slug}`} className="card-link hover:text-forest-700 hover:underline">
            {item.title}
          </Link>
        </H>
        <DemoTag isDemo={item.isDemo} />
      </article>
    );
  }
  return (
    <article className={cn(card, "overflow-hidden")}>
      {item.image ? (
        <div className={cn("relative overflow-hidden bg-stone-100", variant === "feature" ? "aspect-[16/10]" : "aspect-[3/2]")}>
          <Image
            src={item.image.url}
            alt={item.imageAlt ?? item.image.alt ?? ""}
            fill
            sizes={variant === "feature" ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[0.9375rem] text-muted">
          {item.category && <Badge tone="earth">{item.category.name}</Badge>}
          <time dateTime={item.date.toISOString()}>{formatDate(item.date, "medium")}</time>
          <DemoTag isDemo={item.isDemo} />
        </div>
        <H className={cn("font-serif font-medium leading-snug text-ink", variant === "feature" ? "text-h2" : "text-h3")}>
          <Link href={`/actualidad/noticias/${item.slug}`} className="card-link group-hover:text-forest-700">
            {item.title}
          </Link>
        </H>
        <p className="mt-3 line-clamp-3 text-ink-2">{item.excerpt}</p>
      </div>
    </article>
  );
}

// ─── Evento ─────────────────────────────────────────────────
export type EventCardData = {
  slug: string;
  title: string;
  startDate: Date;
  endDate?: Date | null;
  timeText?: string | null;
  location?: string | null;
  price?: string | null;
  category?: { name: string; slug: string } | null;
  isDemo?: boolean;
};

export function EventCard({ item, headingLevel = "h3" }: { item: EventCardData & { nextDate?: Date; recurrence?: string }; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const shown = item.nextDate ?? item.startDate;
  const d = dateBlock(shown);
  const multiDay = item.endDate && formatDate(item.endDate, "short") !== formatDate(item.startDate, "short");
  const recurring = item.recurrence && item.recurrence !== "NONE";
  return (
    <article className={cn(card, "flex-row gap-5 p-5")}>
      <div className="flex w-18 shrink-0 flex-col items-center justify-center rounded-[8px] bg-forest-900 py-3 text-center text-snow" aria-hidden>
        <span className="text-[0.8125rem] font-semibold uppercase tracking-wide text-mist">{d.weekday}</span>
        <span className="font-serif text-4xl leading-none">{d.day}</span>
        <span className="text-[0.8125rem] font-semibold uppercase tracking-wide text-sand">{d.month}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap gap-2">
          {item.category && <Badge tone="forest">{item.category.name}</Badge>}
          <DemoTag isDemo={item.isDemo} />
        </div>
        <H className="text-lg font-semibold leading-snug text-ink">
          <Link href={`/agenda/${item.slug}`} className="card-link group-hover:text-forest-700 group-hover:underline">
            {item.title}
          </Link>
        </H>
        <p className="mt-2 flex items-start gap-1.5 text-[0.9375rem] text-ink-2">
          <CalendarClock aria-hidden className="mt-0.5 size-4 shrink-0 text-muted" />
          <span>
            {multiDay && item.endDate ? (
              <>
                Del <time dateTime={item.startDate.toISOString()}>{formatDate(item.startDate, "day-month")}</time> al{" "}
                <time dateTime={item.endDate.toISOString()}>{formatDate(item.endDate, "medium")}</time>
              </>
            ) : (
              <>
                {recurring && <>{RECURRENCE_LABEL[item.recurrence as keyof typeof RECURRENCE_LABEL]} · próxima: </>}
                <time dateTime={shown.toISOString()}>{formatDate(shown, "long")}</time>
              </>
            )}
            {item.timeText && <> · {item.timeText}</>}
          </span>
        </p>
        {item.location && (
          <p className="mt-1 flex items-start gap-1.5 text-[0.9375rem] text-ink-2">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-muted" />
            {item.location}
          </p>
        )}
      </div>
    </article>
  );
}

// ─── Trámite ────────────────────────────────────────────────
export type ProcedureCardData = { slug: string; title: string; summary: string; online: boolean; category?: { name: string } | null };

export function ProcedureCard({ item, headingLevel = "h3" }: { item: ProcedureCardData; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className={cn(card, "p-6")}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {item.online ? (
          <Badge tone="ok">
            <Monitor aria-hidden className="size-3.5" /> Online
          </Badge>
        ) : (
          <Badge tone="slate">Presencial</Badge>
        )}
        {item.category && <span className="text-[0.9375rem] text-muted">{item.category.name}</span>}
      </div>
      <H className="text-lg font-semibold leading-snug text-ink">
        <Link href={`/tramites/${item.slug}`} className="card-link group-hover:text-forest-700 group-hover:underline">
          {item.title}
        </Link>
      </H>
      <p className="mt-2 line-clamp-3 text-[0.9375rem] text-ink-2">{item.summary}</p>
      <ArrowUpRight aria-hidden className="absolute right-5 top-5 size-5 text-stone-300 transition-colors group-hover:text-forest-700" />
    </article>
  );
}

// ─── Documento ──────────────────────────────────────────────
export type DocumentCardData = {
  id?: string;
  title: string;
  kind: DocumentKind;
  url: string;
  isExternal?: boolean;
  fileSize?: number | null;
  documentDate?: Date | null;
  description?: string | null;
  sourceName?: string | null;
};

const DOC_ICON: Record<DocumentKind, typeof FileText> = { PDF: FileText, DOC: FileText, SPREADSHEET: FileSpreadsheet, IMAGE: FileText, LINK: Link2, OTHER: FileText };

/** Tarjeta coherente para cualquier PDF, impreso o enlace documental. */
export function DocumentCard({ doc, context }: { doc: DocumentCardData; context?: string }) {
  const Icon = DOC_ICON[doc.kind];
  const size = formatBytes(doc.fileSize);
  const hostedOfficial = doc.isExternal && /jaca\.es|sedipualba|sedelectronica/.test(doc.url);
  return (
    <article className="relative flex items-start gap-4 rounded-[10px] border border-stone-200 bg-white p-4 transition-colors hover:border-forest-700">
      <div className="grid size-12 shrink-0 place-items-center rounded-[6px] bg-earth-50 text-earth" aria-hidden>
        <Icon className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold leading-snug text-ink">
          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="card-link hover:text-forest-700 hover:underline">
            {doc.title}
            <span className="sr-only">
              {" "}({DOCUMENT_KIND_LABEL[doc.kind]}{size ? `, ${size}` : ""}, abre en una pestaña nueva)
            </span>
          </a>
        </h3>
        <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[0.875rem] text-muted">
          <span className="font-semibold uppercase tracking-wide text-earth">{doc.kind === "LINK" ? "Enlace" : doc.kind}</span>
          {size && <span>{size}</span>}
          {doc.documentDate && <time dateTime={doc.documentDate.toISOString()}>{formatDate(doc.documentDate, "short")}</time>}
          {(context || doc.description) && <span>{context ?? doc.description}</span>}
          {hostedOfficial && (
            <span className="inline-flex items-center gap-1">
              <Globe aria-hidden className="size-3.5" /> Alojado en web oficial
            </span>
          )}
        </p>
      </div>
      <span aria-hidden className="hidden shrink-0 self-center rounded-[4px] border border-stone-300 px-3 py-1.5 text-[0.875rem] font-semibold text-forest-700 sm:inline">
        {doc.kind === "LINK" ? "Abrir" : "Descargar"}
      </span>
    </article>
  );
}

export function DocumentList({ docs, title = "Documentos", context }: { docs: DocumentCardData[]; title?: string; context?: string }) {
  if (!docs.length) return null;
  return (
    <section aria-labelledby="docs-title" className="mt-10">
      <h2 id="docs-title" className="mb-4 font-serif text-h3 font-medium">
        {title}
      </h2>
      <ul className="grid gap-3">
        {docs.map((d, i) => (
          <li key={d.id ?? i}>
            <DocumentCard doc={d} context={context} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Subvención ─────────────────────────────────────────────
export type GrantCardData = { slug: string; title: string; summary: string; grantStatus: GrantStatus; deadline?: Date | null; deadlineText?: string | null; beneficiaries?: string | null; isDemo?: boolean };

export function GrantCard({ item, headingLevel = "h3" }: { item: GrantCardData; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className={cn(card, "p-6")}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone={GRANT_STATUS_TONE[item.grantStatus]}>{GRANT_STATUS_LABEL[item.grantStatus]}</Badge>
        <DemoTag isDemo={item.isDemo} />
      </div>
      <H className="text-lg font-semibold leading-snug text-ink">
        <Link href={`/convocatorias/${item.slug}`} className="card-link group-hover:text-forest-700 group-hover:underline">
          {item.title}
        </Link>
      </H>
      {item.beneficiaries && (
        <p className="mt-2 flex items-start gap-1.5 text-[0.9375rem] text-ink-2">
          <Users aria-hidden className="mt-0.5 size-4 shrink-0 text-muted" /> {item.beneficiaries}
        </p>
      )}
      <p className="mt-auto flex items-start gap-1.5 pt-4 text-[0.9375rem] font-semibold text-ink">
        <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-earth" />
        {item.deadline ? <>Plazo hasta el {formatDate(item.deadline, "medium")}</> : (item.deadlineText ?? "Consultar plazo en la convocatoria")}
      </p>
    </article>
  );
}

// ─── Empleo público ─────────────────────────────────────────
export type JobCardData = { slug: string; title: string; summary: string; jobStatus: JobStatus; staffType?: string | null; openingDate?: Date | null; deadline?: Date | null; isDemo?: boolean };

export function JobCard({ item, headingLevel = "h3" }: { item: JobCardData; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className={cn(card, "p-6")}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone={JOB_STATUS_TONE[item.jobStatus]}>{JOB_STATUS_LABEL[item.jobStatus]}</Badge>
        {item.staffType && <span className="text-[0.9375rem] text-muted">{item.staffType}</span>}
        <DemoTag isDemo={item.isDemo} />
      </div>
      <H className="text-lg font-semibold leading-snug text-ink">
        <Link href={`/empleo-publico/${item.slug}`} className="card-link group-hover:text-forest-700 group-hover:underline">
          {item.title}
        </Link>
      </H>
      <p className="mt-2 line-clamp-2 text-[0.9375rem] text-ink-2">{item.summary}</p>
      {item.deadline && (
        <p className="mt-auto flex items-start gap-1.5 pt-4 text-[0.9375rem] font-semibold text-ink">
          <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-earth" />
          {item.openingDate ? <>Del {formatDate(item.openingDate, "day-month")} al {formatDate(item.deadline, "medium")}</> : <>Hasta el {formatDate(item.deadline, "medium")}</>}
        </p>
      )}
    </article>
  );
}

// ─── Pleno / sesión ─────────────────────────────────────────
export type SessionCardData = { slug: string; title: string; sessionType: SessionType; date: Date; timeText?: string | null; streamingUrl?: string | null; isDemo?: boolean };

export function SessionCard({ item, highlight = false, headingLevel = "h3" }: { item: SessionCardData; highlight?: boolean; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className={cn(card, "p-6", highlight && "border-forest-700 bg-forest-50")}>
      <p className="eyebrow mb-2">{SESSION_TYPE_LABEL[item.sessionType]}</p>
      <H className="font-serif text-h3 font-medium text-ink">
        <Link href={`/plenos/${item.slug}`} className="card-link group-hover:text-forest-700 group-hover:underline">
          {item.title}
        </Link>
      </H>
      <p className="mt-2 text-ink-2">
        <time dateTime={item.date.toISOString()}>{formatDate(item.date, "long")}</time>
        {item.timeText && <> · {item.timeText}</>}
      </p>
      {item.streamingUrl && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-forest-700">
          <Video aria-hidden className="size-4" /> Retransmisión en directo
        </p>
      )}
      <DemoTag isDemo={item.isDemo} />
    </article>
  );
}

// ─── Contacto ───────────────────────────────────────────────
export type ContactCardData = {
  name: string;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  schedule?: string | null;
  href?: string;
  pending?: string[];
};

export function ContactCard({ item, headingLevel = "h3" }: { item: ContactCardData; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className="flex h-full flex-col rounded-[10px] border border-stone-200 bg-white p-6">
      <H className="font-serif text-h3 font-medium text-ink">
        {item.href ? (
          <Link href={item.href} className="hover:text-forest-700 hover:underline">
            {item.name}
          </Link>
        ) : (
          item.name
        )}
      </H>
      {item.description && <p className="mt-2 text-[0.9375rem] text-ink-2">{item.description}</p>}
      <dl className="mt-4 space-y-2 text-[0.9375rem]">
        {item.phone && (
          <div className="flex items-start gap-2">
            <dt><Phone aria-hidden className="mt-0.5 size-4 text-earth" /><span className="sr-only">Teléfono</span></dt>
            <dd><a href={`tel:+34${item.phone.replace(/\D/g, "").slice(0, 9)}`} className="font-semibold text-forest-700 hover:underline">{item.phone}</a></dd>
          </div>
        )}
        {item.email && (
          <div className="flex items-start gap-2">
            <dt><Mail aria-hidden className="mt-0.5 size-4 text-earth" /><span className="sr-only">Correo electrónico</span></dt>
            <dd><a href={`mailto:${item.email}`} className="break-all text-forest-700 hover:underline">{item.email}</a></dd>
          </div>
        )}
        {item.address && (
          <div className="flex items-start gap-2">
            <dt><MapPin aria-hidden className="mt-0.5 size-4 text-earth" /><span className="sr-only">Dirección</span></dt>
            <dd className="text-ink-2">{item.address}</dd>
          </div>
        )}
        {item.schedule && (
          <div className="flex items-start gap-2">
            <dt><Clock aria-hidden className="mt-0.5 size-4 text-earth" /><span className="sr-only">Horario</span></dt>
            <dd className="text-ink-2">{item.schedule}</dd>
          </div>
        )}
      </dl>
      {item.pending && item.pending.length > 0 && (
        <p className="mt-4 text-[0.875rem] text-muted">Pendiente de validación por el Ayuntamiento: {item.pending.join(", ")}.</p>
      )}
    </article>
  );
}
