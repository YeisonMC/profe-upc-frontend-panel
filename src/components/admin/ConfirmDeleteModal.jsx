import { LoaderCircle } from "lucide-react";

import { AdminModal } from "./AdminModal.jsx";

export function ConfirmDeleteModal({
  isOpen,
  entityName,
  itemName,
  isDeleting,
  error,
  onClose,
  onConfirm,
}) {
  return (
    <AdminModal
      isOpen={isOpen}
      title={`¿Eliminar ${entityName} "${itemName}"?`}
      description="Esta acción no se puede deshacer desde el panel. El registro dejará de aparecer en los listados activos."
      isBusy={isDeleting}
      onClose={onClose}
    >
      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isDeleting}
          className="h-10 rounded-[11px] border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 outline-none transition-colors hover:bg-zinc-50 focus-visible:ring-4 focus-visible:ring-upc-red/15 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onClose}
        >
          Cancelar
        </button>

        <button
          type="button"
          disabled={isDeleting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[11px] bg-red-500 px-4 text-sm font-semibold text-white outline-none transition-colors hover:bg-red-600 focus-visible:ring-4 focus-visible:ring-red-500/20 disabled:cursor-wait disabled:opacity-60"
          onClick={onConfirm}
        >
          {isDeleting ? (
            <LoaderCircle
              aria-hidden="true"
              className="h-4 w-4 animate-spin"
            />
          ) : null}
          {isDeleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </AdminModal>
  );
}
