import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "light" | "danger";
const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] px-5 py-2.5 text-base font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";
const variants: Record<Variant, string> = {
  primary: "bg-forest-700 text-snow hover:bg-forest-600",
  secondary: "border-[1.5px] border-forest-700 text-forest-700 hover:bg-forest-50",
  ghost: "text-forest-700 underline underline-offset-4 hover:bg-forest-50",
  light: "bg-snow text-forest-900 hover:bg-stone-100",
  danger: "bg-urgent text-white hover:bg-[#8a1d15]",
};

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

type LinkProps = { href: string; variant?: Variant; className?: string; children: React.ReactNode; external?: boolean };

export function ButtonLink({ href, variant = "primary", className, children, external }: LinkProps) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  if (isExternal) {
    return (
      <a href={href} className={buttonClass(variant, className)} target="_blank" rel="noopener noreferrer">
        {children}
        <ExternalLink aria-hidden className="size-4 shrink-0" />
        <span className="sr-only">(abre sitio externo)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}

export function Button({ variant = "primary", className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}
