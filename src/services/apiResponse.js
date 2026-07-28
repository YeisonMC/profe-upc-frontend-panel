const createInvalidResponseError = (resourceName) => {
  const error = new Error(
    `La respuesta de ${resourceName} no tiene el formato esperado.`,
  );

  error.code = "API_RESPONSE_INVALID";

  return error;
};

export const unwrapListResponse = (response, resourceName) => {
  const body = response?.data;

  if (body?.success !== true || !Array.isArray(body?.data)) {
    throw createInvalidResponseError(resourceName);
  }

  return {
    data: body.data,
    total:
      typeof body.total === "number"
        ? body.total
        : body.data.length,
    message: typeof body.message === "string" ? body.message : "",
  };
};

export const unwrapEntityResponse = (response, resourceName) => {
  const body = response?.data;

  if (
    body?.success !== true ||
    !body?.data ||
    typeof body.data !== "object"
  ) {
    throw createInvalidResponseError(resourceName);
  }

  return {
    data: body.data,
    message: typeof body.message === "string" ? body.message : "",
  };
};
