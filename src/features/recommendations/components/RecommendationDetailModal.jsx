import {
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  GraduationCap,
  Pencil,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { AdminModal } from "../../../components/admin/AdminModal.jsx";
import {
  formatRecommendationDate,
  getEntityName,
  getRecommendationFullName,
} from "../utils/recommendation.utils.js";
import { RecommendationStatusBadge } from "./RecommendationStatusBadge.jsx";

function DetailBlock({
  icon: Icon,
  label,
  children,
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
      <dt className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.05em] text-zinc-400">
        <Icon
          aria-hidden="true"
          className="h-4 w-4"
        />

        {label}
      </dt>

      <dd className="mt-2 break-words text-sm font-medium leading-6 text-zinc-800">
        {children}
      </dd>
    </div>
  );
}

export function RecommendationDetailModal({
  isOpen,
  detailState,
  onClose,
  onEdit,
  onAccept,
  onReject,
  onDelete,
}) {
  const recommendation = detailState.data;
  const isPending = recommendation?.status === "pending";

  return (
    <AdminModal
      isOpen={isOpen}
      title="Detalle de la recomendación"
      description="Información enviada y estado de moderación."
      maxWidthClassName="max-w-[760px]"
      onClose={onClose}
    >
      {detailState.isLoading ? (
        <div
          role="status"
          className="animate-pulse space-y-4"
        >
          <div className="h-7 w-1/2 rounded-full bg-zinc-200" />

          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-xl bg-zinc-100"
              />
            ))}
          </div>
        </div>
      ) : detailState.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {detailState.error}
        </p>
      ) : recommendation ? (
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-xl font-bold tracking-[-0.03em] text-zinc-950">
              {getRecommendationFullName(recommendation)}
            </h3>

            <RecommendationStatusBadge
              status={recommendation.status}
            />
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <DetailBlock
              icon={GraduationCap}
              label="Carrera"
            >
              {getEntityName(recommendation.careerId)}
            </DetailBlock>

            <DetailBlock
              icon={Building2}
              label="Sedes"
            >
              {(recommendation.campusIds ?? [])
                .map((campus) => getEntityName(campus))
                .join(", ") || "Sin sedes"}
            </DetailBlock>

            <DetailBlock
              icon={BookOpen}
              label="Curso sugerido"
            >
              {recommendation.courseName}
            </DetailBlock>

            <DetailBlock
              icon={CalendarDays}
              label="Período"
            >
              {getEntityName(
                recommendation.recommendationPeriodId,
              )}
            </DetailBlock>

            <DetailBlock
              icon={Clock3}
              label="Fecha de envío"
            >
              {formatRecommendationDate(
                recommendation.createdAt,
              )}
            </DetailBlock>

            <DetailBlock
              icon={Clock3}
              label="Última actualización"
            >
              {formatRecommendationDate(
                recommendation.updatedAt,
              )}
            </DetailBlock>

            {recommendation.status === "rejected" ? (
              <>
                <DetailBlock
                  icon={X}
                  label="Motivo de rechazo"
                >
                  {recommendation.rejectionReason ||
                    "Sin motivo registrado"}
                </DetailBlock>

                <DetailBlock
                  icon={Clock3}
                  label="Rechazada el"
                >
                  {formatRecommendationDate(
                    recommendation.rejectedAt,
                  )}
                </DetailBlock>
              </>
            ) : null}

            {recommendation.status === "reviewed" ? (
              <>
                <DetailBlock
                  icon={UserRound}
                  label="Profesor convertido"
                >
                  {getEntityName(
                    recommendation.convertedProfessorId,
                    recommendation.convertedProfessorId ||
                      "Profesor creado",
                  )}
                </DetailBlock>

                <DetailBlock
                  icon={Clock3}
                  label="Revisada el"
                >
                  {formatRecommendationDate(
                    recommendation.reviewedAt,
                  )}
                </DetailBlock>

                <DetailBlock
                  icon={Clock3}
                  label="Expira el"
                >
                  {formatRecommendationDate(
                    recommendation.reviewedExpiresAt,
                  )}
                </DetailBlock>
              </>
            ) : null}
          </dl>

          <div className="mt-6 flex flex-wrap justify-end gap-2">
            {isPending ? (
              <>
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 outline-none hover:bg-zinc-50 focus-visible:ring-4 focus-visible:ring-upc-red/15"
                  onClick={() => onEdit(recommendation)}
                >
                  <Pencil
                    aria-hidden="true"
                    className="h-4 w-4"
                  />

                  Editar
                </button>

                <button
                  type="button"
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 outline-none hover:bg-red-50 focus-visible:ring-4 focus-visible:ring-red-500/15"
                  onClick={() => onReject(recommendation)}
                >
                  <X
                    aria-hidden="true"
                    className="h-4 w-4"
                  />

                  Rechazar
                </button>

                <button
                  type="button"
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-upc-red px-4 text-sm font-semibold text-white outline-none hover:bg-upc-red-dark focus-visible:ring-4 focus-visible:ring-upc-red/20"
                  onClick={() => onAccept(recommendation)}
                >
                  <Check
                    aria-hidden="true"
                    className="h-4 w-4"
                  />

                  Aceptar y crear profesor
                </button>
              </>
            ) : null}

            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 outline-none hover:bg-red-50 focus-visible:ring-4 focus-visible:ring-red-500/15"
              onClick={() => onDelete(recommendation)}
            >
              <Trash2
                aria-hidden="true"
                className="h-4 w-4"
              />

              Eliminar
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-zinc-500">
          No se encontró la recomendación.
        </p>
      )}
    </AdminModal>
  );
}
