import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  AlertCircle,
  Check,
  GraduationCap,
  LoaderCircle,
} from "lucide-react";

import { AdminModal } from "../../../components/admin/AdminModal.jsx";
import {
  getEntityId,
  getEntityName,
  getRecommendationFullName,
} from "../utils/recommendation.utils.js";
import { OfficialCourseSelector } from "./OfficialCourseSelector.jsx";

export function AcceptRecommendationModal({
  isOpen,
  recommendation,
  isProcessing,
  onClose,
  onConfirm,
}) {
  const [courseId, setCourseId] = useState("");
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setCourseId("");
    setBio("");
    setErrors({});
    setGeneralError("");
  }, [isOpen, recommendation?._id]);

  const handleCourseChange = useCallback((value) => {
    setCourseId(value);

    setErrors((currentErrors) => ({
      ...currentErrors,
      courseId: "",
    }));

    setGeneralError("");
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isProcessing) {
      return;
    }

    if (!recommendation) {
      setGeneralError(
        "No se pudo obtener la recomendación.",
      );
      return;
    }

    const nextErrors = {};

    if (!courseId) {
      nextErrors.courseId =
        "Selecciona un curso oficial.";
    }

    if (bio.trim().length > 500) {
      nextErrors.bio =
        "La biografía no debe superar los 500 caracteres.";
    }

    setErrors(nextErrors);
    setGeneralError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = await onConfirm({
      courseId,
      bio: bio.trim(),
    });

    if (!result?.ok) {
      setGeneralError(
        result?.message ||
          "No se pudo aceptar la recomendación.",
      );
      return;
    }

    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      title="Aceptar y crear profesor"
      description="Selecciona el curso oficial y confirma los datos del profesor."
      maxWidthClassName="max-w-[760px]"
      onClose={() => {
        if (!isProcessing) {
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

        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
          <div className="flex items-center gap-2">
            <GraduationCap
              aria-hidden="true"
              className="h-5 w-5 text-upc-red"
            />

            <h3 className="font-display text-sm font-bold text-zinc-900">
              Profesor que se creará
            </h3>
          </div>

          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.04em] text-zinc-400">
                Nombre completo
              </dt>

              <dd className="mt-1 font-semibold text-zinc-800">
                {getRecommendationFullName(recommendation)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.04em] text-zinc-400">
                Carrera
              </dt>

              <dd className="mt-1 font-semibold text-zinc-800">
                {getEntityName(recommendation?.careerId)}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-[0.04em] text-zinc-400">
                Curso sugerido por el usuario
              </dt>

              <dd className="mt-1 break-words font-semibold text-zinc-800">
                {recommendation?.courseName}
              </dd>
            </div>
          </dl>
        </section>

        <fieldset className="mt-5">
          <legend className="text-[13px] font-semibold text-zinc-800">
            Curso oficial
          </legend>

          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Solo se muestran cursos compatibles con la carrera de la recomendación.
          </p>

          <div className="mt-2">
            <OfficialCourseSelector
              careerId={getEntityId(
                recommendation?.careerId,
              )}
              selectedCourseId={courseId}
              disabled={isProcessing}
              onChange={handleCourseChange}
            />
          </div>

          {errors.courseId ? (
            <p
              role="alert"
              className="mt-1.5 text-xs text-red-600"
            >
              {errors.courseId}
            </p>
          ) : null}
        </fieldset>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="recommendation-professor-bio"
              className="text-[13px] font-semibold text-zinc-800"
            >
              Biografía opcional
            </label>

            <span className="text-xs text-zinc-400">
              {bio.length}/500
            </span>
          </div>

          <textarea
            id="recommendation-professor-bio"
            value={bio}
            maxLength={500}
            rows={5}
            disabled={isProcessing}
            placeholder="Describe brevemente la experiencia del profesor."
            className="mt-1.5 w-full resize-y rounded-xl border border-zinc-200 px-3.5 py-3 text-sm leading-6 outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/10 disabled:bg-zinc-100"
            onChange={(event) => {
              setBio(event.target.value);

              setErrors((currentErrors) => ({
                ...currentErrors,
                bio: "",
              }));

              setGeneralError("");
            }}
          />

          {errors.bio ? (
            <p
              role="alert"
              className="mt-1.5 text-xs text-red-600"
            >
              {errors.bio}
            </p>
          ) : null}
        </div>

        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800">
          Al confirmar, el backend creará al profesor oficial y marcará esta recomendación como revisada.
        </p>

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
            type="submit"
            disabled={isProcessing}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-upc-red px-4 text-sm font-semibold text-white outline-none hover:bg-upc-red-dark focus-visible:ring-4 focus-visible:ring-upc-red/20 disabled:bg-red-300"
          >
            {isProcessing ? (
              <LoaderCircle
                aria-hidden="true"
                className="h-4 w-4 animate-spin"
              />
            ) : (
              <Check
                aria-hidden="true"
                className="h-4 w-4"
              />
            )}

            {isProcessing
              ? "Creando profesor..."
              : "Aceptar y crear profesor"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
