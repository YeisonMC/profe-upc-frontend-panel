import {
  MessageSquareText,
  ThumbsUp,
} from "lucide-react";

const normalizePath = (value, fallback) => {
  const selectedValue = value?.trim() || fallback;

  return selectedValue.startsWith("/")
    ? selectedValue.replace(/\/+$/, "")
    : `/${selectedValue.replace(/\/+$/, "")}`;
};

export const PERIOD_TYPE_IDS = Object.freeze({
  recommendation: "recommendation",
  review: "review",
});

export const DEFAULT_PERIOD_TYPE = PERIOD_TYPE_IDS.recommendation;

export const PERIOD_TYPES = Object.freeze({
  [PERIOD_TYPE_IDS.recommendation]: {
    id: PERIOD_TYPE_IDS.recommendation,
    label: "Recomendaciones de profesores",
    shortLabel: "Recomendaciones",
    singularLabel: "período de recomendaciones",
    description:
      "Ventana en la que los estudiantes pueden recomendar nuevos docentes.",
    icon: ThumbsUp,
    basePath: normalizePath(
      import.meta.env.VITE_RECOMMENDATION_PERIODS_PATH,
      "/recommendation-periods",
    ),
    blocksCreationWhileEnabled: true,
    creationBlockedMessage:
      "Cierra el período activo o programado antes de crear uno nuevo.",
  },

  [PERIOD_TYPE_IDS.review]: {
    id: PERIOD_TYPE_IDS.review,
    label: "Comentarios",
    shortLabel: "Comentarios",
    singularLabel: "período de comentarios",
    description:
      "Ventana en la que se pueden enviar comentarios y evaluaciones.",
    icon: MessageSquareText,
    basePath: normalizePath(
      import.meta.env.VITE_REVIEW_PERIODS_PATH,
      "/review-periods",
    ),
    blocksCreationWhileEnabled: false,
    creationBlockedMessage: "",
  },
});

export const getPeriodTypeConfig = (typeId) => {
  const config = PERIOD_TYPES[typeId];

  if (!config) {
    throw new Error(`Tipo de período no reconocido: ${typeId}`);
  }

  return config;
};
