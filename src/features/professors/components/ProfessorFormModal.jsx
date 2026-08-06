import { LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminModal } from "../../../components/admin/AdminModal.jsx";
import {
  areSameIdArrays,
  courseBelongsToAnyCareer,
  getEntityId,
  getRelationIds,
  validateProfessorAcademicRelations,
} from "../utils/professor.utils.js";
import { RelationSelector } from "./RelationSelector.jsx";

const EMPTY_FORM = {
  fullName: "",
  bio: "",
  campusIds: [],
  careerIds: [],
  courseIds: [],
};

const validateForm = (values) => {
  const errors = {};
  const cleanName = values.fullName.trim();
  const cleanBio = values.bio.trim();

  if (!cleanName) {
    errors.fullName = "Ingresa el nombre completo.";
  } else if (cleanName.length < 2) {
    errors.fullName = "El nombre debe tener al menos 2 caracteres.";
  } else if (cleanName.length > 100) {
    errors.fullName = "El nombre no debe superar los 100 caracteres.";
  }

  if (cleanBio.length > 500) {
    errors.bio = "La biografía no debe superar los 500 caracteres.";
  }

  if (values.campusIds.length === 0) {
    errors.campusIds = "Selecciona al menos una sede.";
  }

  if (values.careerIds.length === 0) {
    errors.careerIds = "Selecciona al menos una carrera.";
  }

  if (values.courseIds.length === 0) {
    errors.courseIds = "Selecciona al menos un curso.";
  }

  return errors;
};

export function ProfessorFormModal({
  isOpen,
  professor,
  campuses,
  careers,
  courses,
  isLoadingOptions,
  optionsError,
  isSaving,
  onClose,
  onCreate,
  onUpdate,
}) {
  const isEditing = Boolean(professor);
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [courseWarning, setCourseWarning] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (professor) {
      setValues({
        fullName: professor.fullName ?? "",
        bio: professor.bio ?? "",
        campusIds: getRelationIds(professor.campusIds),
        careerIds: getRelationIds(professor.careerIds),
        courseIds: getRelationIds(professor.courseIds),
      });
    } else {
      setValues(EMPTY_FORM);
    }

    setErrors({});
    setGeneralError("");
    setCourseWarning("");
  }, [isOpen, professor]);

  const availableCourses = useMemo(() => {
    if (values.careerIds.length === 0) {
      return [];
    }

    return courses.filter((course) =>
      courseBelongsToAnyCareer(course, values.careerIds),
    );
  }, [courses, values.careerIds]);

  const setRelation = (fieldName, selectedIds) => {
    if (fieldName !== "careerIds") {
      setValues((current) => ({ ...current, [fieldName]: selectedIds }));
      setCourseWarning("");
      setErrors((current) => ({ ...current, [fieldName]: "" }));
      setGeneralError("");
      return;
    }

    const validCourseIds = values.courseIds.filter((courseId) => {
      const course = courses.find((item) => getEntityId(item) === courseId);

      return courseBelongsToAnyCareer(course, selectedIds);
    });

    const removedCount = values.courseIds.length - validCourseIds.length;

    setValues((current) => {
      const currentValidCourseIds = current.courseIds.filter((courseId) => {
        const course = courses.find((item) => getEntityId(item) === courseId);

        return courseBelongsToAnyCareer(course, selectedIds);
      });

      return {
        ...current,
        careerIds: selectedIds,
        courseIds: currentValidCourseIds,
      };
    });

    setCourseWarning(
      removedCount > 0
        ? `${removedCount} curso${removedCount === 1 ? "" : "s"} seleccionado${
            removedCount === 1 ? "" : "s"
          } se quit${removedCount === 1 ? "o" : "aron"} porque ya no pertenece${
            removedCount === 1 ? "" : "n"
          } a las carreras elegidas.`
        : "",
    );
    setErrors((current) => ({ ...current, [fieldName]: "" }));
    setGeneralError("");
  };

  const buildUpdatePayload = () => {
    if (!professor) {
      return {};
    }

    const payload = {};

    const originalCampusIds = getRelationIds(professor?.campusIds);

    const originalCareerIds = getRelationIds(professor?.careerIds);

    const originalCourseIds = getRelationIds(professor?.courseIds);

    const originalFullName = String(professor?.fullName ?? "").trim();

    const originalBio = String(professor?.bio ?? "").trim();

    const currentFullName = values.fullName.trim();
    const currentBio = values.bio.trim();

    if (currentFullName !== originalFullName) {
      payload.fullName = currentFullName;
    }

    if (currentBio !== originalBio) {
      payload.bio = currentBio;
    }

    if (!areSameIdArrays(values.campusIds, originalCampusIds)) {
      payload.campusIds = values.campusIds;
    }

    if (!areSameIdArrays(values.careerIds, originalCareerIds)) {
      payload.careerIds = values.careerIds;
    }

    if (!areSameIdArrays(values.courseIds, originalCourseIds)) {
      payload.courseIds = values.courseIds;
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const validationErrors = validateForm(values);
    setErrors(validationErrors);
    setGeneralError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const academicValidation = validateProfessorAcademicRelations({
      selectedCareerIds: values.careerIds,
      selectedCourseIds: values.courseIds,
      courses,
    });

    if (!academicValidation.valid) {
      setGeneralError(academicValidation.message);
      return;
    }

    if (isEditing && !professor) {
      setGeneralError(
        "No se pudo obtener la información del profesor. Cierra el formulario e inténtalo nuevamente.",
      );

      return;
    }
    const payload = isEditing
      ? buildUpdatePayload()
      : {
          fullName: values.fullName.trim(),
          bio: values.bio.trim(),
          campusIds: values.campusIds,
          careerIds: values.careerIds,
          courseIds: values.courseIds,
        };

    if (isEditing && Object.keys(payload).length === 0) {
      setGeneralError("No realizaste cambios en el profesor.");
      return;
    }

    const result = isEditing
      ? await onUpdate(getEntityId(professor), payload)
      : await onCreate(payload);

    if (result.ok) {
      onClose();
      return;
    }

    setGeneralError(result.message);
  };

  return (
    <AdminModal
      isOpen={isOpen}
      title={isEditing ? "Editar profesor" : "Agregar profesor"}
      description="Completa el nombre, la biografía y sus relaciones académicas."
      isBusy={isSaving}
      maxWidthClassName="max-w-4xl"
      onClose={onClose}
    >
      <form className="mt-5" onSubmit={handleSubmit} noValidate>
        {optionsError ? (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800"
          >
            {optionsError}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="professor-full-name"
              className="text-sm font-semibold text-zinc-800"
            >
              Nombre completo
            </label>
            <input
              id="professor-full-name"
              data-autofocus
              type="text"
              value={values.fullName}
              disabled={isSaving}
              maxLength={100}
              className={[
                "mt-1.5 h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:ring-4",
                errors.fullName
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                  : "border-zinc-200 focus:border-upc-red focus:ring-upc-red/10",
              ].join(" ")}
              onChange={(event) => {
                setValues((current) => ({
                  ...current,
                  fullName: event.target.value,
                }));
                setErrors((current) => ({ ...current, fullName: "" }));
                setGeneralError("");
              }}
            />
            {errors.fullName ? (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.fullName}
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="professor-bio"
                className="text-sm font-semibold text-zinc-800"
              >
                Biografía
              </label>
              <span className="text-[11px] text-zinc-400">
                {values.bio.length}/500
              </span>
            </div>
            <textarea
              id="professor-bio"
              value={values.bio}
              disabled={isSaving}
              maxLength={500}
              rows={4}
              placeholder="Describe brevemente la experiencia del profesor."
              className={[
                "mt-1.5 w-full resize-y rounded-xl border px-3 py-2.5 text-sm leading-5 outline-none transition focus:ring-4",
                errors.bio
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                  : "border-zinc-200 focus:border-upc-red focus:ring-upc-red/10",
              ].join(" ")}
              onChange={(event) => {
                setValues((current) => ({
                  ...current,
                  bio: event.target.value,
                }));
                setErrors((current) => ({ ...current, bio: "" }));
                setGeneralError("");
              }}
            />
            {errors.bio ? (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.bio}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <RelationSelector
            id="professor-campuses"
            label="Sedes"
            options={campuses}
            selectedIds={values.campusIds}
            error={errors.campusIds}
            disabled={isSaving || isLoadingOptions}
            onChange={(ids) => setRelation("campusIds", ids)}
          />
          <RelationSelector
            id="professor-careers"
            label="Carreras"
            options={careers}
            selectedIds={values.careerIds}
            error={errors.careerIds}
            disabled={isSaving || isLoadingOptions}
            onChange={(ids) => setRelation("careerIds", ids)}
          />
          <RelationSelector
            id="professor-courses"
            label="Cursos"
            description="Solo se muestran cursos de las carreras seleccionadas."
            options={availableCourses}
            selectedIds={values.courseIds}
            error={errors.courseIds}
            disabled={
              isSaving || isLoadingOptions || values.careerIds.length === 0
            }
            emptyMessage={
              values.careerIds.length === 0
                ? "Selecciona primero una carrera."
                : "No hay cursos disponibles."
            }
            onChange={(ids) => setRelation("courseIds", ids)}
          />
        </div>

        {courseWarning ? (
          <p
            role="status"
            className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800"
          >
            {courseWarning}
          </p>
        ) : null}

        {generalError ? (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {generalError}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isSaving}
            className="h-10 rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-700 outline-none hover:bg-zinc-50 focus-visible:ring-4 focus-visible:ring-upc-red/15 disabled:opacity-50"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving || isLoadingOptions || Boolean(optionsError)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-upc-red px-5 text-sm font-semibold text-white outline-none hover:bg-upc-red-dark focus-visible:ring-4 focus-visible:ring-upc-red/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <LoaderCircle
                aria-hidden="true"
                className="h-4 w-4 animate-spin"
              />
            ) : null}
            {isSaving
              ? "Guardando..."
              : isEditing
                ? "Guardar cambios"
                : "Agregar profesor"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
