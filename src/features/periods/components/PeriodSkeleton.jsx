export function PeriodSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando períodos"
      aria-live="polite"
      className="mx-auto w-full max-w-[1120px] rounded-[22px] border border-zinc-200 bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.05)] sm:p-6"
    >
      <div className="animate-pulse">
        <div className="h-6 w-32 rounded-full bg-zinc-200" />
        <div className="mt-3 h-3 w-3/5 rounded-full bg-zinc-100" />

        <div className="mt-6 border-t border-zinc-200 pt-5">
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-2xl border border-zinc-200 bg-zinc-50"
              />
            ))}
          </div>

          <div className="mt-6 h-5 w-52 rounded-full bg-zinc-200" />

          <div className="mt-4 space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-20 rounded-2xl border border-zinc-200 bg-zinc-50"
              />
            ))}
          </div>
        </div>
      </div>

      <span className="sr-only">
        Cargando la gestión de períodos.
      </span>
    </div>
  );
}
