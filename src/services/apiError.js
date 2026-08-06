const STATUS_FALLBACK_MESSAGES = {
  400: "Datos invalidos. Revisa la informacion enviada.",
  401: "Sesion no valida. Inicia sesion nuevamente.",
  403: "Acceso no autorizado o periodo cerrado.",
  404: "Entidad no encontrada o desactivada.",
  409: "Conflicto de relaciones, duplicados o elemento ya procesado.",
  422: "Datos invalidos. Revisa la informacion enviada.",
  429: "Demasiadas solicitudes. Espera un momento.",
};

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

  if (backendMessage) {
    return backendMessage;
  }

  if (STATUS_FALLBACK_MESSAGES[status]) {
    return STATUS_FALLBACK_MESSAGES[status];
  }

  if (status === 401) {
    return "Tu sesión venció o ya no es válida. Inicia sesión nuevamente.";
  }

  if (status === 403) {
    return "No tienes permisos para realizar esta operación.";
  }

  if (backendMessage) {
    return backendMessage;
  }

  if (STATUS_FALLBACK_MESSAGES[status]) {
    return STATUS_FALLBACK_MESSAGES[status];
  }

  if (status >= 500) {
    return "El servidor presentó un problema. Inténtalo nuevamente más tarde.";
  }

  if (!error?.response) {
    return "No se pudo conectar con el servidor. Verifica que el backend esté encendido.";
  }

  return fallbackMessage;
};
