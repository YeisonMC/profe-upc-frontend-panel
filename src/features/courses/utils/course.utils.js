export const getEntityId = (entity) => {
  if (typeof entity === "string") {
    return entity;
  }

  return entity?._id ?? entity?.id ?? "";
};

export const getEntityName = (entity, fallback = "Sin nombre") => {
  if (typeof entity === "string") {
    return entity;
  }

  return entity?.name?.trim?.() || entity?.title?.trim?.() || fallback;
};

export const getCourseCareerIds = (course) => {
  const careerValues = Array.isArray(course?.careerIds)
    ? course.careerIds
    : course?.careerId
      ? [course.careerId]
      : [];

  return [
    ...new Set(careerValues.map((career) => getEntityId(career)).filter(Boolean)),
  ];
};

export const getCourseCareerNames = (course) => {
  const careerValues = Array.isArray(course?.careerIds)
    ? course.careerIds
    : course?.careerId
      ? [course.careerId]
      : [];

  return [
    ...new Set(
      careerValues
        .map((career) => getEntityName(career, ""))
        .filter(Boolean),
    ),
  ];
};

export const courseBelongsToCareer = (course, careerId) => {
  const selectedCareerId = String(careerId ?? "");

  if (!selectedCareerId) {
    return false;
  }

  return getCourseCareerIds(course).some(
    (courseCareerId) => String(courseCareerId) === selectedCareerId,
  );
};

export const courseBelongsToAnyCareer = (course, selectedCareerIds = []) => {
  if (!Array.isArray(selectedCareerIds) || selectedCareerIds.length === 0) {
    return false;
  }

  const selectedSet = new Set(selectedCareerIds.map(String));

  return getCourseCareerIds(course).some((careerId) =>
    selectedSet.has(String(careerId)),
  );
};

export const formatCourseCareerSummary = (course, maxVisible = 1) => {
  const careerNames = getCourseCareerNames(course);

  if (careerNames.length === 0) {
    return "Carrera no disponible";
  }

  if (careerNames.length <= maxVisible) {
    return careerNames.join(", ");
  }

  return `${careerNames.slice(0, maxVisible).join(", ")} + ${
    careerNames.length - maxVisible
  } mas`;
};

export const formatCourseCareerList = (course) => {
  const careerNames = getCourseCareerNames(course);

  return careerNames.length > 0
    ? careerNames.join(", ")
    : "Carrera no disponible";
};
