import { Navigate, Route, Routes } from "react-router-dom";

import { ROUTES } from "../config/routePaths.js";
import { AdminNotFoundPage } from "../../components/pages/AdminNotFoundPage.jsx";
import { TemporaryPage } from "../../components/pages/TemporaryPage.jsx";
import { CareersPage } from "../../features/careers/pages/CareersPage.jsx";
import { CampusesPage } from "../../features/campuses/pages/CampusesPage.jsx";
import { CoursesPage } from "../../features/courses/pages/CoursesPage.jsx";
import { LoginPage } from "../../features/auth/pages/LoginPage.jsx";
import { ProfessorsPage } from "../../features/professors/pages/ProfessorsPage.jsx";
import { SummaryPage } from "../../features/dashboard/pages/SummaryPage.jsx";
import { AdminLayout } from "../../layouts/AdminLayout.jsx";
import { AuthLayout } from "../../layouts/AuthLayout.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { PublicOnlyRoute } from "./PublicOnlyRoute.jsx";
import { PeriodsPage } from "../../features/periods/pages/PeriodsPage.jsx";
import { RecommendationsPage } from "../../features/recommendations/pages/RecommendationsPage.jsx";

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
            element={<RecommendationsPage />}
          />
          <Route
            path={ROUTES.opinions}
            element={<TemporaryPage title="Opiniones" />}
          />
          <Route path={ROUTES.periods} element={<PeriodsPage />} />
          <Route path={ROUTES.professors} element={<ProfessorsPage />} />

          <Route path={ROUTES.courses} element={<CoursesPage />} />
          <Route path={ROUTES.careers} element={<CareersPage />} />
          <Route path={ROUTES.campuses} element={<CampusesPage />} />

          <Route
            path={ROUTES.newEvaluation}
            element={<TemporaryPage title="Registrar evaluación" />}
          />
          <Route
            path={ROUTES.newCampus}
            element={<CampusesPage openCreateOnMount />}
          />
          <Route
            path={ROUTES.newCareer}
            element={<CareersPage openCreateOnMount />}
          />
          <Route
            path={ROUTES.newCourse}
            element={<CoursesPage openCreateOnMount />}
          />

          <Route path={`${ROUTES.admin}/*`} element={<AdminNotFoundPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.root} replace />} />
    </Routes>
  );
}
