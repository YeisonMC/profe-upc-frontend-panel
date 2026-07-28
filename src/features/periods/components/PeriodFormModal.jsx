import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";

import { AdminModal } from "../../../components/admin/AdminModal.jsx";
import {
  areSameInstants,
  fromDateTimeLocalValue,
  toDateTimeLocalValue,
} from "../utils/periodDates.js";

const createEmptyValues = () => ({
  title: "",
  startDate: "",
  endDate: "",
});

const validateValues = (values, datesDisabled) => {
  const errors = {};
  const normalizedTitle = values.title.trim();

  if (!normalizedTitle) {
    errors.title = "Ingresa el título del período.";
  } else if (normalizedTitle.length < 3) {
    errors.title = "El título debe tener al menos 3 caracteres.";
  } else if (normalizedTitle.length > 100) {
    errors.title = "El título no debe superar los 100 caracteres.";
  }

  if (!datesDisabled) {
    const startIso = fromDateTimeLocalValue(values.startDate);
    const endIso = fromDateTimeLocalValue(values.endDate);

    if (!startIso) {
      errors.startDate = "Selecciona la fecha de inicio.";
    }

    if (!endIso) {
      errors.endDate = "Selecciona la fecha de fin.";
    }

    if (
      startIso &&
      endIso &&
      new Date(endIso).getTime() <= new Date(startIso).getTime()
    ) {
      errors.endDate =
        "La fecha de fin debe ser posterior a la fecha de inicio.";
    }
  }

  return errors;
};

function FieldError({ id, message }) {
  if (!message) {
    return null;
  }

  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 text-xs leading-4 text-red-600"
    >
      {message}
    </p>
  );
}

export function PeriodFormModal({
  isOpen,
  typeConfig,
  period,
  isSaving,
  onClose,
  onSubmit,
}) {
  const [values, setValues] = useState(createEmptyValues);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const isEditing = Boolean(period?._id);
  const datesDisabled = isEditing && period?.isActive === false;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setErrors({});
    setGeneralError("");

    if (period) {
      setValues({
        title: period?.title ?? "",
        startDate: toDateTimeLocalValue(period?.startDate),
        endDate: toDateTimeLocalValue(period?.endDate),
      });

      return;
    }

    setValues(createEmptyValues());
  }, [isOpen, period]);

  const modalTitle = isEditing
    ? "Editar período"
    : "Nuevo período";

  const modalDescription = typeConfig.label;

  const submitLabel = isEditing
    ? "Guardar cambios"
    : "Crear período";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }

    if (generalError) {
      setGeneralError("");
    }
  };

  const buildPayload = () => {
    const normalizedTitle = values.title.trim();

    if (!isEditing) {
      return {
        title: normalizedTitle,
        startDate: fromDateTimeLocalValue(values.startDate),
        endDate: fromDateTimeLocalValue(values.endDate),
      };
    }

    if (!period) {
      return {};
    }

    const payload = {};

    if (normalizedTitle !== String(period?.title ?? "").trim()) {
      payload.title = normalizedTitle;
    }

    if (!datesDisabled) {
      const startDate = fromDateTimeLocalValue(values.startDate);
      const endDate = fromDateTimeLocalValue(values.endDate);

      if (!areSameInstants(startDate, period?.startDate)) {
        payload.startDate = startDate;
      }

      if (!areSameInstants(endDate, period?.endDate)) {
        payload.endDate = endDate;
      }
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    if (isEditing && !period) {
      setGeneralError(
        "No se pudo obtener la información del período.",
      );
      return;
    }

    const validationErrors = validateValues(
      values,
      datesDisabled,
    );

    setErrors(validationErrors);
    setGeneralError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = buildPayload();

    if (isEditing && Object.keys(payload).length === 0) {
      setGeneralError("No realizaste cambios para guardar.");
      return;
    }

    const result = await onSubmit(payload);

    if (!result?.ok) {
      setGeneralError(
        result?.message ||
          "No se pudo guardar el período.",
      );
      return;
    }

    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      title={modalTitle}
      description={modalDescription}
      maxWidthClassName="max-w-[520px]"
      onClose={() => {
        if (!isSaving) {
          onClose();
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        {generalError ? (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
            />

            <p className="text-xs leading-5 text-red-700">
              {generalError}
            </p>
          </div>
        ) : null}

        <div>
          <label
            htmlFor="period-title"
            className="text-[13px] font-semibold text-zinc-800"
          >
            Título
          </label>

          <input
            id="period-title"
            name="title"
            type="text"
            value={values.title}
            maxLength={100}
            disabled={isSaving}
            placeholder={
              typeConfig.id === "recommendation"
                ? "Ej. Recomendaciones 2026-2"
                : "Ej. Comentarios 2026-2"
            }
            aria-invalid={Boolean(errors.title)}
            aria-describedby={
              errors.title ? "period-title-error" : undefined
            }
            className={[
              "mt-1.5 h-11 w-full rounded-xl border bg-white px-3.5",
              "text-sm text-zinc-800 outline-none transition",
              "placeholder:text-zinc-400",
              "focus:ring-4 focus:ring-upc-red/10",
              errors.title
                ? "border-red-500 focus:border-red-500"
                : "border-zinc-200 focus:border-upc-red",
              "disabled:cursor-not-allowed disabled:bg-zinc-100",
            ].join(" ")}
            onChange={handleChange}
          />

          <FieldError
            id="period-title-error"
            message={errors.title}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="period-start-date"
              className="text-[13px] font-semibold text-zinc-800"
            >
              Fecha de inicio
            </label>

            <input
              id="period-start-date"
              name="startDate"
              type="datetime-local"
              value={values.startDate}
              disabled={isSaving || datesDisabled}
              aria-invalid={Boolean(errors.startDate)}
              aria-describedby={
                errors.startDate
                  ? "period-start-date-error"
                  : undefined
              }
              className={[
                "mt-1.5 h-11 w-full rounded-xl border bg-white px-3",
                "text-sm text-zinc-800 outline-none transition",
                "focus:ring-4 focus:ring-upc-red/10",
                errors.startDate
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-200 focus:border-upc-red",
                "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500",
              ].join(" ")}
              onChange={handleChange}
            />

            <FieldError
              id="period-start-date-error"
              message={errors.startDate}
            />
          </div>

          <div>
            <label
              htmlFor="period-end-date"
              className="text-[13px] font-semibold text-zinc-800"
            >
              Fecha de fin
            </label>

            <input
              id="period-end-date"
              name="endDate"
              type="datetime-local"
              value={values.endDate}
              disabled={isSaving || datesDisabled}
              aria-invalid={Boolean(errors.endDate)}
              aria-describedby={
                errors.endDate
                  ? "period-end-date-error"
                  : undefined
              }
              className={[
                "mt-1.5 h-11 w-full rounded-xl border bg-white px-3",
                "text-sm text-zinc-800 outline-none transition",
                "focus:ring-4 focus:ring-upc-red/10",
                errors.endDate
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-200 focus:border-upc-red",
                "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500",
              ].join(" ")}
              onChange={handleChange}
            />

            <FieldError
              id="period-end-date-error"
              message={errors.endDate}
            />
          </div>
        </div>

        {datesDisabled ? (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
            Las fechas de un período cerrado no pueden modificarse.
            Solo puedes corregir el título.
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isSaving}
            className="min-h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 outline-none transition hover:bg-zinc-50 focus-visible:ring-4 focus-visible:ring-upc-red/15 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-upc-red px-4 text-sm font-semibold text-white outline-none transition hover:bg-upc-red-dark focus-visible:ring-4 focus-visible:ring-upc-red/20 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isSaving ? (
              <LoaderCircle
                aria-hidden="true"
                className="h-4 w-4 animate-spin"
              />
            ) : null}

            {isSaving ? "Guardando..." : submitLabel}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
