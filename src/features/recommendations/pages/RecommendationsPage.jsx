import { useMemo, useState } from "react";
import { AlertCircle, Inbox, RefreshCw, UserRoundCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../app/config/routePaths.js";
import { RECOMMENDATION_STATUS } from "../config/recommendationConfig.js";
import { AcceptRecommendationModal } from "../components/AcceptRecommendationModal.jsx";
import { DeleteRecommendationModal } from "../components/DeleteRecommendationModal.jsx";
import { EditRecommendationModal } from "../components/EditRecommendationModal.jsx";
import { RecommendationCard } from "../components/RecommendationCard.jsx";
import { RecommendationDetailModal } from "../components/RecommendationDetailModal.jsx";
import { RecommendationFilters } from "../components/RecommendationFilters.jsx";
import { RecommendationSkeleton } from "../components/RecommendationSkeleton.jsx";
import { RejectRecommendationModal } from "../components/RejectRecommendationModal.jsx";
import { useRecommendationAdmin } from "../hooks/useRecommendationAdmin.js";
import {
  getEntityId,
  getRecommendationCounts,
  matchesRecommendationSearch,
} from "../utils/recommendation.utils.js";

const EMPTY_MODAL_STATE = {
  isOpen: false,
  recommendation: null,
};

export function RecommendationsPage() {
  const recommendationAdmin = useRecommendationAdmin();

  const [statusFilter, setStatusFilter] = useState(
    RECOMMENDATION_STATUS.pending,
  );

  const [searchValue, setSearchValue] = useState("");
  const [careerFilter, setCareerFilter] = useState("");
  const [campusFilter, setCampusFilter] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);

  const [editState, setEditState] = useState(EMPTY_MODAL_STATE);

  const [acceptState, setAcceptState] = useState(EMPTY_MODAL_STATE);

  const [rejectState, setRejectState] = useState(EMPTY_MODAL_STATE);

  const [deleteState, setDeleteState] = useState(EMPTY_MODAL_STATE);

  /*
   * Evita errores si por alguna razón el hook devuelve
   * un valor distinto de un arreglo.
   */
  const recommendations = Array.isArray(recommendationAdmin.recommendations)
    ? recommendationAdmin.recommendations
    : [];

  const careers = Array.isArray(recommendationAdmin.careers)
    ? recommendationAdmin.careers
    : [];

  const campuses = Array.isArray(recommendationAdmin.campuses)
    ? recommendationAdmin.campuses
    : [];

  const counts = useMemo(() => {
    return getRecommendationCounts(recommendations);
  }, [recommendations]);

  /*
   * Primero retiramos elementos inválidos o nulos.
   * Después aplicamos los filtros visuales.
   */
  const filteredRecommendations = useMemo(() => {
    return recommendations
      .filter((recommendation) => recommendation && recommendation._id)
      .filter((recommendation) => {
        if (
          statusFilter !== RECOMMENDATION_STATUS.all &&
          recommendation.status !== statusFilter
        ) {
          return false;
        }

        if (
          careerFilter &&
          getEntityId(recommendation.careerId) !== careerFilter
        ) {
          return false;
        }

        if (
          campusFilter &&
          !(recommendation.campusIds ?? []).some(
            (campus) => getEntityId(campus) === campusFilter,
          )
        ) {
          return false;
        }

        return matchesRecommendationSearch(recommendation, searchValue);
      });
  }, [campusFilter, careerFilter, recommendations, searchValue, statusFilter]);

  /*
   * Abrir detalle.
   */
  const openDetail = async (recommendation) => {
    const recommendationId = recommendation?._id;

    if (!recommendationId) {
      return;
    }

    setDetailOpen(true);

    await recommendationAdmin.loadDetail(recommendationId);
  };

  const closeDetail = () => {
    setDetailOpen(false);
  };

  /*
   * Abrir modales de acciones.
   */
  const openEdit = (recommendation) => {
    if (!recommendation?._id) {
      return;
    }

    setDetailOpen(false);

    setEditState({
      isOpen: true,
      recommendation,
    });
  };

  const openAccept = (recommendation) => {
    if (!recommendation?._id) {
      return;
    }

    setDetailOpen(false);

    setAcceptState({
      isOpen: true,
      recommendation,
    });
  };

  const openReject = (recommendation) => {
    if (!recommendation?._id) {
      return;
    }

    setDetailOpen(false);

    setRejectState({
      isOpen: true,
      recommendation,
    });
  };

  const openDelete = (recommendation) => {
    if (!recommendation?._id) {
      return;
    }

    setDetailOpen(false);

    setDeleteState({
      isOpen: true,
      recommendation,
    });
  };

  /*
   * Al cerrar conservamos temporalmente la recomendación.
   * Esto evita errores durante la animación de salida del modal.
   */
  const closeEdit = () => {
    setEditState((currentState) => ({
      ...currentState,
      isOpen: false,
    }));
  };

  const closeAccept = () => {
    setAcceptState((currentState) => ({
      ...currentState,
      isOpen: false,
    }));
  };

  const closeReject = () => {
    setRejectState((currentState) => ({
      ...currentState,
      isOpen: false,
    }));
  };

  const closeDelete = () => {
    setDeleteState((currentState) => ({
      ...currentState,
      isOpen: false,
    }));
  };

  /*
   * Restablecer filtros.
   */
  const clearFilters = () => {
    setSearchValue("");
    setStatusFilter(RECOMMENDATION_STATUS.pending);
    setCareerFilter("");
    setCampusFilter("");
  };

  /*
   * Determina si una tarjeta tiene una operación activa.
   */
  const isCardBusy = (recommendationId) => {
    if (
      !recommendationId ||
      typeof recommendationAdmin.actionKey !== "string"
    ) {
      return false;
    }

    return recommendationAdmin.actionKey.endsWith(recommendationId);
  };

  /*
   * Manejadores seguros de los formularios.
   * Nunca se lee _id directamente sobre un valor null.
   */
  const handleEditSubmit = (payload) => {
    const recommendationId = editState.recommendation?._id;

    if (!recommendationId) {
      return Promise.resolve({
        ok: false,
        message: "No se pudo identificar la recomendación que deseas editar.",
      });
    }

    return recommendationAdmin.updateRecommendation(recommendationId, payload);
  };

  const handleAcceptConfirm = (payload) => {
    const recommendationId = acceptState.recommendation?._id;

    if (!recommendationId) {
      return Promise.resolve({
        ok: false,
        message: "No se pudo identificar la recomendación que deseas aceptar.",
      });
    }

    return recommendationAdmin.acceptRecommendation(recommendationId, payload);
  };

  const handleRejectConfirm = (reason) => {
    const recommendationId = rejectState.recommendation?._id;

    if (!recommendationId) {
      return Promise.resolve({
        ok: false,
        message: "No se pudo identificar la recomendación que deseas rechazar.",
      });
    }

    return recommendationAdmin.rejectRecommendation(recommendationId, reason);
  };

  const handleDeleteConfirm = () => {
    const recommendationId = deleteState.recommendation?._id;

    if (!recommendationId) {
      return Promise.resolve({
        ok: false,
        message: "No se pudo identificar la recomendación que deseas eliminar.",
      });
    }

    return recommendationAdmin.deleteRecommendation(recommendationId);
  };

  /*
   * Estado inicial de carga.
   */
  if (recommendationAdmin.isLoading) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="mx-auto w-full max-w-[1120px] rounded-[22px] border border-zinc-200 bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.05)] sm:p-6">
          <div className="h-7 w-72 animate-pulse rounded-full bg-zinc-200" />

          <div className="mt-3 h-3 w-2/3 animate-pulse rounded-full bg-zinc-100" />

          <div className="mt-6 border-t border-zinc-200 pt-5">
            <RecommendationSkeleton />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <section className="mx-auto w-full max-w-[1120px] rounded-[22px] border border-zinc-200 bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.05)] sm:p-6">
        <header className="border-b border-zinc-200 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-[22px] font-extrabold tracking-[-0.04em] text-zinc-950">
              Recomendaciones de profesores
            </h1>

            <span className="inline-flex h-6 min-w-7 items-center justify-center rounded-full bg-zinc-100 px-2 text-xs font-bold text-zinc-700">
              {counts.pending}
            </span>
          </div>

          <p className="mt-1 text-[13px] leading-5 text-zinc-500">
            Revisa, corrige y convierte las solicitudes enviadas por los
            estudiantes en profesores oficiales.
          </p>
        </header>

        {recommendationAdmin.notice ? (
          <motion.div
            role="status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-2">
              <UserRoundCheck aria-hidden="true" className="h-5 w-5 shrink-0" />

              <span className="font-medium">
                {recommendationAdmin.notice.message}
              </span>
            </div>

            {recommendationAdmin.notice.professor ? (
              <Link
                to={ROUTES.professors}
                className="font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4"
              >
                Ir a Profesores
              </Link>
            ) : null}
          </motion.div>
        ) : null}

        {recommendationAdmin.loadError ? (
          <div
            role="alert"
            className="mt-5 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
              />

              <div>
                <p className="text-sm font-semibold text-red-800">
                  No se pudieron cargar las recomendaciones
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  {recommendationAdmin.loadError}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-700 outline-none transition hover:bg-red-50 focus-visible:ring-4 focus-visible:ring-red-500/15"
              onClick={() => recommendationAdmin.reload()}
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <div className="mt-5">
              <RecommendationFilters
                searchValue={searchValue}
                statusValue={statusFilter}
                careerValue={careerFilter}
                campusValue={campusFilter}
                counts={counts}
                careers={careers}
                campuses={campuses}
                disabled={recommendationAdmin.isLoadingReferences}
                onSearchChange={setSearchValue}
                onStatusChange={setStatusFilter}
                onCareerChange={setCareerFilter}
                onCampusChange={setCampusFilter}
                onClear={clearFilters}
              />

              {recommendationAdmin.referencesError ? (
                <p
                  role="alert"
                  className="mt-2 text-xs leading-5 text-amber-700"
                >
                  Algunos filtros no pudieron cargarse:{" "}
                  {recommendationAdmin.referencesError}
                </p>
              ) : null}
            </div>

            <div className="mt-5 border-t border-zinc-200 pt-5">
              <AnimatePresence mode="popLayout">
                {filteredRecommendations.length > 0 ? (
                  <div className="space-y-3">
                    {filteredRecommendations.map((recommendation) => (
                      <RecommendationCard
                        key={recommendation._id}
                        recommendation={recommendation}
                        isBusy={isCardBusy(recommendation._id)}
                        onView={() => openDetail(recommendation)}
                        onEdit={() => openEdit(recommendation)}
                        onAccept={() => openAccept(recommendation)}
                        onReject={() => openReject(recommendation)}
                        onDelete={() => openDelete(recommendation)}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 text-center"
                  >
                    <Inbox
                      aria-hidden="true"
                      className="h-10 w-10 text-zinc-300"
                    />

                    <h2 className="mt-4 font-display text-base font-bold text-zinc-800">
                      No hay recomendaciones que coincidan
                    </h2>

                    <p className="mt-1 max-w-md text-sm leading-6 text-zinc-500">
                      Cambia el estado o limpia los filtros para revisar otras
                      solicitudes.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </section>

      <RecommendationDetailModal
        isOpen={detailOpen}
        detailState={recommendationAdmin.detailState}
        onClose={closeDetail}
        onEdit={openEdit}
        onAccept={openAccept}
        onReject={openReject}
        onDelete={openDelete}
      />

      <EditRecommendationModal
        isOpen={editState.isOpen}
        recommendation={editState.recommendation}
        careers={careers}
        campuses={campuses}
        isLoadingReferences={recommendationAdmin.isLoadingReferences}
        referencesError={recommendationAdmin.referencesError}
        isSaving={
          Boolean(editState.recommendation?._id) &&
          recommendationAdmin.actionKey ===
            `update:${editState.recommendation?._id}`
        }
        onClose={closeEdit}
        onSubmit={handleEditSubmit}
      />

      <AcceptRecommendationModal
        isOpen={acceptState.isOpen}
        recommendation={acceptState.recommendation}
        isProcessing={
          Boolean(acceptState.recommendation?._id) &&
          recommendationAdmin.actionKey ===
            `accept:${acceptState.recommendation?._id}`
        }
        onClose={closeAccept}
        onConfirm={handleAcceptConfirm}
      />

      <RejectRecommendationModal
        isOpen={rejectState.isOpen}
        recommendation={rejectState.recommendation}
        isProcessing={
          Boolean(rejectState.recommendation?._id) &&
          recommendationAdmin.actionKey ===
            `reject:${rejectState.recommendation?._id}`
        }
        onClose={closeReject}
        onConfirm={handleRejectConfirm}
      />

      <DeleteRecommendationModal
        isOpen={deleteState.isOpen}
        recommendation={deleteState.recommendation}
        isProcessing={
          Boolean(deleteState.recommendation?._id) &&
          recommendationAdmin.actionKey ===
            `delete:${deleteState.recommendation?._id}`
        }
        onClose={closeDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
