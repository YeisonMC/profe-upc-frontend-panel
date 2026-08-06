import {
  courseBelongsToAnyCareer,
  courseBelongsToCareer,
  getCourseCareerIds,
} from "../../courses/utils/course.utils.js";

export {
  courseBelongsToAnyCareer,
  courseBelongsToCareer,
  getCourseCareerIds,
};

export const getEntityId = (entity) => {
  if (typeof entity === "string") {
    return entity;
  }

  return entity?._id ?? entity?.id ?? "";
};

export const getRelationName = (entity) => {
  if (typeof entity === "string") {
    return entity;
  }

  return entity?.name?.trim() || "Sin nombre";
};

export const getProfessorInitials = (fullName = "") => {
  const words = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "PR";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

export const getRelationIds = (relations = []) => {
  return relations.map(getEntityId).filter(Boolean);
};

export const areSameIdArrays = (firstIds = [], secondIds = []) => {
  if (firstIds.length !== secondIds.length) {
    return false;
  }

  const normalizedFirst = [...firstIds].map(String).sort();
  const normalizedSecond = [...secondIds].map(String).sort();

  return normalizedFirst.every(
    (value, index) => value === normalizedSecond[index],
  );
};

export const getCourseCareerId = (course) => {
  return getCourseCareerIds(course)[0] ?? "";
};

export const validateProfessorAcademicRelations = ({
  selectedCareerIds,
  selectedCourseIds,
  courses,
}) => {
  const careerSet = new Set((selectedCareerIds ?? []).map(String));
  const courseSet = new Set((selectedCourseIds ?? []).map(String));
  const selectedCourses = (courses ?? []).filter((course) =>
    courseSet.has(String(getEntityId(course))),
  );

  const missingCourseId = (selectedCourseIds ?? []).find(
    (courseId) =>
      !selectedCourses.some(
        (course) => String(getEntityId(course)) === String(courseId),
      ),
  );

  if (missingCourseId) {
    return {
      valid: false,
      message: "Uno de los cursos seleccionados ya no esta disponible.",
    };
  }

  const invalidCourse = selectedCourses.find((course) => {
    return !getCourseCareerIds(course).some((careerId) =>
      careerSet.has(String(careerId)),
    );
  });

  if (invalidCourse) {
    return {
      valid: false,
      message: `El curso "${invalidCourse.name}" no pertenece a ninguna de las carreras seleccionadas.`,
    };
  }

  const coveredCareerIds = new Set();

  selectedCourses.forEach((course) => {
    getCourseCareerIds(course).forEach((careerId) => {
      if (careerSet.has(String(careerId))) {
        coveredCareerIds.add(String(careerId));
      }
    });
  });

  const uncoveredCareerId = (selectedCareerIds ?? []).find(
    (careerId) => !coveredCareerIds.has(String(careerId)),
  );

  if (uncoveredCareerId) {
    return {
      valid: false,
      message:
        "Cada carrera seleccionada debe estar relacionada con al menos uno de los cursos elegidos.",
    };
  }

  return {
    valid: true,
    message: "",
  };
};

export const sortProfessorsByName = (professors = []) => {
  return [...professors].sort((firstProfessor, secondProfessor) =>
    String(firstProfessor?.fullName ?? "").localeCompare(
      String(secondProfessor?.fullName ?? ""),
      "es",
      { sensitivity: "base" },
    ),
  );
};

export const replaceProfessorInList = (
  professors,
  updatedProfessor,
) => {
  const updatedId = getEntityId(updatedProfessor);

  return professors.map((professor) =>
    getEntityId(professor) === updatedId ? updatedProfessor : professor,
  );
};
