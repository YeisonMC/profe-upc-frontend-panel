import { Navigate, Route, Routes } from "react-router-dom";

import { ROUTES } from "../config/routePaths.js";
import { AdminNotFoundPage } from "../../components/pages/AdminNotFoundPage.jsx";
import { TemporaryPage } from "../../components/pages/TemporaryPage.jsx";
import { LoginPage } from "../../features/auth/pages/LoginPage.jsx";
import { SummaryPage } from "../../features/dashboard/pages/SummaryPage.jsx";
import { AdminLayout } from "../../layouts/AdminLayout.jsx";
import { AuthLayout } from "../../layouts/AuthLayout.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { PublicOnlyRoute } from "./PublicOnlyRoute.jsx";

export function AppRouter() {
  return (
    <Routes>
      <Route
        path={ROUTES.root}
        element={<Navigate to={ROUTES.login} replace />}
      />

      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path={ROUTES.admin}
            element={<Navigate to={ROUTES.summary} replace />}
          />

          <Route path={ROUTES.summary} element={<SummaryPage />} />

          <Route
            path={ROUTES.comments}
            element={<TemporaryPage title="Comentarios" />}
          />

          <Route
            path={ROUTES.recommendations}
            element={<TemporaryPage title="Recomendaciones" />}
          />

          <Route
            path={ROUTES.opinions}
            element={<TemporaryPage title="Opiniones" />}
          />

          <Route
            path={ROUTES.periods}
            element={<TemporaryPage title="Periodos" />}
          />

          <Route
            path={ROUTES.newEvaluation}
            element={
              <TemporaryPage
                title="Registrar evaluación"
                description="Aquí se implementará posteriormente el registro de evaluaciones."
              />
            }
          />

          <Route
            path={ROUTES.newCampus}
            element={
              <TemporaryPage
                title="Agregar sede"
                description="Aquí se implementará posteriormente la administración de sedes."
              />
            }
          />

          <Route
            path={ROUTES.newCareer}
            element={
              <TemporaryPage
                title="Agregar carrera"
                description="Aquí se implementará posteriormente la administración de carreras."
              />
            }
          />

          <Route
            path={ROUTES.newCourse}
            element={
              <TemporaryPage
                title="Agregar curso"
                description="Aquí se implementará posteriormente la administración de cursos."
              />
            }
          />

          <Route path={`${ROUTES.admin}/*`} element={<AdminNotFoundPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.root} replace />} />
    </Routes>
  );
}
