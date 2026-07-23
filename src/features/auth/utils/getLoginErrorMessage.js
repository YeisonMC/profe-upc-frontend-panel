export const getLoginErrorMessage = (error) => {
  if (error?.code === "API_URL_NOT_CONFIGURED") {
    return "La conexión con el servidor no está configurada correctamente.";
  }

  if (error?.code === "AUTH_RESPONSE_INVALID") {
    return "El servidor devolvió una respuesta inesperada. Inténtalo nuevamente.";
  }

  if (error?.code === "ECONNABORTED") {
    return "El servidor tardó demasiado en responder. Inténtalo nuevamente.";
  }

  const statusCode = error?.response?.status;

  if (statusCode === 400) {
    return "Revisa los datos ingresados e inténtalo nuevamente.";
  }

  if (statusCode === 401) {
    return "El correo o la contraseña son incorrectos.";
  }

  if (statusCode === 403) {
    return "Tu cuenta no tiene autorización para acceder al panel.";
  }

  if (statusCode === 429) {
    return "Has realizado demasiados intentos. Espera un momento antes de volver a intentarlo.";
  }

  if (statusCode >= 500) {
    return "El servidor presentó un problema. Inténtalo nuevamente más tarde.";
  }

  if (!error?.response) {
    return "No se pudo conectar con el servidor. Verifica que el backend esté encendido.";
  }

  return "Ocurrió un problema al iniciar sesión. Inténtalo nuevamente.";
};
