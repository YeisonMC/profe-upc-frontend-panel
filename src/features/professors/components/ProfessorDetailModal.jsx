import {
  BookOpen,
  Building2,
  GraduationCap,
  LoaderCircle,
  MapPinPlus,
  Pencil,
  Star,
  ThumbsUp,
  UsersRound,
} from "lucide-react";

import { AdminModal } from "../../../components/admin/AdminModal.jsx";
import {
  getEntityId,
  getProfessorInitials,
  getRelationName,
} from "../utils/professor.utils.js";

function Chips({ items, emptyText, tone = "zinc" }) {
  const tones = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    red: "border-red-200 bg-red-50 text-red-700",
    zinc: "border-zinc-200 bg-zinc-100 text-zinc-700",
  };

  if (!items?.length) {
    return <p className="text-sm text-zinc-400">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={getEntityId(item) || getRelationName(item)}
          className={`rounded-full border px-2.5 py-1 text-xs ${tones[tone]}`}
        >
          {getRelationName(item)}
        </span>
      ))}
    </div>
  );
}

export function ProfessorDetailModal({
  isOpen,
  professor,
  isLoading,
  error,
  onClose,
  onEdit,
  onAddCampuses,
}) {
  const stats = professor?.stats ?? {};

  return (
    <AdminModal
      isOpen={isOpen}
      title="Detalle del profesor"
      description="Información académica y relaciones actuales."
      maxWidthClassName="max-w-3xl"
      onClose={onClose}
    >
      {isLoading ? (
        <div className="flex min-h-72 items-center justify-center">
          <LoaderCircle aria-hidden="true" className="h-7 w-7 animate-spin text-upc-red" />
          <span className="sr-only">Cargando detalle.</span>
        </div>
      ) : error ? (
        <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : professor ? (
        <div className="mt-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 font-display font-bold text-upc-red">
                {getProfessorInitials(professor.fullName)}
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-zinc-950">
                  {professor.fullName}
                </h3>
                <p className="mt-1 text-xs text-zinc-400">/{professor.slug}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                onClick={() => onAddCampuses(professor)}
              >
                <MapPinPlus aria-hidden="true" className="h-4 w-4" />
                Agregar sedes
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-upc-red px-3 text-xs font-semibold text-white hover:bg-upc-red-dark"
                onClick={() => onEdit(professor)}
              >
                <Pencil aria-hidden="true" className="h-4 w-4" />
                Editar
              </button>
            </div>
          </div>

          <section className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.05em] text-zinc-500">
              Biografía
            </h4>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
              {professor.bio?.trim() || "Sin biografía"}
            </p>
          </section>

          <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Star, label: "Rating", value: Number(stats.averageRating ?? 0).toFixed(1) },
              { icon: UsersRound, label: "Reseñas", value: stats.reviewsCount ?? 0 },
              { icon: ThumbsUp, label: "Recomendación", value: `${stats.recommendationPercentage ?? 0}%` },
              { icon: BookOpen, label: "Dificultad", value: Number(stats.averageDifficulty ?? 0).toFixed(1) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-zinc-200 bg-white p-3">
                <Icon aria-hidden="true" className="h-4 w-4 text-upc-red" />
                <p className="mt-2 text-[10px] font-semibold uppercase text-zinc-400">{label}</p>
                <p className="mt-1 font-display text-lg font-bold text-zinc-900">{value}</p>
              </div>
            ))}
          </section>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <section>
              <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-zinc-500">
                <Building2 aria-hidden="true" className="h-4 w-4" /> Sedes
              </h4>
              <Chips items={professor.campusIds} emptyText="Sin sedes asignadas" tone="blue" />
            </section>
            <section>
              <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-zinc-500">
                <GraduationCap aria-hidden="true" className="h-4 w-4" /> Carreras
              </h4>
              <Chips items={professor.careerIds} emptyText="Sin carreras asociadas" tone="red" />
            </section>
            <section>
              <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-zinc-500">
                <BookOpen aria-hidden="true" className="h-4 w-4" /> Cursos
              </h4>
              <Chips items={professor.courseIds} emptyText="Sin cursos asignados" />
            </section>
          </div>

          {Array.isArray(professor.reviews) ? (
            <p className="mt-5 border-t border-zinc-200 pt-4 text-xs text-zinc-500">
              El endpoint devolvió {professor.reviews.length} reseña{professor.reviews.length === 1 ? "" : "s"} aprobada{professor.reviews.length === 1 ? "" : "s"} reciente{professor.reviews.length === 1 ? "" : "s"}. No se muestran campos individuales porque no se proporcionó el esquema de Review.
            </p>
          ) : null}
        </div>
      ) : null}
    </AdminModal>
  );
}
