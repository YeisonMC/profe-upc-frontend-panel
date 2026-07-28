import {
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  Eye,
  GraduationCap,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  formatRecommendationDate,
  getEntityName,
  getInitials,
  getRecommendationFullName,
} from "../utils/recommendation.utils.js";
import { RecommendationStatusBadge } from "./RecommendationStatusBadge.jsx";

function ActionButton({
  label,
  icon: Icon,
  tone = "neutral",
  disabled,
  onClick,
}) {
  const toneClasses = {
    neutral:
      "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
    primary:
      "border-upc-red bg-upc-red text-white hover:bg-upc-red-dark",
    danger:
      "border-red-200 bg-white text-red-600 hover:bg-red-50",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border px-3",
        "text-xs font-semibold outline-none transition",
        "focus-visible:ring-4 focus-visible:ring-upc-red/15",
        "disabled:cursor-not-allowed disabled:opacity-50",
        toneClasses[tone],
      ].join(" ")}
      onClick={onClick}
    >
      <Icon
        aria-hidden="true"
        className="h-4 w-4"
        strokeWidth={1.8}
      />

      {label}
    </button>
  );
}

export function RecommendationCard({
  recommendation,
  isBusy,
  onView,
  onEdit,
  onAccept,
  onReject,
  onDelete,
}) {
  const shouldReduceMotion = useReducedMotion();
  const isPending = recommendation.status === "pending";

  return (
    <motion.article
      layout={!shouldReduceMotion}
      initial={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 0, scale: 0.995 }
      }
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.99 }
      }
      transition={{
        duration: shouldReduceMotion ? 0 : 0.2,
      }}
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_3px_12px_rgba(0,0,0,0.035)] sm:p-5"
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 font-display text-sm font-extrabold text-upc-red">
          {getInitials(recommendation)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-sm text-left font-display text-[15px] font-bold tracking-[-0.025em] text-zinc-950 outline-none hover:text-upc-red focus-visible:ring-2 focus-visible:ring-upc-red/20"
              onClick={onView}
            >
              {getRecommendationFullName(recommendation)}
            </button>

            <RecommendationStatusBadge
              status={recommendation.status}
            />

            {recommendation.recommendationPeriodId ? (
              <span className="inline-flex min-h-6 items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 text-[10px] font-semibold text-red-700">
                <CalendarDays
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />

                {getEntityName(
                  recommendation.recommendationPeriodId,
                )}
              </span>
            ) : null}
          </div>

          <div className="mt-2 grid gap-2 text-[11px] text-zinc-500 sm:grid-cols-3">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <GraduationCap
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0"
              />

              <span className="truncate">
                {getEntityName(recommendation.careerId)}
              </span>
            </span>

            <span className="inline-flex min-w-0 items-center gap-1.5">
              <Building2
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0"
              />

              <span className="truncate">
                {(recommendation.campusIds ?? [])
                  .map((campus) => getEntityName(campus))
                  .join(", ") || "Sin sedes"}
              </span>
            </span>

            <span className="inline-flex min-w-0 items-center gap-1.5">
              <CalendarDays
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0"
              />

              <span className="truncate">
                {formatRecommendationDate(
                  recommendation.createdAt,
                )}
              </span>
            </span>
          </div>

          <div className="mt-4 rounded-xl bg-zinc-50 px-3.5 py-3">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.05em] text-zinc-400">
              <BookOpen
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />

              Curso sugerido
            </p>

            <p className="mt-1 break-words text-sm font-medium text-zinc-800">
              {recommendation.courseName}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <ActionButton
          label="Ver"
          icon={Eye}
          disabled={isBusy}
          onClick={onView}
        />

        {isPending ? (
          <>
            <ActionButton
              label="Editar"
              icon={Pencil}
              disabled={isBusy}
              onClick={onEdit}
            />

            <ActionButton
              label="Rechazar"
              icon={X}
              disabled={isBusy}
              onClick={onReject}
            />

            <ActionButton
              label="Aceptar"
              icon={Check}
              tone="primary"
              disabled={isBusy}
              onClick={onAccept}
            />
          </>
        ) : null}

        <ActionButton
          label="Eliminar"
          icon={Trash2}
          tone="danger"
          disabled={isBusy}
          onClick={onDelete}
        />
      </div>
    </motion.article>
  );
}
