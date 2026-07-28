import { httpClient } from "../../../services/httpClient.js";
import { getPeriodTypeConfig } from "../config/periodTypes.js";

const getResponseMessage = (response, fallback) => {
  return response?.data?.message || fallback;
};

const getResponseData = (response) => {
  return response?.data?.data;
};

const getBasePath = (typeId) => {
  return getPeriodTypeConfig(typeId).basePath;
};

export const periodsService = {
  async list(typeId, signal) {
    const response = await httpClient.get(getBasePath(typeId), {
      signal,
    });

    const data = getResponseData(response);

    return {
      total:
        typeof response?.data?.total === "number"
          ? response.data.total
          : Array.isArray(data)
            ? data.length
            : 0,
      items: Array.isArray(data) ? data : [],
    };
  },

  async getActive(typeId, signal) {
    const response = await httpClient.get(
      `${getBasePath(typeId)}/active`,
      {
        signal,
      },
    );

    return getResponseData(response) ?? null;
  },

  async getById(typeId, periodId, signal) {
    const response = await httpClient.get(
      `${getBasePath(typeId)}/${periodId}`,
      {
        signal,
      },
    );

    return getResponseData(response);
  },

  async create(typeId, payload) {
    const response = await httpClient.post(
      getBasePath(typeId),
      payload,
    );

    return {
      data: getResponseData(response),
      message: getResponseMessage(
        response,
        "Período creado correctamente.",
      ),
    };
  },

  async update(typeId, periodId, payload) {
    const response = await httpClient.patch(
      `${getBasePath(typeId)}/${periodId}`,
      payload,
    );

    return {
      data: getResponseData(response),
      message: getResponseMessage(
        response,
        "Período actualizado correctamente.",
      ),
    };
  },

  async close(typeId, periodId) {
    const response = await httpClient.patch(
      `${getBasePath(typeId)}/${periodId}/close`,
    );

    return {
      data: getResponseData(response),
      message: getResponseMessage(
        response,
        "Período cerrado correctamente.",
      ),
    };
  },

  async remove(typeId, periodId) {
    const response = await httpClient.delete(
      `${getBasePath(typeId)}/${periodId}`,
    );

    return {
      message: getResponseMessage(
        response,
        "Período eliminado correctamente.",
      ),
    };
  },
};
