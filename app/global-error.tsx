"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#faf8f4", color: "#1c211e", padding: "3rem 1.25rem" }}>
        <main style={{ maxWidth: 640, margin: "0 auto" }}>
          <h1>Ayuntamiento de Jaca</h1>
          <p>La web no está disponible en este momento. Inténtelo de nuevo en unos minutos.</p>
          <p>
            Para trámites urgentes utilice la <a href="https://jaca.sedipualba.es/">Sede Electrónica</a> o llame al 974 355 758.
          </p>
          <button onClick={reset} style={{ minHeight: 48, padding: "0 20px", background: "#1f4d3a", color: "#faf8f4", border: 0, borderRadius: 4, fontWeight: 600 }}>
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
