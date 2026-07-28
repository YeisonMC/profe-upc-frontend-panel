export function ProfessorSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-live="polite" aria-busy="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-[15px] border border-zinc-200 bg-white p-5">
          <div className="flex gap-3">
            <div className="h-11 w-11 rounded-xl bg-zinc-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-zinc-200" />
              <div className="h-3 w-2/3 rounded bg-zinc-100" />
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((__, groupIndex) => (
              <div key={groupIndex} className="space-y-2">
                <div className="h-3 w-20 rounded bg-zinc-100" />
                <div className="h-6 w-28 rounded-full bg-zinc-100" />
              </div>
            ))}
          </div>
        </div>
      ))}
      <span className="sr-only">Cargando profesores.</span>
    </div>
  );
}
