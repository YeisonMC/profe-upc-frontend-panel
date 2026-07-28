import { httpClient } from "../../../services/httpClient.js";
import { RECOMMENDATION_API_PATHS } from "../config/recommendationConfig.js";

const getCollection = (response) => {
  const data = response?.data?.data;

  return Array.isArray(data) ? data : [];
};

export const recommendationReferenceService = {
  async listCareers(signal) {
    const response = await httpClient.get(
      RECOMMENDATION_API_PATHS.careers,
      { signal },
    );

    return getCollection(response);
  },

  async listCampuses(signal) {
    const response = await httpClient.get(
      RECOMMENDATION_API_PATHS.campuses,
      { signal },
    );

    return getCollection(response);
  },

  async listCoursesByCareer(careerId, signal) {
    if (!careerId) {
      return [];
    }

    const response = await httpClient.get(
      RECOMMENDATION_API_PATHS.courses,
      {
        params: { careerId },
        signal,
      },
    );

    return getCollection(response);
  },
};
