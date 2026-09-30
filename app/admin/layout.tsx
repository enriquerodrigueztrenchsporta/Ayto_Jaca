import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Panel de administración", template: "%s · Panel · Ayuntamiento de Jaca" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-stone-100">{children}</div>;
}
