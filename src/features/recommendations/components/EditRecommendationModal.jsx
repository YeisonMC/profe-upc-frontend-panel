import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  LoaderCircle,
  Search,
} from "lucide-react";

import { AdminModal } from "../../../components/admin/AdminModal.jsx";
import {
  areSameIdArrays,
  getEntityId,
  getEntityName,
  getRelationIds,
  normalizeSearchText,
} from "../utils/recommendation.utils.js";

const createEmptyValues = () => ({
  firstName: "",
  lastName: "",
  careerId: "",
  courseName: "",
  campusIds: [],
});

const validateValues = (values) => {
  const errors = {};

  if (values.firstName.trim().length < 2) {
    errors.firstName =
      "El nombre debe tener al menos 2 caracteres.";
  } else if (values.firstName.trim().length > 80) {
    errors.firstName =
      "El nombre no debe superar los 80 caracteres.";
  }

  if (values.lastName.trim().length < 2) {
    errors.lastName =
      "El apellido debe tener al menos 2 caracteres.";
  } else if (values.lastName.trim().length > 80) {
    errors.lastName =
      "El apellido no debe superar los 80 caracteres.";
  }

  if (!values.careerId) {
    errors.careerId = "Selecciona una carrera.";
  }

  if (values.courseName.trim().length < 2) {
    errors.courseName =
      "El curso debe tener al menos 2 caracteres.";
  } else if (values.courseName.trim().length > 150) {
    errors.courseName =
      "El curso no debe superar los 150 caracteres.";
  }

  if (values.campusIds.length === 0) {
    errors.campusIds = "Selecciona al menos una sede.";
  } else if (values.campusIds.length > 10) {
    errors.campusIds =
      "No puedes seleccionar más de 10 sedes.";
  }

  return errors;
};

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return (
    <p
      role="alert"
      className="mt-1.5 text-xs text-red-600"
    >
      {message}
    </p>
  );
}

export function EditRecommendationModal({
  isOpen,
  recommendation,
  careers,
  campuses,
  isLoadingReferences,
  referencesError,
  isSaving,
  onClose,
  onSubmit,
}) {
  const [values, setValues] = useState(createEmptyValues);
  const [campusSearch, setCampusSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setErrors({});
    setGeneralError("");
    setCampusSearch("");

    if (!recommendation) {
      setValues(createEmptyValues());
      return;
    }

    setValues({
      firstName: recommendation.firstName ?? "",
      lastName: recommendation.lastName ?? "",
      careerId: getEntityId(recommendation.careerId),
      courseName: recommendation.courseName ?? "",
      campusIds: getRelationIds(
        recommendation.campusIds,
      ),
    });
  }, [isOpen, recommendation]);

  const filteredCampuses = useMemo(() => {
    const normalizedSearch =
      normalizeSearchText(campusSearch);

    if (!normalizedSearch) {
      return campuses;
    }

    return campuses.filter((campus) =>
      normalizeSearchText(
        getEntityName(campus),
      ).includes(normalizedSearch),
    );
  }, [campusSearch, campuses]);

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

    setGeneralError("");
  };

  const toggleCampus = (campusId) => {
    setValues((currentValues) => {
      const isSelected =
        currentValues.campusIds.includes(campusId);

      return {
        ...currentValues,
        campusIds: isSelected
          ? currentValues.campusIds.filter(
              (selectedId) =>
                selectedId !== campusId,
            )
          : [...currentValues.campusIds, campusId],
      };
    });

    setErrors((currentErrors) => ({
      ...currentErrors,
      campusIds: "",
    }));

    setGeneralError("");
  };

  const buildPayload = () => {
    if (!recommendation) {
      return {};
    }

    const payload = {};

    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();
    const courseName = values.courseName.trim();

    if (
      firstName !==
      String(recommendation.firstName ?? "").trim()
    ) {
      payload.firstName = firstName;
    }

    if (
      lastName !==
      String(recommendation.lastName ?? "").trim()
    ) {
      payload.lastName = lastName;
    }

    if (
      courseName !==
      String(recommendation.courseName ?? "").trim()
    ) {
      payload.courseName = courseName;
    }

    if (
      values.careerId !==
      getEntityId(recommendation.careerId)
    ) {
      payload.careerId = values.careerId;
    }

    const originalCampusIds = getRelationIds(
      recommendation.campusIds,
    );

    if (
      !areSameIdArrays(
        values.campusIds,
        originalCampusIds,
      )
    ) {
      payload.campusIds = values.campusIds;
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    if (!recommendation) {
      setGeneralError(
        "No se pudo obtener la recomendación.",
      );
      return;
    }

    const validationErrors = validateValues(values);

    setErrors(validationErrors);
    setGeneralError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = buildPayload();

    if (Object.keys(payload).length === 0) {
      setGeneralError("No realizaste cambios para guardar.");
      return;
    }

    const result = await onSubmit(payload);

    if (!result?.ok) {
      setGeneralError(
        result?.message ||
          "No se pudo actualizar la recomendación.",
      );
      return;
    }

    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      title="Editar recomendación"
      description="Corrige únicamente la información enviada antes de moderarla."
      maxWidthClassName="max-w-[760px]"
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

        {referencesError ? (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800"
          >
            {referencesError}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="recommendation-first-name"
              className="text-[13px] font-semibold text-zinc-800"
            >
              Nombre
            </label>

            <input
              id="recommendation-first-name"
              name="firstName"
              value={values.firstName}
              maxLength={80}
              disabled={isSaving}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 text-sm outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/10 disabled:bg-zinc-100"
              onChange={handleChange}
            />

            <FieldError message={errors.firstName} />
          </div>

          <div>
            <label
              htmlFor="recommendation-last-name"
              className="text-[13px] font-semibold text-zinc-800"
            >
              Apellido
            </label>

            <input
              id="recommendation-last-name"
              name="lastName"
              value={values.lastName}
              maxLength={80}
              disabled={isSaving}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 text-sm outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/10 disabled:bg-zinc-100"
              onChange={handleChange}
            />

            <FieldError message={errors.lastName} />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="recommendation-career"
              className="text-[13px] font-semibold text-zinc-800"
            >
              Carrera
            </label>

            <select
              id="recommendation-career"
              name="careerId"
              value={values.careerId}
              disabled={isSaving || isLoadingReferences}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/10 disabled:bg-zinc-100"
              onChange={handleChange}
            >
              <option value="">
                {isLoadingReferences
                  ? "Cargando carreras..."
                  : "Selecciona una carrera"}
              </option>

              {careers.map((career) => (
                <option
                  key={getEntityId(career)}
                  value={getEntityId(career)}
                >
                  {getEntityName(career)}
                </option>
              ))}
            </select>

            <FieldError message={errors.careerId} />
          </div>

          <div>
            <label
              htmlFor="recommendation-course-name"
              className="text-[13px] font-semibold text-zinc-800"
            >
              Curso sugerido
            </label>

            <input
              id="recommendation-course-name"
              name="courseName"
              value={values.courseName}
              maxLength={150}
              disabled={isSaving}
              className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 px-3.5 text-sm outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/10 disabled:bg-zinc-100"
              onChange={handleChange}
            />

            <FieldError message={errors.courseName} />
          </div>
        </div>

        <fieldset className="mt-5">
          <legend className="text-[13px] font-semibold text-zinc-800">
            Sedes
          </legend>

          <label className="relative mt-2 block">
            <span className="sr-only">Buscar sedes</span>

            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="search"
              value={campusSearch}
              disabled={isSaving || isLoadingReferences}
              placeholder="Buscar sedes..."
              className="h-10 w-full rounded-xl border border-zinc-200 pl-10 pr-3 text-sm outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/10 disabled:bg-zinc-100"
              onChange={(event) =>
                setCampusSearch(event.target.value)
              }
            />
          </label>

          <div className="mt-2 max-h-52 overflow-y-auto rounded-xl border border-zinc-200 p-2">
            {filteredCampuses.length > 0 ? (
              <div className="grid gap-1 sm:grid-cols-2">
                {filteredCampuses.map((campus) => {
                  const campusId = getEntityId(campus);
                  const isSelected =
                    values.campusIds.includes(campusId);

                  return (
                    <label
                      key={campusId}
                      className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isSaving}
                        className="h-4 w-4 shrink-0 accent-upc-red"
                        onChange={() =>
                          toggleCampus(campusId)
                        }
                      />

                      <span className="break-words">
                        {getEntityName(campus)}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="px-3 py-6 text-center text-sm text-zinc-500">
                No hay sedes que coincidan.
              </p>
            )}
          </div>

          <p className="mt-1.5 text-xs text-zinc-500">
            {values.campusIds.length} seleccionada(s)
          </p>

          <FieldError message={errors.campusIds} />
        </fieldset>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isSaving}
            className="min-h-10 rounded-xl border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 outline-none hover:bg-zinc-50 focus-visible:ring-4 focus-visible:ring-upc-red/15 disabled:opacity-60"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-upc-red px-4 text-sm font-semibold text-white outline-none hover:bg-upc-red-dark focus-visible:ring-4 focus-visible:ring-upc-red/20 disabled:bg-red-300"
          >
            {isSaving ? (
              <LoaderCircle
                aria-hidden="true"
                className="h-4 w-4 animate-spin"
              />
            ) : null}

            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
