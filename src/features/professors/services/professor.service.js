import { API_PATHS } from "../../../app/config/apiPaths.js";
import { httpClient } from "../../../services/httpClient.js";
import {
  unwrapEntityResponse,
  unwrapListResponse,
} from "../../../services/apiResponse.js";

const buildProfessorParams = ({
  search,
  campusId,
  careerId,
  courseId,
  sort,
} = {}) => {
  const params = {};

  if (search?.trim()) {
    params.search = search.trim();
  }

  if (campusId) {
    params.campusId = campusId;
  }

  if (careerId) {
    params.careerId = careerId;
  }

  if (courseId) {
    params.courseId = courseId;
  }

  if (sort) {
    params.sort = sort;
  }

  return Object.keys(params).length > 0 ? params : undefined;
};

export const getProfessors = async ({ signal, ...filters } = {}) => {
  const response = await httpClient.get(API_PATHS.professors, {
    params: buildProfessorParams(filters),
    signal,
  });

  return unwrapListResponse(response, "profesores");
};

export const getProfessorBySlug = async (slug, { signal } = {}) => {
  const response = await httpClient.get(
    `${API_PATHS.professors}/${encodeURIComponent(slug)}`,
    { signal },
  );

  return unwrapEntityResponse(response, "el profesor");
};

export const createProfessor = async (payload) => {
  const response = await httpClient.post(API_PATHS.professors, payload);

  return unwrapEntityResponse(response, "el profesor");
};

export const updateProfessor = async (professorId, payload) => {
  const response = await httpClient.patch(
    `${API_PATHS.professors}/${professorId}`,
    payload,
  );

  return unwrapEntityResponse(response, "el profesor");
};

export const addProfessorCampuses = async (professorId, campusIds) => {
  const response = await httpClient.patch(
    `${API_PATHS.professors}/${professorId}/campuses`,
    { campusIds },
  );

  return unwrapEntityResponse(response, "el profesor");
};

export const deleteProfessor = async (professorId) => {
  const response = await httpClient.delete(
    `${API_PATHS.professors}/${professorId}`,
  );

  return unwrapEntityResponse(response, "el profesor");
};
