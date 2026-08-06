import { RECOMMENDATION_STATUS } from "../config/recommendationConfig.js";
import {
  courseBelongsToCareer,
  getCourseCareerIds,
} from "../../courses/utils/course.utils.js";

export {
  courseBelongsToCareer,
  getCourseCareerIds,
};

export const getEntityId = (entity) => {
  if (typeof entity === "string") {
    return entity;
  }

  return entity?._id ?? entity?.id ?? "";
};

export const getEntityName = (entity, fallback = "Sin información") => {
  if (typeof entity === "string") {
    return entity;
  }

  return entity?.name ?? entity?.title ?? fallback;
};

export const getRecommendationFullName = (recommendation) => {
  return [
    recommendation?.firstName,
    recommendation?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
};

export const getInitials = (recommendation) => {
  const initials = [
    recommendation?.firstName,
    recommendation?.lastName,
  ]
    .filter(Boolean)
    .map((value) => value.trim().charAt(0).toUpperCase())
    .join("");

  return initials || "PR";
};

export const formatRecommendationDate = (dateValue) => {
  if (!dateValue) {
    return "Sin fecha";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no válida";
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export const normalizeSearchText = (value) => {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

export const matchesRecommendationSearch = (
  recommendation,
  searchValue,
) => {
  const normalizedSearch = normalizeSearchText(searchValue);

  if (!normalizedSearch) {
    return true;
  }

  const values = [
    getRecommendationFullName(recommendation),
    recommendation?.courseName,
    getEntityName(recommendation?.careerId, ""),
    ...(recommendation?.campusIds ?? []).map((campus) =>
      getEntityName(campus, ""),
    ),
    getEntityName(recommendation?.recommendationPeriodId, ""),
  ];

  return values.some((value) =>
    normalizeSearchText(value).includes(normalizedSearch),
  );
};

export const getRecommendationStatusConfig = (status) => {
  const configurations = {
    [RECOMMENDATION_STATUS.pending]: {
      label: "Pendiente",
      classes: "border-amber-300 bg-amber-50 text-amber-700",
    },
    [RECOMMENDATION_STATUS.reviewed]: {
      label: "Revisada",
      classes: "border-emerald-300 bg-emerald-50 text-emerald-700",
    },
    [RECOMMENDATION_STATUS.rejected]: {
      label: "Rechazada",
      classes: "border-red-300 bg-red-50 text-red-700",
    },
  };

  return (
    configurations[status] ?? {
      label: "Sin estado",
      classes: "border-zinc-300 bg-zinc-100 text-zinc-600",
    }
  );
};

export const getRecommendationCounts = (recommendations) => {
  return recommendations.reduce(
    (counts, recommendation) => {
      counts.all += 1;

      if (recommendation?.status in counts) {
        counts[recommendation.status] += 1;
      }

      return counts;
    },
    {
      all: 0,
      pending: 0,
      reviewed: 0,
      rejected: 0,
    },
  );
};

export const getRelationIds = (relations) => {
  return (relations ?? []).map(getEntityId).filter(Boolean);
};

export const areSameIdArrays = (firstIds, secondIds) => {
  const first = [...firstIds].sort();
  const second = [...secondIds].sort();

  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
};

export const getCourseCareerId = (course) => {
  return getCourseCareerIds(course)[0] ?? "";
};
