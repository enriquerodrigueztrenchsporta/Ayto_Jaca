import { cn } from "@/lib/cn";

type Tone = "neutral" | "forest" | "earth" | "slate" | "urgent" | "important" | "ok" | "demo";
const tones: Record<Tone, string> = {
  neutral: "bg-stone-100 text-ink-2",
  forest: "bg-forest-50 text-forest-700",
  earth: "bg-earth-50 text-earth",
  slate: "bg-slate-50 text-slate",
  urgent: "bg-urgent-50 text-urgent",
  important: "bg-important-50 text-important",
  ok: "bg-ok-50 text-ok",
  demo: "bg-ink text-sand",
};

export function Badge({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-[4px] px-2 py-0.5 text-[0.8125rem] font-semibold uppercase tracking-[0.06em]", tones[tone], className)}>
      {children}
    </span>
  );
}
