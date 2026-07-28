import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { LoaderCircle } from "lucide-react";

import { AdminModal } from "../../../components/admin/AdminModal.jsx";

const COURSE_CODE_PATTERN = /^[A-Z0-9-]+$/;

const getCareerId = (course) => {
  const career = course?.careerId;

  if (typeof career === "string") {
    return career;
  }

  return career?._id ?? career?.id ?? "";
};

export function CourseFormModal({
  isOpen,
  mode,
  initialItem,
  careers,
  isSubmitting,
  serverError,
  onClose,
  onSubmit,
}) {
  const [values, setValues] = useState({
    name: "",
    code: "",
    careerId: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setValues({
      name: initialItem?.name ?? "",
      code: initialItem?.code ?? "",
      careerId: getCareerId(initialItem),
    });
    setErrors({});
  }, [initialItem, isOpen]);

  const sortedCareers = useMemo(() => {
    return [...careers].sort((firstCareer, secondCareer) =>
      firstCareer.name.localeCompare(secondCareer.name, "es", {
        sensitivity: "base",
      }),
    );
  }, [careers]);

  const validate = () => {
    const nextErrors = {};
    const cleanName = values.name.trim();
    const cleanCode = values.code.trim().toUpperCase();

    if (!cleanName) {
      nextErrors.name = "El nombre del curso es obligatorio.";
    } else if (cleanName.length < 2) {
      nextErrors.name = "El nombre debe tener al menos 2 caracteres.";
    } else if (cleanName.length > 150) {
      nextErrors.name = "El nombre no debe superar los 150 caracteres.";
    }

    if (cleanCode) {
      if (cleanCode.length < 2) {
        nextErrors.code = "El código debe tener al menos 2 caracteres.";
      } else if (cleanCode.length > 20) {
        nextErrors.code = "El código no debe superar los 20 caracteres.";
      } else if (!COURSE_CODE_PATTERN.test(cleanCode)) {
        nextErrors.code =
          "El código solo puede contener letras, números y guiones.";
      }
    }

    if (!values.careerId) {
      nextErrors.careerId = "Selecciona una carrera.";
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: name === "code" ? value.toUpperCase() : value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await onSubmit({
      name: values.name.trim(),
      code: values.code.trim()
        ? values.code.trim().toUpperCase()
        : null,
      careerId: values.careerId,
    });
  };

  const isEditMode = mode === "edit";

  return (
    <AdminModal
      isOpen={isOpen}
      title={`${isEditMode ? "Editar" : "Agregar"} curso`}
      description={
        isEditMode
          ? "Actualiza los datos del curso y guarda los cambios."
          : "Registra un curso y asígnalo a una carrera activa."
      }
      isBusy={isSubmitting}
      onClose={onClose}
    >
      <form className="mt-4 space-y-4" noValidate onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="course-name"
            className="mb-1.5 block text-sm font-medium text-zinc-800"
          >
            Nombre <span className="text-upc-red">*</span>
          </label>

          <input
            id="course-name"
            data-autofocus
            name="name"
            type="text"
            value={values.name}
            maxLength={150}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "course-name-error" : undefined}
            className="h-11 w-full rounded-[12px] border border-zinc-300 px-3 text-sm outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/15 disabled:bg-zinc-100"
            onChange={handleChange}
          />

          {errors.name ? (
            <p id="course-name-error" className="mt-1.5 text-xs text-red-600">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="course-code"
            className="mb-1.5 block text-sm font-medium text-zinc-800"
          >
            Código <span className="font-normal text-zinc-400">(opcional)</span>
          </label>

          <input
            id="course-code"
            name="code"
            type="text"
            value={values.code}
            maxLength={20}
            placeholder="Ej. CC184"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.code)}
            aria-describedby={errors.code ? "course-code-error" : undefined}
            className="h-11 w-full rounded-[12px] border border-zinc-300 px-3 text-sm uppercase outline-none placeholder:normal-case focus:border-upc-red focus:ring-4 focus:ring-upc-red/15 disabled:bg-zinc-100"
            onChange={handleChange}
          />

          {errors.code ? (
            <p id="course-code-error" className="mt-1.5 text-xs text-red-600">
              {errors.code}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="course-career"
            className="mb-1.5 block text-sm font-medium text-zinc-800"
          >
            Carrera <span className="text-upc-red">*</span>
          </label>

          <select
            id="course-career"
            name="careerId"
            value={values.careerId}
            disabled={isSubmitting || sortedCareers.length === 0}
            aria-invalid={Boolean(errors.careerId)}
            aria-describedby={
              errors.careerId ? "course-career-error" : undefined
            }
            className="h-11 w-full rounded-[12px] border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/15 disabled:bg-zinc-100"
            onChange={handleChange}
          >
            <option value="">Selecciona una carrera</option>

            {sortedCareers.map((career) => (
              <option
                key={career._id ?? career.id}
                value={career._id ?? career.id}
              >
                {career.name}
              </option>
            ))}
          </select>

          {errors.careerId ? (
            <p id="course-career-error" className="mt-1.5 text-xs text-red-600">
              {errors.careerId}
            </p>
          ) : null}

          {sortedCareers.length === 0 && !serverError ? (
            <p className="mt-1.5 text-xs text-amber-700">
              Primero debes registrar al menos una carrera activa.
            </p>
          ) : null}
        </div>

        {serverError ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {serverError}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isSubmitting}
            className="h-10 rounded-[11px] border border-zinc-200 px-4 text-sm font-medium text-zinc-800 outline-none hover:bg-zinc-50 focus-visible:ring-4 focus-visible:ring-upc-red/15 disabled:opacity-50"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting || sortedCareers.length === 0}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[11px] bg-upc-red px-4 text-sm font-semibold text-white outline-none hover:bg-upc-red-dark focus-visible:ring-4 focus-visible:ring-upc-red/20 disabled:cursor-not-allowed disabled:opacity-60"
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
