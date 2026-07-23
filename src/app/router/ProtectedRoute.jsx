import { Navigate, Outlet, useLocation } from "react-router-dom";

import { ROUTES } from "../config/routePaths.js";
import { useAuth } from "../../features/auth/hooks/useAuth.js";

export function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.login}
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}
