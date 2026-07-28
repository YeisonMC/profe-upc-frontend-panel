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

// export const API_PATHS = Object.freeze({
//   campuses: normalizePath(
//     import.meta.env.VITE_CAMPUSES_PATH,
//     "/campuses",
//   ),

//   careers: normalizePath(
//     import.meta.env.VITE_CAREERS_PATH,
//     "/careers",
//   ),

//   courses: normalizePath(
//     import.meta.env.VITE_COURSES_PATH,
//     "/courses",
//   ),

//   professors: normalizePath(
//     import.meta.env.VITE_PROFESSORS_PATH,
//     "/professors",
//   ),
// });

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

export const API_PATHS = Object.freeze({
  campuses: normalizePath(import.meta.env.VITE_CAMPUSES_PATH, "/campuses"),

  careers: normalizePath(import.meta.env.VITE_CAREERS_PATH, "/careers"),

  courses: normalizePath(import.meta.env.VITE_COURSES_PATH, "/courses"),

  professors: normalizePath(
    import.meta.env.VITE_PROFESSORS_PATH,
    "/professors",
  ),
});
