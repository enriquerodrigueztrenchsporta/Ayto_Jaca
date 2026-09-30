import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = { eyebrow?: string; title: string; description?: string; href?: string; linkLabel?: string; id?: string; className?: string; as?: "h1" | "h2" };

export function SectionHeader({ eyebrow, title, description, href, linkLabel = "Ver todo", id, className, as: H = "h2" }: Props) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <H id={id} className="font-serif text-h2 font-medium text-ink">
          {title}
        </H>
        {description && <p className="mt-3 text-lg text-ink-2">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="group inline-flex min-h-11 items-center gap-2 font-semibold text-forest-700 underline-offset-4 hover:underline">
          {linkLabel}
          <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
