import {
  CalendarClock,
  Eye,
  LockKeyhole,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { formatPeriodDate } from "../utils/periodDates.js";
import { PeriodStatusBadge } from "./PeriodStatusBadge.jsx";

function ActionButton({
  label,
  icon: Icon,
  tone = "neutral",
  disabled,
  onClick,
}) {
  const toneClasses = {
    neutral:
      "border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950",
    amber:
      "border-amber-200 text-amber-700 hover:bg-amber-50",
    danger:
      "border-red-200 text-red-600 hover:bg-red-50",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border px-3",
        "text-[12px] font-semibold outline-none transition",
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

export function PeriodRow({
  period,
  isBusy,
  onView,
  onEdit,
  onClose,
  onDelete,
}) {
  const shouldReduceMotion = useReducedMotion();

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
      transition={{
        duration: shouldReduceMotion ? 0 : 0.2,
      }}
      className="rounded-2xl border border-zinc-200 bg-white px-4 py-4"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-sm text-left font-display text-[14px] font-bold tracking-[-0.02em] text-zinc-950 outline-none hover:text-upc-red focus-visible:ring-2 focus-visible:ring-upc-red/20"
              onClick={onView}
            >
              {period.title}
            </button>

            <PeriodStatusBadge period={period} />
          </div>

          <div className="mt-2 flex flex-col gap-1 text-[11px] text-zinc-500 sm:flex-row sm:flex-wrap sm:gap-x-5">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />

              <span>Inicio:</span>

              <strong className="font-semibold text-zinc-800">
                {formatPeriodDate(period.startDate)}
              </strong>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <CalendarClock
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />

              <span>Fin:</span>

              <strong className="font-semibold text-zinc-800">
                {formatPeriodDate(period.endDate)}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <ActionButton
            label="Ver"
            icon={Eye}
            disabled={isBusy}
            onClick={onView}
          />

          <ActionButton
            label="Editar"
            icon={Pencil}
            disabled={isBusy}
            onClick={onEdit}
          />

          {period.isActive ? (
            <ActionButton
              label="Cerrar"
              icon={LockKeyhole}
              tone="amber"
              disabled={isBusy}
              onClick={onClose}
            />
          ) : null}

          <ActionButton
            label="Eliminar"
            icon={Trash2}
            tone="danger"
            disabled={isBusy}
            onClick={onDelete}
          />
        </div>
      </div>
    </motion.article>
  );
}
