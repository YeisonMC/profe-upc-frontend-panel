import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { LoaderCircle, Search } from "lucide-react";

import { AdminModal } from "../../../components/admin/AdminModal.jsx";
import {
  getCourseCareerIds,
  getEntityId,
} from "../utils/course.utils.js";

const COURSE_CODE_PATTERN = /^[A-Z0-9-]+$/;

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
    careerIds: [],
  });
  const [careerSearch, setCareerSearch] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setValues({
      name: initialItem?.name ?? "",
      code: initialItem?.code ?? "",
      careerIds: getCourseCareerIds(initialItem),
    });
    setCareerSearch("");
    setErrors({});
  }, [initialItem, isOpen]);

  const sortedCareers = useMemo(() => {
    return [...careers].sort((firstCareer, secondCareer) =>
      firstCareer.name.localeCompare(secondCareer.name, "es", {
        sensitivity: "base",
      }),
    );
  }, [careers]);

  const filteredCareers = useMemo(() => {
    const normalizedSearch = careerSearch.trim().toLocaleLowerCase("es");

    if (!normalizedSearch) {
      return sortedCareers;
    }

    return sortedCareers.filter((career) =>
      String(career?.name ?? "")
        .toLocaleLowerCase("es")
        .includes(normalizedSearch),
    );
  }, [careerSearch, sortedCareers]);

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

    if (values.careerIds.length === 0) {
      nextErrors.careerIds = "Selecciona al menos una carrera.";
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

  const toggleCareer = (careerId) => {
    setValues((currentValues) => {
      const isSelected = currentValues.careerIds.includes(careerId);

      return {
        ...currentValues,
        careerIds: isSelected
          ? currentValues.careerIds.filter(
              (selectedCareerId) => selectedCareerId !== careerId,
            )
          : [...currentValues.careerIds, careerId],
      };
    });

    if (errors.careerIds) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        careerIds: "",
      }));
    }
  };

  const clearCareers = () => {
    setValues((currentValues) => ({
      ...currentValues,
      careerIds: [],
    }));
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
      careerIds: values.careerIds,
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

        <fieldset
          disabled={isSubmitting || sortedCareers.length === 0}
          aria-describedby={errors.careerIds ? "course-careers-error" : undefined}
        >
          <legend className="mb-1.5 block text-sm font-medium text-zinc-800">
            Carreras <span className="text-upc-red">*</span>
          </legend>

          <label className="relative block">
            <span className="sr-only">Buscar carreras</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="search"
              value={careerSearch}
              placeholder="Buscar carrera..."
              disabled={isSubmitting || sortedCareers.length === 0}
              className="h-10 w-full rounded-[12px] border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/15 disabled:bg-zinc-100"
              onChange={(event) => setCareerSearch(event.target.value)}
            />
          </label>

          <div
            className={[
              "mt-2 max-h-48 overflow-y-auto rounded-[12px] border p-2",
              errors.careerIds
                ? "border-red-300 bg-red-50/30"
                : "border-zinc-200 bg-zinc-50/40",
            ].join(" ")}
          >
            {filteredCareers.length > 0 ? (
              <div className="grid gap-1 sm:grid-cols-2">
                {filteredCareers.map((career) => {
                  const careerId = getEntityId(career);
                  const isChecked = values.careerIds.includes(careerId);

                  return (
                    <label
                      key={careerId}
                      className={[
                        "flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition",
                        isChecked
                          ? "border-red-200 bg-red-50 text-red-800"
                          : "border-transparent bg-white text-zinc-700 hover:border-zinc-200",
                      ].join(" ")}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isSubmitting}
                        className="h-4 w-4 shrink-0 accent-upc-red"
                        onChange={() => toggleCareer(careerId)}
                      />
                      <span className="min-w-0 truncate">{career.name}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="px-3 py-5 text-center text-sm text-zinc-500">
                {careerSearch ? "No hay coincidencias." : "No hay carreras disponibles."}
              </p>
            )}
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-3">
            <p className="text-[11px] text-zinc-500">
              {values.careerIds.length} seleccionada
              {values.careerIds.length === 1 ? "" : "s"}
            </p>

            {values.careerIds.length > 0 ? (
              <button
                type="button"
                disabled={isSubmitting}
                className="text-[11px] font-semibold text-upc-red outline-none hover:underline focus-visible:ring-2 focus-visible:ring-upc-red/20 disabled:opacity-50"
                onClick={clearCareers}
              >
                Limpiar
              </button>
            ) : null}
          </div>

          {errors.careerIds ? (
            <p id="course-careers-error" className="mt-1.5 text-xs text-red-600">
              {errors.careerIds}
            </p>
          ) : null}

          {sortedCareers.length === 0 && !serverError ? (
            <p className="mt-1.5 text-xs text-amber-700">
              Primero debes registrar al menos una carrera activa.
            </p>
          ) : null}
        </fieldset>

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
