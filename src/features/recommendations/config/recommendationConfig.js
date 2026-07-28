// const normalizePath = (
//   value,
//   fallback = "",
// ) => {
//   const selectedValue = String(
//     value ?? fallback ?? "",
//   ).trim();

//   if (!selectedValue) {
//     return "";
//   }

//   const withoutTrailingSlash =
//     selectedValue.replace(/\/+$/, "");

//   return withoutTrailingSlash.startsWith("/")
//     ? withoutTrailingSlash
//     : `/${withoutTrailingSlash}`;
// };

// export const RECOMMENDATION_STATUS =
//   Object.freeze({
//     all: "all",
//     pending: "pending",
//     reviewed: "reviewed",
//     rejected: "rejected",
//   });

// export const RECOMMENDATION_STATUS_OPTIONS =
//   Object.freeze([
//     {
//       value: RECOMMENDATION_STATUS.all,
//       label: "Todas",
//     },
//     {
//       value: RECOMMENDATION_STATUS.pending,
//       label: "Pendientes",
//     },
//     {
//       value: RECOMMENDATION_STATUS.reviewed,
//       label: "Revisadas",
//     },
//     {
//       value: RECOMMENDATION_STATUS.rejected,
//       label: "Rechazadas",
//     },
//   ]);

// export const RECOMMENDATION_API_PATHS =
//   Object.freeze({
//     recommendations: normalizePath(
//       import.meta.env
//         .VITE_PROFESSOR_RECOMMENDATIONS_PATH,
//       "/professor-recommendations",
//     ),

//     careers: normalizePath(
//       import.meta.env.VITE_CAREERS_PATH,
//       "/careers",
//     ),

//     campuses: normalizePath(
//       import.meta.env.VITE_CAMPUSES_PATH,
//       "/campuses",
//     ),

//     courses: normalizePath(
//       import.meta.env.VITE_COURSES_PATH,
//       "/courses",
//     ),
//   });

const normalizePath = (value, fallback = "") => {
  const selectedValue = String(value ?? fallback ?? "").trim();

  if (!selectedValue) {
    return "";
  }

  const withoutTrailingSlash = selectedValue.replace(/\/+$/, "");

  return withoutTrailingSlash.startsWith("/")
    ? withoutTrailingSlash
    : `/${withoutTrailingSlash}`;
};

export const RECOMMENDATION_STATUS = Object.freeze({
  all: "all",
  pending: "pending",
  reviewed: "reviewed",
  rejected: "rejected",
});

export const RECOMMENDATION_STATUS_OPTIONS = Object.freeze([
  {
    value: RECOMMENDATION_STATUS.all,
    label: "Todas",
  },
  {
    value: RECOMMENDATION_STATUS.pending,
    label: "Pendientes",
  },
  {
    value: RECOMMENDATION_STATUS.reviewed,
    label: "Revisadas",
  },
  {
    value: RECOMMENDATION_STATUS.rejected,
    label: "Rechazadas",
  },
]);

export const RECOMMENDATION_API_PATHS = Object.freeze({
  recommendations: normalizePath(
    import.meta.env.VITE_PROFESSOR_RECOMMENDATIONS_PATH,
    "/professor-recommendations",
  ),

  careers: normalizePath(import.meta.env.VITE_CAREERS_PATH, "/careers"),

  campuses: normalizePath(import.meta.env.VITE_CAMPUSES_PATH, "/campuses"),

  courses: normalizePath(import.meta.env.VITE_COURSES_PATH, "/courses"),
});
