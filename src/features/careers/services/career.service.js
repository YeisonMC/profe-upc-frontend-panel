import { API_PATHS } from "../../../app/config/apiPaths.js";
import { httpClient } from "../../../services/httpClient.js";
import {
  unwrapEntityResponse,
  unwrapListResponse,
} from "../../../services/apiResponse.js";

export const getCareers = async ({ signal } = {}) => {
  const response = await httpClient.get(API_PATHS.careers, {
    signal,
  });

  return unwrapListResponse(response, "carreras");
};

export const createCareer = async ({ name }) => {
  const response = await httpClient.post(API_PATHS.careers, {
    name,
  });

  return unwrapEntityResponse(response, "la carrera");
};

export const updateCareer = async (careerId, payload) => {
  const response = await httpClient.patch(
    `${API_PATHS.careers}/${careerId}`,
    payload,
  );

  return unwrapEntityResponse(response, "la carrera");
};

export const deleteCareer = async (careerId) => {
  const response = await httpClient.delete(
    `${API_PATHS.careers}/${careerId}`,
  );

  return unwrapEntityResponse(response, "la carrera");
};
