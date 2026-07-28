import { useEffect, useState } from "react";
import {
  AlertTriangle,
  LoaderCircle,
  LockKeyhole,
  Trash2,
} from "lucide-react";

import { AdminModal } from "../../../components/admin/AdminModal.jsx";

export function PeriodConfirmModal({
  isOpen,
  action,
  period,
  isProcessing,
  onClose,
  onConfirm,
}) {
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
    }
  }, [isOpen, period?._id, action]);

  const isDelete = action === "delete";
  const Icon = isDelete ? Trash2 : LockKeyhole;

  const title = isDelete
    ? "¿Eliminar este período?"
    : "¿Cerrar este período?";

  const description = isDelete
    ? `Se eliminará “${period?.title ?? "este período"}”. Esta acción no se puede deshacer.`
    : `Se cerrará “${period?.title ?? "este período"}” y dejará de recibir nuevos registros.`;

  const confirmLabel = isDelete ? "Eliminar" : "Cerrar período";

  const handleConfirm = async () => {
    if (!period || isProcessing) {
      return;
    }

    setError("");

    const result = await onConfirm();

    if (!result?.ok) {
      setError(
        result?.message ||
          "No se pudo completar la operación.",
      );
      return;
    }

    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      title={title}
      maxWidthClassName="max-w-[520px]"
      onClose={() => {
        if (!isProcessing) {
          onClose();
        }
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            isDelete
              ? "bg-red-50 text-red-600"
              : "bg-amber-50 text-amber-700",
          ].join(" ")}
        >
          <Icon
            aria-hidden="true"
            className="h-5 w-5"
          />
        </span>

        <div>
          <p className="text-sm leading-6 text-zinc-600">
            {description}
          </p>

          {isDelete ? (
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Si existen recomendaciones o evaluaciones asociadas,
              el backend impedirá la eliminación para preservar el
              historial.
            </p>
          ) : null}
        </div>
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
          className="min-h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 outline-none transition hover:bg-zinc-50 focus-visible:ring-4 focus-visible:ring-upc-red/15 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onClose}
        >
          Cancelar
        </button>

        <button
          type="button"
          disabled={isProcessing}
          className={[
            "flex min-h-10 items-center justify-center gap-2 rounded-xl px-4",
            "text-sm font-semibold text-white outline-none transition",
            "focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
            isDelete
              ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500/20"
              : "bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500/20",
          ].join(" ")}
          onClick={handleConfirm}
        >
          {isProcessing ? (
            <LoaderCircle
              aria-hidden="true"
              className="h-4 w-4 animate-spin"
            />
          ) : null}

          {isProcessing ? "Procesando..." : confirmLabel}
        </button>
      </div>
    </AdminModal>
  );
}
