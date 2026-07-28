import { Plus, RefreshCw, SearchX } from "lucide-react";

function LoadingGrid() {
  return (
    <div
      aria-label="Cargando registros"
      aria-busy="true"
      className="grid grid-cols-1 gap-2 md:grid-cols-2"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex min-h-[66px] animate-pulse items-center gap-3 rounded-[12px] border border-zinc-200 px-4"
        >
          <div className="h-9 w-9 rounded-full bg-zinc-100" />
          <div className="h-3 w-2/5 rounded bg-zinc-100" />
        </div>
      ))}
    </div>
  );
}

export function CatalogPageShell({
  title,
  description,
  total,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  onAdd,
  addLabel = "Agregar",
  isLoading,
  loadError,
  onRetry,
  hasItems,
  hasFilteredItems,
  emptyMessage,
  children,
}) {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
      <section className="rounded-[24px] border border-zinc-200 bg-white px-5 py-6 shadow-[0_8px_20px_rgba(0,0,0,0.055)] sm:px-6 lg:px-7">
        <header>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-[21px] font-bold tracking-[-0.035em] text-zinc-950">
              {title}
            </h1>

            <span
              aria-label={`${total} registros`}
              className="inline-flex min-w-7 items-center justify-center rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-bold text-zinc-700"
            >
              {total}
            </span>
          </div>

          <p className="mt-1 text-sm leading-5 text-zinc-500">
            {description}
          </p>
        </header>

        <div className="my-5 h-px bg-zinc-200" />

        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor={`${title}-search`}>
            Buscar en {title.toLowerCase()}
          </label>

          <input
            id={`${title}-search`}
            type="search"
            value={searchValue}
            placeholder={searchPlaceholder}
            className="h-10 min-w-0 flex-1 rounded-[11px] border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-[border-color,box-shadow] placeholder:text-zinc-500 focus:border-upc-red focus:ring-4 focus:ring-upc-red/10"
            onChange={(event) => onSearchChange(event.target.value)}
          />

          <button
            type="button"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[11px] bg-upc-red px-5 text-sm font-semibold text-white outline-none transition-colors hover:bg-upc-red-dark focus-visible:ring-4 focus-visible:ring-upc-red/20 active:bg-upc-red-active"
            onClick={onAdd}
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            {addLabel}
          </button>
        </div>

        <div className="mt-5">
          {isLoading ? <LoadingGrid /> : null}

          {!isLoading && loadError ? (
            <div
              role="alert"
              className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50/50 px-6 text-center"
            >
              <p className="max-w-md text-sm text-red-700">
                {loadError}
              </p>

              <button
                type="button"
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-700 outline-none hover:bg-red-50 focus-visible:ring-4 focus-visible:ring-red-500/15"
                onClick={onRetry}
              >
                <RefreshCw aria-hidden="true" className="h-4 w-4" />
                Reintentar
              </button>
            </div>
          ) : null}

          {!isLoading && !loadError && !hasItems ? (
            <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 text-center">
              <SearchX aria-hidden="true" className="h-7 w-7 text-zinc-400" />
              <p className="mt-3 text-sm font-semibold text-zinc-700">
                {emptyMessage}
              </p>
            </div>
          ) : null}

          {!isLoading && !loadError && hasItems && !hasFilteredItems ? (
            <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 text-center">
              <SearchX aria-hidden="true" className="h-7 w-7 text-zinc-400" />
              <p className="mt-3 text-sm font-semibold text-zinc-700">
                No encontramos coincidencias
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Prueba con otro término de búsqueda.
              </p>
            </div>
          ) : null}

          {!isLoading && !loadError && hasFilteredItems
            ? children
            : null}
        </div>
      </section>
    </div>
  );
}
