export function PeriodCategoryCard({
  config,
  total,
  openCount,
  isSelected,
  onSelect,
}) {
  const Icon = config.icon;
  const totalLabel = total === 1 ? "1 período" : `${total} períodos`;
  const openLabel =
    openCount === 1 ? "1 abierto" : `${openCount} abiertos`;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-controls={`period-panel-${config.id}`}
      id={`period-tab-${config.id}`}
      className={[
        "w-full rounded-2xl border p-4 text-left outline-none",
        "transition-[border-color,background-color,box-shadow,transform] duration-200",
        "focus-visible:ring-4 focus-visible:ring-upc-red/15",
        isSelected
          ? "border-zinc-950 bg-red-50/70 shadow-sm"
          : "border-zinc-200 bg-white hover:border-red-200 hover:bg-red-50/30",
      ].join(" ")}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-upc-red">
          <Icon
            aria-hidden="true"
            className="h-[18px] w-[18px]"
            strokeWidth={1.9}
          />
        </span>

        <h2 className="font-display text-[14px] font-bold tracking-[-0.02em] text-zinc-950 sm:text-[15px]">
          {config.label}
        </h2>
      </div>

      <p className="mt-3 text-[12px] leading-5 text-zinc-500">
        {config.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex min-h-6 items-center rounded-full bg-zinc-100 px-3 text-[11px] font-semibold text-zinc-800">
          {totalLabel}
        </span>

        <span className="inline-flex min-h-6 items-center rounded-full border border-emerald-300 bg-emerald-50 px-3 text-[11px] font-semibold text-emerald-700">
          {openLabel}
        </span>
      </div>
    </button>
  );
}
