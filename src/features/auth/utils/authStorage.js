const SESSION_STORAGE_KEY = "profe-upc-admin-session";

const isBrowser = () => typeof window !== "undefined";

const decodeJwtPayload = (token) => {
  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");

    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "=",
    );

    return JSON.parse(window.atob(paddedPayload));
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);

  if (!payload || typeof payload.exp !== "number") {
    return true;
  }

  return Date.now() >= payload.exp * 1000;
};

const readSessionFromStorage = (storage) => {
  try {
    const rawSession = storage.getItem(SESSION_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    const session = JSON.parse(rawSession);

    const hasRequiredData =
      typeof session?.token === "string" &&
      session.token.length > 0 &&
      session?.admin &&
      typeof session.admin === "object";

    if (!hasRequiredData || isTokenExpired(session.token)) {
      storage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    return session;
  } catch {
    storage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

export const getStoredSession = () => {
  if (!isBrowser()) {
    return null;
  }

  return (
    readSessionFromStorage(window.localStorage) ??
    readSessionFromStorage(window.sessionStorage)
  );
};

export const getStoredToken = () => {
  return getStoredSession()?.token ?? null;
};

export const saveStoredSession = (session, rememberSession) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);

  const selectedStorage = rememberSession
    ? window.localStorage
    : window.sessionStorage;

  selectedStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredSession = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
};
