import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../app/config/routePaths.js";

export function AdminNotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[1024px] items-center justify-center px-4 py-10 sm:px-6 lg:min-h-dvh lg:px-8">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-7 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-upc-red">
          <SearchX aria-hidden="true" className="h-6 w-6" />
        </div>

        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-zinc-900">
          Página no encontrada
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          La dirección administrativa solicitada no existe.
        </p>

        <Link
          to={ROUTES.summary}
          className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-upc-red px-5 text-sm font-semibold text-white outline-none transition-colors hover:bg-upc-red-dark focus-visible:ring-4 focus-visible:ring-upc-red/20"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Volver al resumen
        </Link>
      </section>
    </div>
  );
}
