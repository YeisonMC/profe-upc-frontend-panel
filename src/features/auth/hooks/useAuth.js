import { useContext } from "react";

import { AuthContext } from "../context/AuthContext.js";

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider.");
  }

  return authContext;
};
