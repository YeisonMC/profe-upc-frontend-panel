import { httpClient } from "../../../services/httpClient.js";
import { RECOMMENDATION_API_PATHS } from "../config/recommendationConfig.js";

const getResponseData = (response) => response?.data?.data;

const getResponseMessage = (response, fallback) => {
  return response?.data?.message || fallback;
};

export const professorRecommendationService = {
  async list({ status, signal } = {}) {
    const params = {};

    if (status && status !== "all") {
      params.status = status;
    }

    const response = await httpClient.get(
      RECOMMENDATION_API_PATHS.recommendations,
      { params, signal },
    );

    const data = getResponseData(response);
    const items = Array.isArray(data) ? data : [];

    return {
      items,
      total:
        typeof response?.data?.total === "number"
          ? response.data.total
          : items.length,
    };
  },

  async getById(recommendationId, signal) {
    const response = await httpClient.get(
      `${RECOMMENDATION_API_PATHS.recommendations}/${recommendationId}`,
      { signal },
    );

    return getResponseData(response);
  },

  async update(recommendationId, payload) {
    const response = await httpClient.patch(
      `${RECOMMENDATION_API_PATHS.recommendations}/${recommendationId}`,
      payload,
    );

    return {
      data: getResponseData(response),
      message: getResponseMessage(
        response,
        "Recomendación actualizada correctamente.",
      ),
    };
  },

  async accept(recommendationId, payload) {
    const response = await httpClient.patch(
      `${RECOMMENDATION_API_PATHS.recommendations}/${recommendationId}/accept`,
      payload,
    );

    return {
      data: getResponseData(response),
      message: getResponseMessage(
        response,
        "Recomendación aceptada y profesor creado correctamente.",
      ),
    };
  },

  async reject(recommendationId, rejectionReason) {
    const response = await httpClient.patch(
      `${RECOMMENDATION_API_PATHS.recommendations}/${recommendationId}/reject`,
      { rejectionReason },
    );

    return {
      data: getResponseData(response),
      message: getResponseMessage(
        response,
        "Recomendación rechazada correctamente.",
      ),
    };
  },

  async remove(recommendationId) {
    const response = await httpClient.delete(
      `${RECOMMENDATION_API_PATHS.recommendations}/${recommendationId}`,
    );

    return {
      message: getResponseMessage(
        response,
        "Recomendación eliminada definitivamente.",
      ),
    };
  },
};
