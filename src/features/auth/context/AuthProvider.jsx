import { useCallback, useMemo, useState } from "react";

import { loginAdmin } from "../services/auth.service.js";
import {
  clearStoredSession,
  getStoredSession,
  saveStoredSession,
} from "../utils/authStorage.js";
import { AuthContext } from "./AuthContext.js";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());

  const signIn = useCallback(async (credentials, rememberSession) => {
    const authenticationResult = await loginAdmin(credentials);

    const nextSession = {
      token: authenticationResult.token,
      admin: authenticationResult.admin,
    };

    saveStoredSession(nextSession, rememberSession);
    setSession(nextSession);

    return nextSession;
  }, []);

  const signOut = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      session,
      admin: session?.admin ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token && session?.admin),
      signIn,
      signOut,
    }),
    [session, signIn, signOut],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
