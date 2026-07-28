import { LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminModal } from "../../../components/admin/AdminModal.jsx";
import {
  getEntityId,
  getRelationIds,
} from "../utils/professor.utils.js";
import { RelationSelector } from "./RelationSelector.jsx";

export function AddCampusesModal({
  isOpen,
  professor,
  campuses,
  isSaving,
  onClose,
  onSubmit,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedIds([]);
      setError("");
    }
  }, [isOpen]);

  const availableCampuses = useMemo(() => {
    const currentIds = new Set(getRelationIds(professor?.campusIds));
    return campuses.filter((campus) => !currentIds.has(getEntityId(campus)));
  }, [campuses, professor]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedIds.length === 0) {
      setError("Selecciona al menos una sede nueva.");
      return;
    }

    const result = await onSubmit(getEntityId(professor), selectedIds);

    if (result.ok) {
      onClose();
      return;
    }

    setError(result.message);
  };

  return (
    <AdminModal
      isOpen={isOpen}
      title="Agregar sedes"
      description="Las sedes elegidas se añadirán sin reemplazar las actuales."
      isBusy={isSaving}
      maxWidthClassName="max-w-xl"
      onClose={onClose}
    >
      <form className="mt-5" onSubmit={handleSubmit}>
        <RelationSelector
          id="add-professor-campuses"
          label="Sedes disponibles"
          options={availableCampuses}
          selectedIds={selectedIds}
          error={selectedIds.length === 0 ? error : ""}
          disabled={isSaving}
          emptyMessage="El profesor ya tiene todas las sedes activas asignadas."
          onChange={(ids) => {
            setSelectedIds(ids);
            setError("");
          }}
        />

        {error && selectedIds.length > 0 ? (
          <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isSaving}
            className="h-10 rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving || availableCampuses.length === 0}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-upc-red px-5 text-sm font-semibold text-white hover:bg-upc-red-dark disabled:opacity-60"
          >
            {isSaving ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
            {isSaving ? "Agregando..." : "Agregar sedes"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
