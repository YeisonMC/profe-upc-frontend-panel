const SAFE_BACKEND_STATUSES = new Set([400, 404, 409, 422, 429]);

const getBackendMessage = (error) => {
  const message = error?.response?.data?.message;

  return typeof message === "string" && message.trim()
    ? message.trim()
    : "";
};

export const isCanceledRequest = (error) => {
  return error?.code === "ERR_CANCELED";
};

export const isUnauthorizedRequest = (error) => {
  return error?.response?.status === 401;
};

export const getApiErrorMessage = (
  error,
  fallbackMessage = "Ocurrió un problema. Inténtalo nuevamente.",
) => {
  if (error?.code === "API_RESPONSE_INVALID") {
    return "El servidor devolvió una respuesta inesperada.";
  }

  if (error?.code === "ECONNABORTED") {
    return "El servidor tardó demasiado en responder.";
  }

  const status = error?.response?.status;
  const backendMessage = getBackendMessage(error);

  if (status === 401) {
    return "Tu sesión venció o ya no es válida. Inicia sesión nuevamente.";
  }

  if (status === 403) {
    return "No tienes permisos para realizar esta operación.";
  }

  if (SAFE_BACKEND_STATUSES.has(status) && backendMessage) {
    return backendMessage;
  }

  if (status >= 500) {
    return "El servidor presentó un problema. Inténtalo nuevamente más tarde.";
  }

  if (!error?.response) {
    return "No se pudo conectar con el servidor. Verifica que el backend esté encendido.";
  }

  return fallbackMessage;
};
