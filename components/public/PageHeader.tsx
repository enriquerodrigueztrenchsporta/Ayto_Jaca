import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { OroelLine } from "@/components/ui/OroelLine";
import { cn } from "@/lib/cn";

type Props = { title: string; eyebrow?: string; intro?: string; crumbs: Crumb[]; children?: React.ReactNode; tone?: "snow" | "stone" };

/** Cabecera editorial de páginas interiores. */
export function PageHeader({ title, eyebrow, intro, crumbs, children, tone = "stone" }: Props) {
  return (
    <div className={cn("relative overflow-hidden border-b border-stone-200", tone === "stone" ? "bg-stone-100" : "bg-snow")}>
      <div className="container-site pb-10 pt-6 md:pb-14">
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 max-w-3xl">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="font-serif text-h1 font-medium text-forest-900">{title}</h1>
          {intro && <p className="mt-4 text-lg text-ink-2 md:text-xl">{intro}</p>}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
      <OroelLine className="pointer-events-none absolute bottom-0 right-0 h-16 w-[520px] max-w-[70%] text-stone-300" />
    </div>
  );
}
