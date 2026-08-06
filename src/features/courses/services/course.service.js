import { API_PATHS } from "../../../app/config/apiPaths.js";
import { httpClient } from "../../../services/httpClient.js";
import {
  unwrapEntityResponse,
  unwrapListResponse,
} from "../../../services/apiResponse.js";

export const getCourses = async ({ careerId, signal } = {}) => {
  const response = await httpClient.get(API_PATHS.courses, {
    params: careerId ? { careerId } : undefined,
    signal,
  });

  return unwrapListResponse(response, "cursos");
};

export const createCourse = async ({ name, code, careerIds }) => {
  const response = await httpClient.post(API_PATHS.courses, {
    name,
    code,
    careerIds,
  });

  return unwrapEntityResponse(response, "el curso");
};

export const updateCourse = async (courseId, payload) => {
  const response = await httpClient.patch(
    `${API_PATHS.courses}/${courseId}`,
    payload,
  );

  return unwrapEntityResponse(response, "el curso");
};

export const deleteCourse = async (courseId) => {
  const response = await httpClient.delete(
    `${API_PATHS.courses}/${courseId}`,
  );

  return unwrapEntityResponse(response, "el curso");
};
