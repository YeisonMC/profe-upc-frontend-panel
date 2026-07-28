import {
  useEffect,
  useState,
} from "react";
import {
  AlertTriangle,
  LoaderCircle,
  Trash2,
} from "lucide-react";

import { AdminModal } from "../../../components/admin/AdminModal.jsx";
import { getRecommendationFullName } from "../utils/recommendation.utils.js";

export function DeleteRecommendationModal({
  isOpen,
  recommendation,
  isProcessing,
  onClose,
  onConfirm,
}) {
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
    }
  }, [isOpen, recommendation?._id]);

  const handleConfirm = async () => {
    if (!recommendation || isProcessing) {
      return;
    }

    setError("");

    const result = await onConfirm();

    if (!result?.ok) {
      setError(
        result?.message ||
          "No se pudo eliminar la recomendación.",
      );
      return;
    }

    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      title="¿Eliminar esta recomendación?"
      maxWidthClassName="max-w-[520px]"
      onClose={() => {
        if (!isProcessing) {
          onClose();
        }
      }}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
          <Trash2
            aria-hidden="true"
            className="h-5 w-5"
          />
        </span>

        <p className="text-sm leading-6 text-zinc-600">
          Se eliminará definitivamente la recomendación de{" "}
          <strong className="text-zinc-900">
            {getRecommendationFullName(recommendation)}
          </strong>
          . Esta acción no se puede deshacer.
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5"
        >
          <AlertTriangle
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
          />

          <p className="text-xs leading-5 text-red-700">
            {error}
          </p>
        </div>
      ) : null}

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
          type="button"
          disabled={isProcessing}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white outline-none hover:bg-red-700 focus-visible:ring-4 focus-visible:ring-red-500/20 disabled:opacity-60"
          onClick={handleConfirm}
        >
          {isProcessing ? (
            <LoaderCircle
              aria-hidden="true"
              className="h-4 w-4 animate-spin"
            />
          ) : (
            <Trash2
              aria-hidden="true"
              className="h-4 w-4"
            />
          )}

          {isProcessing
            ? "Eliminando..."
            : "Eliminar definitivamente"}
        </button>
      </div>
    </AdminModal>
  );
}
