import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";

/** Mensaje de resultado anunciado a lectores de pantalla. */
export function StatusMessage({ message, tone }: { message?: string | null; tone: "ok" | "error" }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} aria-live="polite" className="min-h-0">
      {message && (
        <p className={cn("flex items-start gap-2 rounded-[6px] px-4 py-3 font-semibold", tone === "ok" ? "bg-ok-50 text-ok" : "bg-urgent-50 text-urgent")}>
          {tone === "ok" ? <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0" /> : <AlertTriangle aria-hidden className="mt-0.5 size-5 shrink-0" />}
          {message}
        </p>
      )}
    </div>
  );
}
