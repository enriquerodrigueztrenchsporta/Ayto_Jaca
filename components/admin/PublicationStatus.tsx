import { Archive, CalendarClock, CheckCircle2, PencilLine } from "lucide-react";
import { effectiveStatus, STATUS_LABEL, type Publishable } from "@/lib/content/visibility";
import { cn } from "@/lib/cn";

const STYLE = {
  DRAFT: { cls: "bg-stone-100 text-ink-2", icon: PencilLine },
  SCHEDULED: { cls: "bg-slate-50 text-slate", icon: CalendarClock },
  PUBLISHED: { cls: "bg-ok-50 text-ok", icon: CheckCircle2 },
  ARCHIVED: { cls: "bg-important-50 text-important", icon: Archive },
};

/** Estado efectivo (tiene en cuenta programación y caducidad). */
export function PublicationStatus({ item, className }: { item: Publishable; className?: string }) {
  const s = effectiveStatus(item);
  const { cls, icon: Icon } = STYLE[s];
  const expired = item.status !== "ARCHIVED" && s === "ARCHIVED";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-[4px] px-2 py-0.5 text-sm font-semibold", cls, className)}>
      <Icon aria-hidden className="size-3.5" />
      {expired ? "Caducado" : STATUS_LABEL[s]}
    </span>
  );
}
