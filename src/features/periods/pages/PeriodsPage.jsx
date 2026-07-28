import {
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  CalendarX2,
  LoaderCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  DEFAULT_PERIOD_TYPE,
  getPeriodTypeConfig,
  PERIOD_TYPE_IDS,
  PERIOD_TYPES,
} from "../config/periodTypes.js";
import { PeriodCategoryCard } from "../components/PeriodCategoryCard.jsx";
import { PeriodConfirmModal } from "../components/PeriodConfirmModal.jsx";
import { PeriodDetailModal } from "../components/PeriodDetailModal.jsx";
import { PeriodFormModal } from "../components/PeriodFormModal.jsx";
import { PeriodRow } from "../components/PeriodRow.jsx";
import { PeriodSkeleton } from "../components/PeriodSkeleton.jsx";
import { usePeriodsAdmin } from "../hooks/usePeriodsAdmin.js";

const EMPTY_CONFIRM_STATE = {
  isOpen: false,
  action: "",
  period: null,
};

export function PeriodsPage() {
  const shouldReduceMotion = useReducedMotion();

  const periodsAdmin = usePeriodsAdmin();

  const [selectedType, setSelectedType] = useState(
    DEFAULT_PERIOD_TYPE,
  );

  const [formState, setFormState] = useState({
    isOpen: false,
    period: null,
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmState, setConfirmState] = useState(
    EMPTY_CONFIRM_STATE,
  );

  const selectedConfig = getPeriodTypeConfig(selectedType);
  const selectedPeriods =
    periodsAdmin.periods[selectedType] ?? [];

  const totalPeriods = useMemo(() => {
    return Object.values(periodsAdmin.periods).reduce(
      (total, collection) => total + collection.length,
      0,
    );
  }, [periodsAdmin.periods]);

  const enabledRecommendationPeriod = useMemo(() => {
    return periodsAdmin.periods[
      PERIOD_TYPE_IDS.recommendation
    ].some((period) => period.isActive);
  }, [periodsAdmin.periods]);

  const creationBlocked =
    selectedConfig.blocksCreationWhileEnabled &&
    enabledRecommendationPeriod;

  const createActionKey = `${selectedType}:create`;

  const isFormSaving = formState.period
    ? periodsAdmin.actionKey ===
      `${selectedType}:update:${formState.period._id}`
    : periodsAdmin.actionKey === createActionKey;

  const openCreateForm = () => {
    if (creationBlocked) {
      return;
    }

    setFormState({
      isOpen: true,
      period: null,
    });
  };

  const openEditForm = (period) => {
    setFormState({
      isOpen: true,
      period,
    });
  };

  const closeForm = () => {
    setFormState((currentState) => ({
      ...currentState,
      isOpen: false,
    }));
  };

  const openDetail = async (period) => {
    setDetailOpen(true);

    await periodsAdmin.loadPeriodDetail(
      selectedType,
      period._id,
    );
  };

  const closeDetail = () => {
    setDetailOpen(false);
  };

  const openConfirmation = (action, period) => {
    setConfirmState({
      isOpen: true,
      action,
      period,
    });
  };

  const closeConfirmation = () => {
    setConfirmState((currentState) => ({
      ...currentState,
      isOpen: false,
    }));
  };

  const handleFormSubmit = (payload) => {
    if (formState.period) {
      return periodsAdmin.updatePeriod(
        selectedType,
        formState.period._id,
        payload,
      );
    }

    return periodsAdmin.createPeriod(selectedType, payload);
  };

  const handleConfirmation = () => {
    const periodId = confirmState.period?._id;

    if (!periodId) {
      return Promise.resolve({
        ok: false,
        message: "No se pudo identificar el período.",
      });
    }

    if (confirmState.action === "delete") {
      return periodsAdmin.deletePeriod(
        selectedType,
        periodId,
      );
    }

    return periodsAdmin.closePeriod(
      selectedType,
      periodId,
    );
  };

  const confirmationActionKey = confirmState.period
    ? `${selectedType}:${confirmState.action}:${confirmState.period._id}`
    : "";

  const isConfirmationProcessing =
    periodsAdmin.actionKey === confirmationActionKey;

  if (periodsAdmin.isLoading) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <PeriodSkeleton />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <section className="mx-auto w-full max-w-[1120px] rounded-[22px] border border-zinc-200 bg-white p-5 shadow-[0_8px_28px_rgba(0,0,0,0.05)] sm:p-6">
        <header className="border-b border-zinc-200 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-[22px] font-extrabold tracking-[-0.04em] text-zinc-950">
              Períodos
            </h1>

            <span className="inline-flex h-6 min-w-7 items-center justify-center rounded-full bg-zinc-100 px-2 text-xs font-bold text-zinc-700">
              {totalPeriods}
            </span>
          </div>

          <p className="mt-1 text-[13px] leading-5 text-zinc-500">
            Configura las ventanas de tiempo para recomendaciones de
            profesores y para comentarios.
          </p>
        </header>

        {periodsAdmin.notice ? (
          <motion.div
            role="status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            {periodsAdmin.notice.message}
          </motion.div>
        ) : null}

        {periodsAdmin.loadError ? (
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
                  No se pudieron cargar los períodos
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  {periodsAdmin.loadError}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-700 outline-none hover:bg-red-50 focus-visible:ring-4 focus-visible:ring-red-500/15"
              onClick={() => periodsAdmin.reload()}
            >
              <RefreshCw
                aria-hidden="true"
                className="h-4 w-4"
              />

              Reintentar
            </button>
          </div>
        ) : (
          <>
            <div
              role="tablist"
              aria-label="Tipos de períodos"
              className="mt-5 grid gap-3 md:grid-cols-2"
            >
              {Object.values(PERIOD_TYPES).map((config) => (
                <PeriodCategoryCard
                  key={config.id}
                  config={config}
                  total={
                    periodsAdmin.periods[config.id]?.length ?? 0
                  }
                  openCount={
                    periodsAdmin.activePeriods[config.id] ? 1 : 0
                  }
                  isSelected={selectedType === config.id}
                  onSelect={() => setSelectedType(config.id)}
                />
              ))}
            </div>

            <div className="mt-5 border-t border-zinc-200 pt-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-[17px] font-bold tracking-[-0.03em] text-zinc-950">
                    {selectedConfig.label}
                  </h2>

                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    {selectedPeriods.length === 1
                      ? "1 período configurado."
                      : `${selectedPeriods.length} períodos configurados.`}
                  </p>
                </div>

                <div className="flex flex-col items-stretch gap-2 sm:items-end">
                  <button
                    type="button"
                    disabled={
                      creationBlocked ||
                      periodsAdmin.actionKey === createActionKey
                    }
                    title={
                      creationBlocked
                        ? selectedConfig.creationBlockedMessage
                        : undefined
                    }
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-upc-red px-4 text-sm font-semibold text-white outline-none transition hover:bg-upc-red-dark focus-visible:ring-4 focus-visible:ring-upc-red/20 disabled:cursor-not-allowed disabled:bg-red-300"
                    onClick={openCreateForm}
                  >
                    {periodsAdmin.actionKey === createActionKey ? (
                      <LoaderCircle
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin"
                      />
                    ) : (
                      <Plus
                        aria-hidden="true"
                        className="h-4 w-4"
                      />
                    )}

                    Nuevo período
                  </button>

                  {creationBlocked ? (
                    <p className="max-w-sm text-right text-[11px] leading-4 text-amber-700">
                      {selectedConfig.creationBlockedMessage}
                    </p>
                  ) : null}
                </div>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selectedType}
                  id={`period-panel-${selectedType}`}
                  role="tabpanel"
                  aria-labelledby={`period-tab-${selectedType}`}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 0 }
                  }
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.18,
                  }}
                  className="mt-4"
                >
                  {selectedPeriods.length > 0 ? (
                    <div className="space-y-3">
                      {selectedPeriods.map((period) => {
                        const rowActionPrefix = `${selectedType}:`;
                        const isBusy =
                          periodsAdmin.actionKey.startsWith(
                            rowActionPrefix,
                          ) &&
                          periodsAdmin.actionKey.endsWith(
                            period._id,
                          );

                        return (
                          <PeriodRow
                            key={period._id}
                            period={period}
                            isBusy={isBusy}
                            onView={() => openDetail(period)}
                            onEdit={() => openEditForm(period)}
                            onClose={() =>
                              openConfirmation("close", period)
                            }
                            onDelete={() =>
                              openConfirmation("delete", period)
                            }
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 text-center">
                      <CalendarX2
                        aria-hidden="true"
                        className="h-9 w-9 text-zinc-300"
                      />

                      <h3 className="mt-4 font-display text-base font-bold text-zinc-800">
                        No hay períodos configurados
                      </h3>

                      <p className="mt-1 max-w-sm text-sm leading-6 text-zinc-500">
                        Crea el primer período para habilitar esta
                        ventana de participación.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        )}
      </section>

      <PeriodFormModal
        isOpen={formState.isOpen}
        typeConfig={selectedConfig}
        period={formState.period}
        isSaving={isFormSaving}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />

      <PeriodDetailModal
        isOpen={detailOpen}
        typeConfig={selectedConfig}
        detailState={periodsAdmin.detailState}
        onClose={closeDetail}
      />

      <PeriodConfirmModal
        isOpen={confirmState.isOpen}
        action={confirmState.action}
        period={confirmState.period}
        isProcessing={isConfirmationProcessing}
        onClose={closeConfirmation}
        onConfirm={handleConfirmation}
      />
    </div>
  );
}
