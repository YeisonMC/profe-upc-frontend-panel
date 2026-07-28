import { API_PATHS } from "../../../app/config/apiPaths.js";
import { httpClient } from "../../../services/httpClient.js";
import {
  unwrapEntityResponse,
  unwrapListResponse,
} from "../../../services/apiResponse.js";

export const getCampuses = async ({ signal } = {}) => {
  const response = await httpClient.get(API_PATHS.campuses, {
    signal,
  });

  return unwrapListResponse(response, "sedes");
};

export const createCampus = async ({ name }) => {
  const response = await httpClient.post(API_PATHS.campuses, {
    name,
  });

  return unwrapEntityResponse(response, "la sede");
};
