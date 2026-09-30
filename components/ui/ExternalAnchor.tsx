import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";

/** Enlace a sitio externo accesible: icono + aviso para lectores de pantalla. */
export function ExternalAnchor({ href, children, className, icon = true }: { href: string; children: React.ReactNode; className?: string; icon?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-1", className)}>
      {children}
      {icon && <ExternalLink aria-hidden className="size-[0.85em] shrink-0" />}
      <span className="sr-only">(abre sitio externo)</span>
    </a>
  );
}

export function isExternalUrl(href: string) {
  return /^https?:\/\//.test(href);
}

/** Elige enlace externo o interno según la URL. */
export function SmartLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  if (isExternalUrl(href)) return <ExternalAnchor href={href} className={className}>{children}</ExternalAnchor>;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
