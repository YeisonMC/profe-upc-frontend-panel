import {
  BookOpen,
  Building2,
  Eye,
  GraduationCap,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  getEntityId,
  getProfessorInitials,
  getRelationName,
} from "../utils/professor.utils.js";

function RelationGroup({ icon: Icon, label, items, tone }) {
  const toneClasses = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    red: "border-red-200 bg-red-50 text-red-700",
    zinc: "border-zinc-200 bg-zinc-100 text-zinc-700",
  };

  const visibleItems = items.slice(0, 3);
  const hiddenCount = items.length - visibleItems.length;

  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-zinc-500">
        <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.7} />
        {label}
      </div>

      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => (
            <span
              key={getEntityId(item) || getRelationName(item)}
              className={`rounded-full border px-2 py-1 text-[10px] leading-none ${toneClasses[tone]}`}
            >
              {getRelationName(item)}
            </span>
          ))
        ) : (
          <span className="text-[11px] text-zinc-400">Sin asignaciones</span>
        )}

        {hiddenCount > 0 ? (
          <span className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-[10px] leading-none text-zinc-600">
            +{hiddenCount}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function ProfessorCard({ professor, onView, onEdit, onDelete }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className="rounded-[15px] border border-zinc-200 bg-white p-4 shadow-[0_3px_12px_rgba(0,0,0,0.035)] sm:p-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 font-display text-sm font-bold text-upc-red">
            {getProfessorInitials(professor.fullName)}
          </div>

          <div className="min-w-0">
            <h2 className="font-display text-[16px] font-bold tracking-[-0.025em] text-zinc-950">
              {professor.fullName}
            </h2>
            <p className="mt-1 overflow-hidden text-sm leading-5 text-zinc-500 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
              {professor.bio?.trim() || "Sin biografía"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end lg:self-start">
          <button
            type="button"
            aria-label={`Ver detalle de ${professor.fullName}`}
            className="flex h-9 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 outline-none transition-colors hover:bg-zinc-50 focus-visible:ring-4 focus-visible:ring-upc-red/15"
            onClick={() => onView(professor)}
          >
            <Eye aria-hidden="true" className="h-4 w-4" />
            <span className="hidden sm:inline">Ver</span>
          </button>

          <button
            type="button"
            aria-label={`Editar ${professor.fullName}`}
            className="flex h-9 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 outline-none transition-colors hover:bg-zinc-50 focus-visible:ring-4 focus-visible:ring-upc-red/15"
            onClick={() => onEdit(professor)}
          >
            <Pencil aria-hidden="true" className="h-4 w-4" />
            <span className="hidden sm:inline">Editar</span>
          </button>

          <button
            type="button"
            aria-label={`Eliminar ${professor.fullName}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 outline-none transition-colors hover:bg-red-50 focus-visible:ring-4 focus-visible:ring-red-500/15"
            onClick={() => onDelete(professor)}
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 border-t border-zinc-100 pt-4 md:grid-cols-3">
        <RelationGroup
          icon={Building2}
          label="Sedes"
          items={professor.campusIds ?? []}
          tone="blue"
        />
        <RelationGroup
          icon={GraduationCap}
          label="Carreras"
          items={professor.careerIds ?? []}
          tone="red"
        />
        <RelationGroup
          icon={BookOpen}
          label="Cursos"
          items={professor.courseIds ?? []}
          tone="zinc"
        />
      </div>
    </motion.article>
  );
}
