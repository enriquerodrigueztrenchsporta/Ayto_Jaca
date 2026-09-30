import Link from "next/link";
import { CalendarCheck2, Phone, ShieldAlert, Siren } from "lucide-react";
import { formatDate } from "@/lib/dates";

type Props = { todayEvents: Array<{ slug: string; title: string; timeText: string | null }>; openGrants: number; openAlerts: number };

/** "Jaca hoy": datos útiles del día. No muestra estados en tiempo real que no puedan verificarse. */
export function JacaHoy({ todayEvents, openGrants, openAlerts }: Props) {
  return (
    <aside aria-labelledby="hoy-title" className="rounded-[10px] border border-stone-200 bg-white p-6 md:p-8">
      <p className="eyebrow mb-1">Jaca hoy</p>
      <h2 id="hoy-title" className="font-serif text-h3 font-medium first-letter:uppercase">
        {formatDate(new Date(), "long")}
      </h2>
      <div className="mt-6 space-y-6">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-ink">
            <CalendarCheck2 aria-hidden className="size-5 text-earth" /> Hoy en la agenda
          </h3>
          {todayEvents.length ? (
            <ul className="mt-2 space-y-1.5">
              {todayEvents.slice(0, 4).map((e) => (
                <li key={e.slug}>
                  <Link href={`/agenda/${e.slug}`} className="text-forest-700 underline decoration-forest-700/30 underline-offset-4 hover:decoration-forest-700">
                    {e.title}
                  </Link>
                  {e.timeText && <span className="text-[0.9375rem] text-muted"> · {e.timeText}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-ink-2">
              No hay actividades publicadas para hoy. <Link href="/agenda?cuando=fin-de-semana" className="link">Ver el fin de semana</Link>
            </p>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-4 border-y border-stone-200 py-5">
          <div>
            <dt className="text-[0.9375rem] text-muted">Avisos vigentes</dt>
            <dd className="font-serif text-4xl text-forest-900">
              <Link href="/avisos" className="hover:underline">{openAlerts}</Link>
            </dd>
          </div>
          <div>
            <dt className="text-[0.9375rem] text-muted">Convocatorias abiertas</dt>
            <dd className="font-serif text-4xl text-forest-900">
              <Link href="/convocatorias?estado=abierta" className="hover:underline">{openGrants}</Link>
            </dd>
          </div>
        </dl>
        <div>
          <h3 className="font-semibold text-ink">Teléfonos esenciales</h3>
          <ul className="mt-3 space-y-2 text-[0.9375rem]">
            <li className="flex items-center gap-2">
              <Phone aria-hidden className="size-4 text-earth" /> Ayuntamiento <a href="tel:+34974355758" className="ml-auto font-semibold text-forest-700">974 355 758</a>
            </li>
            <li className="flex items-center gap-2">
              <ShieldAlert aria-hidden className="size-4 text-earth" /> Policía Local <a href="tel:092" className="ml-auto font-semibold text-forest-700">092</a>
            </li>
            <li className="flex items-center gap-2">
              <Siren aria-hidden className="size-4 text-urgent" /> Emergencias <a href="tel:112" className="ml-auto font-semibold text-urgent">112</a>
            </li>
          </ul>
          <Link href="/contacto" className="mt-4 inline-block font-semibold text-forest-700 underline underline-offset-4">
            Todos los teléfonos y áreas
          </Link>
        </div>
      </div>
    </aside>
  );
}
