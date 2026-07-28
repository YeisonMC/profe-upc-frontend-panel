export const getEntityId = (entity) => entity?._id ?? entity?.id ?? "";

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
  if (!course) {
    return "";
  }

  if (typeof course.careerId === "string") {
    return course.careerId;
  }

  return getEntityId(course.careerId);
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
