import { httpClient, isApiConfigured } from "../../../services/httpClient.js";

const rawLoginPath = import.meta.env.VITE_AUTH_LOGIN_PATH?.trim();

const LOGIN_PATH = rawLoginPath.startsWith("/")
  ? rawLoginPath
  : `/${rawLoginPath}`;

export const loginAdmin = async ({ email, password }) => {
  if (!isApiConfigured) {
    const configurationError = new Error(
      "La URL de la API no está configurada.",
    );

    configurationError.code = "API_URL_NOT_CONFIGURED";

    throw configurationError;
  }

  const response = await httpClient.post(LOGIN_PATH, {
    email,
    password,
  });

  const responseBody = response.data;

  const hasValidResponse =
    responseBody?.success === true &&
    typeof responseBody?.data?.token === "string" &&
    responseBody.data.token.length > 0 &&
    responseBody?.data?.admin;

  if (!hasValidResponse) {
    const invalidResponseError = new Error(
      "La respuesta de autenticación no tiene el formato esperado.",
    );

    invalidResponseError.code = "AUTH_RESPONSE_INVALID";

    throw invalidResponseError;
  }

  return {
    token: responseBody.data.token,
    admin: {
      id: responseBody.data.admin.id,
      fullName: responseBody.data.admin.fullName,
      email: responseBody.data.admin.email,
    },
  };
};
