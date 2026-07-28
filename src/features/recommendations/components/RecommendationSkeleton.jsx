export function RecommendationSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando recomendaciones"
      aria-live="polite"
      className="space-y-3"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-5"
        >
          <div className="flex gap-4">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-zinc-200" />

            <div className="flex-1">
              <div className="h-4 w-1/3 rounded-full bg-zinc-200" />
              <div className="mt-3 h-3 w-1/2 rounded-full bg-zinc-100" />
              <div className="mt-5 h-3 w-2/3 rounded-full bg-zinc-100" />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <div className="h-9 w-20 rounded-xl bg-zinc-100" />
            <div className="h-9 w-24 rounded-xl bg-zinc-100" />
            <div className="h-9 w-24 rounded-xl bg-zinc-100" />
          </div>
        </div>
      ))}

      <span className="sr-only">
        Cargando la cola de recomendaciones.
      </span>
    </div>
  );
}
