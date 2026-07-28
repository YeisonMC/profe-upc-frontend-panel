import {
  useEffect,
  useState,
} from "react";
import {
  AlertCircle,
  LoaderCircle,
  X,
} from "lucide-react";

import { AdminModal } from "../../../components/admin/AdminModal.jsx";
import { getRecommendationFullName } from "../utils/recommendation.utils.js";

export function RejectRecommendationModal({
  isOpen,
  recommendation,
  isProcessing,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError("");
    }
  }, [isOpen, recommendation?._id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isProcessing) {
      return;
    }

    const normalizedReason = reason.trim();

    if (normalizedReason.length < 5) {
      setError(
        "El motivo debe tener al menos 5 caracteres.",
      );
      return;
    }

    if (normalizedReason.length > 300) {
      setError(
        "El motivo no debe superar los 300 caracteres.",
      );
      return;
    }

    const result = await onConfirm(normalizedReason);

    if (!result?.ok) {
      setError(
        result?.message ||
          "No se pudo rechazar la recomendación.",
      );
      return;
    }

    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      title="Rechazar recomendación"
      description={getRecommendationFullName(recommendation)}
      maxWidthClassName="max-w-[520px]"
      onClose={() => {
        if (!isProcessing) {
          onClose();
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="recommendation-rejection-reason"
          className="text-[13px] font-semibold text-zinc-800"
        >
          Motivo del rechazo
        </label>

        <textarea
          id="recommendation-rejection-reason"
          value={reason}
          maxLength={300}
          rows={5}
          disabled={isProcessing}
          placeholder="Explica por qué la recomendación no será aceptada."
          className="mt-1.5 w-full resize-y rounded-xl border border-zinc-200 px-3.5 py-3 text-sm leading-6 outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/10 disabled:bg-zinc-100"
          onChange={(event) => {
            setReason(event.target.value);
            setError("");
          }}
        />

        <div className="mt-1 flex items-start justify-between gap-3">
          {error ? (
            <p
              role="alert"
              className="flex items-start gap-1.5 text-xs leading-5 text-red-600"
            >
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
              />

              {error}
            </p>
          ) : (
            <span />
          )}

          <span className="shrink-0 text-xs text-zinc-400">
            {reason.length}/300
          </span>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isProcessing}
            className="min-h-10 rounded-xl border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 outline-none hover:bg-zinc-50 focus-visible:ring-4 focus-visible:ring-upc-red/15 disabled:opacity-60"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isProcessing}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white outline-none hover:bg-red-700 focus-visible:ring-4 focus-visible:ring-red-500/20 disabled:opacity-60"
          >
            {isProcessing ? (
              <LoaderCircle
                aria-hidden="true"
                className="h-4 w-4 animate-spin"
              />
            ) : (
              <X
                aria-hidden="true"
                className="h-4 w-4"
              />
            )}

            {isProcessing
              ? "Rechazando..."
              : "Rechazar recomendación"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
