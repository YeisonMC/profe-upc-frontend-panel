import {
  useEffect,
  useState,
} from "react";
import { LoaderCircle } from "lucide-react";

import { AdminModal } from "./AdminModal.jsx";

export function NameFormModal({
  isOpen,
  mode,
  entityLabel,
  initialItem,
  maxLength,
  isSubmitting,
  serverError,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(initialItem?.name ?? "");
    setFieldError("");
  }, [initialItem, isOpen]);

  const isEditMode = mode === "edit";

  const validate = () => {
    const cleanName = name.trim();

    if (!cleanName) {
      return `El nombre de ${entityLabel} es obligatorio.`;
    }

    if (cleanName.length < 2) {
      return "El nombre debe tener al menos 2 caracteres.";
    }

    if (cleanName.length > maxLength) {
      return `El nombre no debe superar los ${maxLength} caracteres.`;
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationError = validate();
    setFieldError(validationError);

    if (validationError) {
      return;
    }

    await onSubmit({ name: name.trim() });
  };

  return (
    <AdminModal
      isOpen={isOpen}
      title={`${isEditMode ? "Editar" : "Agregar"} ${entityLabel}`}
      description={
        isEditMode
          ? "Actualiza el nombre y guarda los cambios."
          : `Registra una nueva ${entityLabel} en la plataforma.`
      }
      isBusy={isSubmitting}
      onClose={onClose}
    >
      <form className="mt-4" noValidate onSubmit={handleSubmit}>
        <label
          htmlFor={`${entityLabel}-name`}
          className="sr-only"
        >
          Nombre de {entityLabel}
        </label>

        <input
          id={`${entityLabel}-name`}
          data-autofocus
          type="text"
          value={name}
          maxLength={maxLength}
          disabled={isSubmitting}
          aria-invalid={Boolean(fieldError)}
          aria-describedby={
            fieldError ? `${entityLabel}-name-error` : undefined
          }
          className="h-12 w-full rounded-[14px] border border-zinc-300 px-3.5 text-sm text-zinc-900 outline-none transition-[border-color,box-shadow] focus:border-upc-red focus:ring-4 focus:ring-upc-red/15 disabled:cursor-not-allowed disabled:bg-zinc-100"
          onChange={(event) => {
            setName(event.target.value);

            if (fieldError) {
              setFieldError("");
            }
          }}
        />

        {fieldError ? (
          <p
            id={`${entityLabel}-name-error`}
            role="alert"
            className="mt-1.5 text-xs text-red-600"
          >
            {fieldError}
          </p>
        ) : null}

        {serverError ? (
          <p
            role="alert"
            className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {serverError}
          </p>
        ) : null}

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isSubmitting}
            className="h-10 rounded-[11px] border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 outline-none hover:bg-zinc-50 focus-visible:ring-4 focus-visible:ring-upc-red/15 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[11px] bg-upc-red px-4 text-sm font-semibold text-white outline-none transition-colors hover:bg-upc-red-dark focus-visible:ring-4 focus-visible:ring-upc-red/20 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? (
              <LoaderCircle
                aria-hidden="true"
                className="h-4 w-4 animate-spin"
              />
            ) : null}
            {isSubmitting
              ? "Guardando..."
              : isEditMode
                ? "Guardar"
                : "Agregar"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
