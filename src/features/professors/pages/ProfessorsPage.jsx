import {
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserRoundX,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import { ConfirmDeleteModal } from "../../../components/admin/ConfirmDeleteModal.jsx";
import { OperationNotice } from "../../../components/admin/OperationNotice.jsx";
import { AddCampusesModal } from "../components/AddCampusesModal.jsx";
import { ProfessorCard } from "../components/ProfessorCard.jsx";
import { ProfessorDetailModal } from "../components/ProfessorDetailModal.jsx";
import { ProfessorFormModal } from "../components/ProfessorFormModal.jsx";
import { ProfessorSkeleton } from "../components/ProfessorSkeleton.jsx";
import { useProfessorAdmin } from "../hooks/useProfessorAdmin.js";
import { getCourseCareerId, getEntityId } from "../utils/professor.utils.js";

const SORT_OPTIONS = [
  { value: "", label: "Más recientes" },
  { value: "rating", label: "Mejor rating" },
  { value: "recommended", label: "Más recomendados" },
  { value: "reviews", label: "Más reseñas" },
  { value: "difficulty", label: "Mayor dificultad" },
];

export function ProfessorsPage() {
  const shouldReduceMotion = useReducedMotion();
  const professorAdmin = useProfessorAdmin();

  const [formProfessor, setFormProfessor] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteProfessorTarget, setDeleteProfessorTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [addCampusesProfessor, setAddCampusesProfessor] = useState(null);

  const hasActiveFilters = Boolean(
    professorAdmin.filters.search ||
    professorAdmin.filters.campusId ||
    professorAdmin.filters.careerId ||
    professorAdmin.filters.courseId ||
    professorAdmin.filters.sort,
  );

  const courseFilterOptions = useMemo(() => {
    if (!professorAdmin.filters.careerId) {
      return professorAdmin.courses;
    }

    return professorAdmin.courses.filter(
      (course) => getCourseCareerId(course) === professorAdmin.filters.careerId,
    );
  }, [professorAdmin.courses, professorAdmin.filters.careerId]);

  const openCreate = () => {
    setFormProfessor(null);
    setIsFormOpen(true);
  };

  const openEdit = (professor) => {
    setIsDetailOpen(false);
    setFormProfessor(professor);
    setIsFormOpen(true);
  };

  const openDetail = async (professor) => {
    professorAdmin.setDetailProfessor(null);
    professorAdmin.setDetailError("");
    setIsDetailOpen(true);
    await professorAdmin.loadDetail(professor.slug);
  };

  const confirmDelete = async () => {
    if (!deleteProfessorTarget) {
      return;
    }

    setDeleteError("");
    const result = await professorAdmin.deleteItem(
      getEntityId(deleteProfessorTarget),
    );

    if (result.ok) {
      setDeleteProfessorTarget(null);
      return;
    }

    setDeleteError(result.message);
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <section className="rounded-[20px] border border-zinc-200 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.045)] sm:p-6">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-[22px] font-extrabold tracking-[-0.035em] text-zinc-950">
                Profesores
              </h1>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700">
                {professorAdmin.total}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Gestiona nombre, biografía, sedes, carreras y cursos del catálogo
              docente.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-upc-red px-4 text-sm font-semibold text-white outline-none transition-colors hover:bg-upc-red-dark focus-visible:ring-4 focus-visible:ring-upc-red/20"
            onClick={openCreate}
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Agregar profesor
          </button>
        </header>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(260px,1.4fr)_repeat(4,minmax(150px,0.7fr))_auto]">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="search"
              value={professorAdmin.filters.search}
              placeholder="Buscar profesor por nombre..."
              className="h-10 w-full rounded-xl border border-zinc-200 pl-9 pr-3 text-sm outline-none transition focus:border-upc-red focus:ring-4 focus:ring-upc-red/10"
              onChange={(event) =>
                professorAdmin.updateFilter("search", event.target.value)
              }
            />
          </div>

          <select
            value={professorAdmin.filters.campusId}
            aria-label="Filtrar por sede"
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/10"
            onChange={(event) =>
              professorAdmin.updateFilter("campusId", event.target.value)
            }
          >
            <option value="">Todas las sedes</option>
            {professorAdmin.campuses.map((campus) => (
              <option key={getEntityId(campus)} value={getEntityId(campus)}>
                {campus.name}
              </option>
            ))}
          </select>

          <select
            value={professorAdmin.filters.careerId}
            aria-label="Filtrar por carrera"
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/10"
            onChange={(event) =>
              professorAdmin.updateFilter("careerId", event.target.value)
            }
          >
            <option value="">Todas las carreras</option>
            {professorAdmin.careers.map((career) => (
              <option key={getEntityId(career)} value={getEntityId(career)}>
                {career.name}
              </option>
            ))}
          </select>

          <select
            value={professorAdmin.filters.courseId}
            aria-label="Filtrar por curso"
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/10"
            onChange={(event) =>
              professorAdmin.updateFilter("courseId", event.target.value)
            }
          >
            <option value="">Todos los cursos</option>
            {courseFilterOptions.map((course) => (
              <option key={getEntityId(course)} value={getEntityId(course)}>
                {course.name}
              </option>
            ))}
          </select>

          <select
            value={professorAdmin.filters.sort}
            aria-label="Ordenar profesores"
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-upc-red focus:ring-4 focus:ring-upc-red/10"
            onChange={(event) =>
              professorAdmin.updateFilter("sort", event.target.value)
            }
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {hasActiveFilters ? (
            <button
              type="button"
              aria-label="Limpiar filtros"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-3 text-sm font-semibold text-zinc-600 outline-none hover:bg-zinc-50 focus-visible:ring-4 focus-visible:ring-upc-red/15"
              onClick={professorAdmin.clearFilters}
            >
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
              Limpiar
            </button>
          ) : null}
        </div>

        {professorAdmin.optionsError ? (
          <p className="mt-3 text-xs text-amber-700">
            {professorAdmin.optionsError} Los filtros y formularios podrían no
            tener todas las opciones.
          </p>
        ) : null}

        <div className="mt-5">
          <AnimatePresence mode="wait" initial={false}>
            {professorAdmin.isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProfessorSkeleton />
              </motion.div>
            ) : professorAdmin.loadError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/40 px-6 text-center"
              >
                <AlertCircle
                  aria-hidden="true"
                  className="h-8 w-8 text-red-500"
                />
                <h2 className="mt-3 font-display text-lg font-bold text-zinc-900">
                  No pudimos cargar los profesores
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
                  {professorAdmin.loadError}
                </p>
                <button
                  type="button"
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700"
                  onClick={professorAdmin.reload}
                >
                  <RefreshCw aria-hidden="true" className="h-4 w-4" />
                  Reintentar
                </button>
              </motion.div>
            ) : professorAdmin.professors.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 text-center"
              >
                <UserRoundX
                  aria-hidden="true"
                  className="h-8 w-8 text-zinc-400"
                />
                <h2 className="mt-3 font-display text-lg font-bold text-zinc-900">
                  {hasActiveFilters
                    ? "No hay coincidencias"
                    : "No hay profesores registrados"}
                </h2>
                <p className="mt-2 text-sm text-zinc-500">
                  {hasActiveFilters
                    ? "Prueba con otros filtros o limpia la búsqueda."
                    : "Agrega el primer profesor para comenzar."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                className="space-y-3"
              >
                {professorAdmin.professors.map((professor) => (
                  <ProfessorCard
                    key={getEntityId(professor)}
                    professor={professor}
                    onView={openDetail}
                    onEdit={openEdit}
                    onDelete={(item) => {
                      setDeleteError("");
                      setDeleteProfessorTarget(item);
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* <ProfessorFormModal
        isOpen={isFormOpen}
        professor={formProfessor}
        campuses={professorAdmin.campuses}
        careers={professorAdmin.careers}
        courses={professorAdmin.courses}
        isLoadingOptions={professorAdmin.isLoadingOptions}
        optionsError={professorAdmin.optionsError}
        isSaving={professorAdmin.isSaving}
        onClose={() => {
          if (!professorAdmin.isSaving) {
            setIsFormOpen(false);
            setFormProfessor(null);
          }
        }}
        onCreate={professorAdmin.createItem}
        onUpdate={professorAdmin.updateItem}
      /> */}
      <ProfessorFormModal
        isOpen={isFormOpen}
        professor={formProfessor}
        campuses={professorAdmin.campuses}
        careers={professorAdmin.careers}
        courses={professorAdmin.courses}
        isLoadingOptions={professorAdmin.isLoadingOptions}
        optionsError={professorAdmin.optionsError}
        isSaving={professorAdmin.isSaving}
        onClose={() => {
          if (!professorAdmin.isSaving) {
            setIsFormOpen(false);
          }
        }}
        onCreate={professorAdmin.createItem}
        onUpdate={professorAdmin.updateItem}
      />

      <ProfessorDetailModal
        isOpen={isDetailOpen}
        professor={professorAdmin.detailProfessor}
        isLoading={professorAdmin.isLoadingDetail}
        error={professorAdmin.detailError}
        onClose={() => setIsDetailOpen(false)}
        onEdit={openEdit}
        onAddCampuses={(professor) => {
          setIsDetailOpen(false);
          setAddCampusesProfessor(professor);
        }}
      />

      <AddCampusesModal
        isOpen={Boolean(addCampusesProfessor)}
        professor={addCampusesProfessor}
        campuses={professorAdmin.campuses}
        isSaving={professorAdmin.isSaving}
        onClose={() => {
          if (!professorAdmin.isSaving) {
            setAddCampusesProfessor(null);
          }
        }}
        onSubmit={professorAdmin.addCampuses}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deleteProfessorTarget)}
        entityName="al profesor"
        itemName={deleteProfessorTarget?.fullName ?? ""}
        isDeleting={
          professorAdmin.deletingId === getEntityId(deleteProfessorTarget)
        }
        error={deleteError}
        onClose={() => {
          if (!professorAdmin.deletingId) {
            setDeleteProfessorTarget(null);
            setDeleteError("");
          }
        }}
        onConfirm={confirmDelete}
      />

      <OperationNotice
        notice={professorAdmin.notice}
        onClose={professorAdmin.clearNotice}
      />
    </div>
  );
}
