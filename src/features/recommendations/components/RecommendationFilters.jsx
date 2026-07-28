import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { RECOMMENDATION_STATUS_OPTIONS } from "../config/recommendationConfig.js";
import {
  getEntityId,
  getEntityName,
} from "../utils/recommendation.utils.js";

export function RecommendationFilters({
  searchValue,
  statusValue,
  careerValue,
  campusValue,
  counts,
  careers,
  campuses,
  disabled,
  onSearchChange,
  onStatusChange,
  onCareerChange,
  onCampusChange,
  onClear,
}) {
  const hasFilters =
    Boolean(searchValue) ||
    statusValue !== "pending" ||
    Boolean(careerValue) ||
    Boolean(campusValue);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filtrar recomendaciones por estado"
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {RECOMMENDATION_STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={statusValue === option.value}
            disabled={disabled}
            className={[
              "inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border px-3.5",
              "text-xs font-semibold outline-none transition",
              "focus-visible:ring-4 focus-visible:ring-upc-red/15",
              statusValue === option.value
                ? "border-upc-red bg-red-50 text-upc-red"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50",
              "disabled:cursor-not-allowed disabled:opacity-60",
            ].join(" ")}
            onClick={() => onStatusChange(option.value)}
          >
            {option.label}

            <span
              className={[
                "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5",
                statusValue === option.value
                  ? "bg-upc-red text-white"
                  : "bg-zinc-100 text-zinc-600",
              ].join(" ")}
            >
              {counts[option.value] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-[minmax(240px,1fr)_220px_220px_auto]">
        <label className="relative block">
          <span className="sr-only">
            Buscar recomendaciones
          </span>

          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          />

          <input
            type="search"
            value={searchValue}
            disabled={disabled}
            placeholder="Buscar por nombre, carrera, curso, sede o período..."
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-10 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-upc-red focus:ring-4 focus:ring-upc-red/10 disabled:cursor-not-allowed disabled:bg-zinc-100"
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
          />

          {searchValue ? (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-400 outline-none hover:bg-zinc-100 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-upc-red/20"
              onClick={() => onSearchChange("")}
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </label>

        <label>
          <span className="sr-only">Filtrar por carrera</span>

          <select
            value={careerValue}
            disabled={disabled}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none transition focus:border-upc-red focus:ring-4 focus:ring-upc-red/10 disabled:cursor-not-allowed disabled:bg-zinc-100"
            onChange={(event) =>
              onCareerChange(event.target.value)
            }
          >
            <option value="">Todas las carreras</option>

            {careers.map((career) => (
              <option
                key={getEntityId(career)}
                value={getEntityId(career)}
              >
                {getEntityName(career)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Filtrar por sede</span>

          <select
            value={campusValue}
            disabled={disabled}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none transition focus:border-upc-red focus:ring-4 focus:ring-upc-red/10 disabled:cursor-not-allowed disabled:bg-zinc-100"
            onChange={(event) =>
              onCampusChange(event.target.value)
            }
          >
            <option value="">Todas las sedes</option>

            {campuses.map((campus) => (
              <option
                key={getEntityId(campus)}
                value={getEntityId(campus)}
              >
                {getEntityName(campus)}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          disabled={disabled || !hasFilters}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 outline-none transition hover:bg-zinc-50 focus-visible:ring-4 focus-visible:ring-upc-red/15 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onClear}
        >
          <SlidersHorizontal
            aria-hidden="true"
            className="h-4 w-4"
          />

          Limpiar
        </button>
      </div>
    </div>
  );
}
