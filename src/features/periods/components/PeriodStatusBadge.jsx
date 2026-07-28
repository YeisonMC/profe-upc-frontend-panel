import { getPeriodStatusConfig } from "../utils/periodStatus.js";

export function PeriodStatusBadge({ period }) {
  const statusConfig = getPeriodStatusConfig(period);

  return (
    <span
      className={[
        "inline-flex min-h-6 items-center rounded-full border px-2.5",
        "text-[11px] font-semibold",
        statusConfig.classes,
      ].join(" ")}
    >
      {statusConfig.label}
    </span>
  );
}
