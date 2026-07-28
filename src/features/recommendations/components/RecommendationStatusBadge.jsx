import { getRecommendationStatusConfig } from "../utils/recommendation.utils.js";

export function RecommendationStatusBadge({ status }) {
  const config = getRecommendationStatusConfig(status);

  return (
    <span
      className={[
        "inline-flex min-h-6 items-center rounded-full border px-2.5",
        "text-[10px] font-bold uppercase tracking-[0.035em]",
        config.classes,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}
