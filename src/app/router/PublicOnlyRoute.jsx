import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "../config/routePaths.js";
import { useAuth } from "../../features/auth/hooks/useAuth.js";

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.summary} replace />;
  }

  return <Outlet />;
}
