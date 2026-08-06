import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../../app/config/routePaths.js";
import { getApiErrorMessage, isCanceledRequest, isUnauthorizedRequest } from "../../../services/apiError.js";
import { getCampuses } from "../../campuses/services/campus.service.js";
import { getCareers } from "../../careers/services/career.service.js";
import { getCourses } from "../../courses/services/course.service.js";
import { useAuth } from "../../auth/hooks/useAuth.js";
import {
  addProfessorCampuses,
  createProfessor,
  deleteProfessor,
  getProfessorBySlug,
  getProfessors,
  updateProfessor,
} from "../services/professor.service.js";
import {
  courseBelongsToCareer,
  getEntityId,
  replaceProfessorInList,
  sortProfessorsByName,
} from "../utils/professor.utils.js";

const INITIAL_FILTERS = {
  search: "",
  campusId: "",
  careerId: "",
  courseId: "",
  sort: "",
};

export function useProfessorAdmin() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [professors, setProfessors] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [campuses, setCampuses] = useState([]);
  const [careers, setCareers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState(null);

  const [detailProfessor, setDetailProfessor] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  const handleUnauthorized = useCallback(
    (error) => {
      if (!isUnauthorizedRequest(error)) {
        return false;
      }

      signOut();
      navigate(ROUTES.login, { replace: true });
      return true;
    },
    [navigate, signOut],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(filters.search.trim());
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [filters.search]);

  const loadOptions = useCallback(async ({ signal } = {}) => {
    setIsLoadingOptions(true);
    setOptionsError("");

    try {
      const [campusesResult, careersResult, coursesResult] = await Promise.all([
        getCampuses({ signal }),
        getCareers({ signal }),
        getCourses({ signal }),
      ]);

      setCampuses(campusesResult.data);
      setCareers(careersResult.data);
      setCourses(coursesResult.data);
    } catch (error) {
      if (isCanceledRequest(error)) {
        return;
      }

      if (!handleUnauthorized(error)) {
        setOptionsError(
          getApiErrorMessage(
            error,
            "No se pudieron cargar sedes, carreras y cursos.",
          ),
        );
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoadingOptions(false);
      }
    }
  }, [handleUnauthorized]);

  const loadProfessors = useCallback(async ({ signal } = {}) => {
    setIsLoading(true);
    setLoadError("");

    try {
      const result = await getProfessors({
        search: debouncedSearch,
        campusId: filters.campusId,
        careerId: filters.careerId,
        courseId: filters.courseId,
        sort: filters.sort,
        signal,
      });

      setProfessors(sortProfessorsByName(result.data));
    } catch (error) {
      if (isCanceledRequest(error)) {
        return;
      }

      if (!handleUnauthorized(error)) {
        setLoadError(
          getApiErrorMessage(
            error,
            "No se pudieron cargar los profesores.",
          ),
        );
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [debouncedSearch, filters.campusId, filters.careerId, filters.courseId, filters.sort, handleUnauthorized]);

  useEffect(() => {
    const controller = new AbortController();
    loadOptions({ signal: controller.signal });
    return () => controller.abort();
  }, [loadOptions]);

  useEffect(() => {
    const controller = new AbortController();
    loadProfessors({ signal: controller.signal });
    return () => controller.abort();
  }, [loadProfessors]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setNotice(null), 4_000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const updateFilter = useCallback((name, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
      ...(name === "careerId" ? { courseId: "" } : null),
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setDebouncedSearch("");
  }, []);

  const createItem = useCallback(async (payload) => {
    if (isSaving) {
      return { ok: false, message: "La operación ya se encuentra en proceso." };
    }

    setIsSaving(true);

    try {
      const result = await createProfessor(payload);
      setProfessors((current) => sortProfessorsByName([...current, result.data]));
      setNotice({ message: result.message || "Profesor creado correctamente." });
      return { ok: true, ...result };
    } catch (error) {
      if (handleUnauthorized(error)) {
        return { ok: false, message: "Sesión vencida." };
      }

      return {
        ok: false,
        message: getApiErrorMessage(error, "No se pudo crear el profesor."),
      };
    } finally {
      setIsSaving(false);
    }
  }, [handleUnauthorized, isSaving]);

  const updateItem = useCallback(async (professorId, payload) => {
    if (isSaving) {
      return { ok: false, message: "La operación ya se encuentra en proceso." };
    }

    setIsSaving(true);

    try {
      const result = await updateProfessor(professorId, payload);
      setProfessors((current) => sortProfessorsByName(
        replaceProfessorInList(current, result.data),
      ));
      setDetailProfessor((current) =>
        current && getEntityId(current) === professorId ? result.data : current,
      );
      setNotice({ message: result.message || "Profesor actualizado correctamente." });
      return { ok: true, ...result };
    } catch (error) {
      if (handleUnauthorized(error)) {
        return { ok: false, message: "Sesión vencida." };
      }

      return {
        ok: false,
        message: getApiErrorMessage(error, "No se pudo actualizar el profesor."),
      };
    } finally {
      setIsSaving(false);
    }
  }, [handleUnauthorized, isSaving]);

  const addCampuses = useCallback(async (professorId, campusIds) => {
    if (isSaving) {
      return { ok: false, message: "La operación ya se encuentra en proceso." };
    }

    setIsSaving(true);

    try {
      const result = await addProfessorCampuses(professorId, campusIds);
      setProfessors((current) => sortProfessorsByName(
        replaceProfessorInList(current, result.data),
      ));
      setDetailProfessor((current) =>
        current && getEntityId(current) === professorId ? result.data : current,
      );
      setNotice({ message: result.message || "Sedes agregadas correctamente." });
      return { ok: true, ...result };
    } catch (error) {
      if (handleUnauthorized(error)) {
        return { ok: false, message: "Sesión vencida." };
      }

      return {
        ok: false,
        message: getApiErrorMessage(error, "No se pudieron agregar las sedes."),
      };
    } finally {
      setIsSaving(false);
    }
  }, [handleUnauthorized, isSaving]);

  const deleteItem = useCallback(async (professorId) => {
    if (deletingId) {
      return { ok: false, message: "La operación ya se encuentra en proceso." };
    }

    setDeletingId(professorId);

    try {
      const result = await deleteProfessor(professorId);
      setProfessors((current) => current.filter(
        (professor) => getEntityId(professor) !== professorId,
      ));
      setDetailProfessor((current) =>
        current && getEntityId(current) === professorId ? null : current,
      );
      setNotice({ message: result.message || "Profesor desactivado correctamente." });
      return { ok: true, ...result };
    } catch (error) {
      if (handleUnauthorized(error)) {
        return { ok: false, message: "Sesión vencida." };
      }

      return {
        ok: false,
        message: getApiErrorMessage(error, "No se pudo eliminar el profesor."),
      };
    } finally {
      setDeletingId(null);
    }
  }, [deletingId, handleUnauthorized]);

  const loadDetail = useCallback(async (slug) => {
    if (!slug) {
      return { ok: false, message: "El profesor no tiene un slug válido." };
    }

    setIsLoadingDetail(true);
    setDetailError("");

    try {
      const result = await getProfessorBySlug(slug);
      setDetailProfessor(result.data);
      return { ok: true, ...result };
    } catch (error) {
      if (handleUnauthorized(error)) {
        return { ok: false, message: "Sesión vencida." };
      }

      const message = getApiErrorMessage(
        error,
        "No se pudo cargar el detalle del profesor.",
      );
      setDetailError(message);
      return { ok: false, message };
    } finally {
      setIsLoadingDetail(false);
    }
  }, [handleUnauthorized]);

  const filteredCourses = useMemo(() => {
    if (!filters.careerId) {
      return courses;
    }

    return courses.filter((course) =>
      courseBelongsToCareer(course, filters.careerId),
    );
  }, [courses, filters.careerId]);

  return {
    professors,
    total: professors.length,
    filters,
    updateFilter,
    clearFilters,
    isLoading,
    loadError,
    reload: () => loadProfessors(),
    campuses,
    careers,
    courses,
    filteredCourses,
    isLoadingOptions,
    optionsError,
    reloadOptions: () => loadOptions(),
    isSaving,
    deletingId,
    notice,
    clearNotice: () => setNotice(null),
    createItem,
    updateItem,
    addCampuses,
    deleteItem,
    detailProfessor,
    setDetailProfessor,
    isLoadingDetail,
    detailError,
    setDetailError,
    loadDetail,
  };
}
