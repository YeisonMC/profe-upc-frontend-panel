import { Construction } from "lucide-react";

export function TemporaryPage({
  title,
  description = "Este módulo será desarrollado en una próxima etapa.",
}) {
  return (
    <div className="mx-auto w-full max-w-[1024px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-upc-red">
          Panel de administración
        </p>

        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.045em] text-zinc-950">
          Página {title}
        </h1>

        <p className="mt-2 text-sm text-zinc-500">{description}</p>
      </header>

      <section className="mt-8 flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-upc-red">
          <Construction
            aria-hidden="true"
            className="h-6 w-6"
            strokeWidth={1.8}
          />
        </div>

        <h2 className="mt-4 font-display text-lg font-bold text-zinc-900">
          Módulo en preparación
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
          La navegación funciona correctamente. El contenido y la integración
          con el backend se implementarán posteriormente.
        </p>
      </section>
    </div>
  );
}
