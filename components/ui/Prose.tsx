import { renderMarkdown } from "@/lib/markdown";
import { cn } from "@/lib/cn";

/** Renderiza markdown saneado (ver lib/markdown.ts). */
export function Prose({ markdown, className }: { markdown?: string | null; className?: string }) {
  if (!markdown) return null;
  return <div className={cn("prose-jaca", className)} dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />;
}
