import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isDemoMode } from "@/lib/env";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Acceso al panel" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.id) redirect("/admin");
  return (
    <main id="contenido" className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="w-full max-w-md">
        <p className="text-center text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-muted">Ayuntamiento de</p>
        <p className="text-center font-serif text-4xl font-semibold text-forest-900">Jaca</p>
        <div className="mt-8 rounded-[10px] border border-stone-200 bg-white p-7 md:p-9">
          <h1 className="font-serif text-h2 font-medium">Panel de contenidos</h1>
          <p className="mt-2 text-ink-2">Acceso restringido al personal autorizado.</p>
          <LoginForm />
        </div>
        {isDemoMode() && <p className="mt-6 text-center text-sm text-muted">Propuesta de rediseño — demo no oficial.</p>}
      </div>
    </main>
  );
}
