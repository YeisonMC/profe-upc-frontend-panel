import {
  CalendarClock,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { AdminModal } from "../../../components/admin/AdminModal.jsx";
import { formatPeriodDate } from "../utils/periodDates.js";
import { PeriodStatusBadge } from "./PeriodStatusBadge.jsx";

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
      <div className="flex items-center gap-2 text-zinc-500">
        <Icon
          aria-hidden="true"
          className="h-4 w-4"
          strokeWidth={1.8}
        />

        <dt className="text-xs font-semibold uppercase tracking-[0.05em]">
          {label}
        </dt>
      </div>

      <dd className="mt-2 text-sm font-medium text-zinc-900">
        {value}
      </dd>
    </div>
  );
}

export function PeriodDetailModal({
  isOpen,
  typeConfig,
  detailState,
  onClose,
}) {
  const period = detailState.data;

  return (
    <AdminModal
      isOpen={isOpen}
      title="Detalle del período"
      description={typeConfig.label}
      maxWidthClassName="max-w-[560px]"
      onClose={onClose}
    >
      {detailState.isLoading ? (
        <div
          role="status"
          className="animate-pulse space-y-3"
        >
          <div className="h-7 w-3/5 rounded-full bg-zinc-200" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-24 rounded-xl bg-zinc-100" />
            <div className="h-24 rounded-xl bg-zinc-100" />
          </div>
        </div>
      ) : detailState.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {detailState.error}
        </p>
      ) : period ? (
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-xl font-bold text-zinc-950">
              {period.title}
            </h3>

            <PeriodStatusBadge period={period} />
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <DetailItem
              icon={CalendarClock}
              label="Fecha de inicio"
              value={formatPeriodDate(period.startDate)}
            />

            <DetailItem
              icon={CalendarClock}
              label="Fecha de fin"
              value={formatPeriodDate(period.endDate)}
            />

            <DetailItem
              icon={CheckCircle2}
              label="Habilitado"
              value={period.isActive ? "Sí" : "No"}
            />

            <DetailItem
              icon={Clock3}
              label="Cerrado el"
              value={
                period.closedAt
                  ? formatPeriodDate(period.closedAt)
                  : "No cerrado"
              }
            />
          </dl>
        </div>
      ) : (
        <p className="text-sm text-zinc-500">
          No se encontró información del período.
        </p>
      )}
    </AdminModal>
  );
}
