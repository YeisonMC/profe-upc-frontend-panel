import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { getEntityId, getRelationName } from "../utils/professor.utils.js";

export function RelationSelector({
  id,
  label,
  description,
  options,
  selectedIds,
  onChange,
  error,
  disabled = false,
  emptyMessage = "No hay opciones disponibles.",
}) {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("es");

    if (!normalizedSearch) {
      return options;
    }

    return options.filter((option) =>
      getRelationName(option)
        .toLocaleLowerCase("es")
        .includes(normalizedSearch),
    );
  }, [options, search]);

  const toggleOption = (optionId) => {
    if (selectedIds.includes(optionId)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== optionId));
      return;
    }

    onChange([...selectedIds, optionId]);
  };

  return (
    <fieldset
      disabled={disabled}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend className="text-sm font-semibold text-zinc-800">{label}</legend>

      {description ? (
        <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
      ) : null}

      <div className="relative mt-2">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="search"
          value={search}
          placeholder={`Buscar ${label.toLocaleLowerCase("es")}...`}
          className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-upc-red focus:ring-4 focus:ring-upc-red/10 disabled:cursor-not-allowed disabled:bg-zinc-100"
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div
        className={[
          "mt-2 max-h-44 overflow-y-auto rounded-xl border p-2",
          error
            ? "border-red-300 bg-red-50/30"
            : "border-zinc-200 bg-zinc-50/40",
        ].join(" ")}
      >
        {filteredOptions.length > 0 ? (
          <div className="grid gap-1 sm:grid-cols-2">
            {filteredOptions.map((option) => {
              const optionId = getEntityId(option);
              const isChecked = selectedIds.includes(optionId);

              return (
                <label
                  key={optionId}
                  className={[
                    "flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition",
                    isChecked
                      ? "border-red-200 bg-red-50 text-red-800"
                      : "border-transparent bg-white text-zinc-700 hover:border-zinc-200",
                  ].join(" ")}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    className="h-4 w-4 accent-upc-red"
                    onChange={() => toggleOption(optionId)}
                  />
                  <span className="min-w-0 truncate">
                    {getRelationName(option)}
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <p className="px-3 py-5 text-center text-sm text-zinc-500">
            {search ? "No hay coincidencias." : emptyMessage}
          </p>
        )}
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="text-[11px] text-zinc-500">
          {selectedIds.length} seleccionada{selectedIds.length === 1 ? "" : "s"}
        </p>

        {selectedIds.length > 0 ? (
          <button
            type="button"
            className="text-[11px] font-semibold text-upc-red outline-none hover:underline focus-visible:ring-2 focus-visible:ring-upc-red/20"
            onClick={() => onChange([])}
          >
            Limpiar
          </button>
        ) : null}
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-xs text-red-600"
        >
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
