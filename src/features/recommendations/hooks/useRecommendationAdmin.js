import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../../app/config/routePaths.js";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { professorRecommendationService } from "../services/professorRecommendation.service.js";
import { recommendationReferenceService } from "../services/recommendationReference.service.js";

const getApiErrorMessage = (error) => {
  if (
    axios.isCancel(error) ||
    error?.name === "CanceledError" ||
    error?.code === "ERR_CANCELED"
  ) {
    return "";
  }

  if (error?.code === "ECONNABORTED") {
    return "El servidor tardó demasiado en responder.";
  }

  if (!error?.response) {
    return "No se pudo conectar con el servidor. Verifica que el backend esté encendido.";
  }

  const backendMessage = error.response?.data?.message;

  if (typeof backendMessage === "string" && backendMessage.trim()) {
    return backendMessage;
  }

  const status = error.response.status;

  if (status === 400) {
    return "Revisa los datos enviados.";
  }

  if (status === 401) {
    return "Tu sesión venció. Inicia sesión nuevamente.";
  }

  if (status === 403) {
    return "No tienes autorización para realizar esta acción.";
  }

  if (status === 404) {
    return "La recomendación o uno de sus datos relacionados ya no existe.";
  }

  if (status === 409) {
    return "La recomendación cambió de estado o la operación entra en conflicto con los datos actuales.";
  }

  if (status === 429) {
    return "Has realizado demasiadas solicitudes. Espera un momento.";
  }

  if (status >= 500) {
    return "El servidor presentó un problema. Inténtalo nuevamente.";
  }

  return "No se pudo completar la operación.";
};

export function useRecommendationAdmin() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const listControllerRef = useRef(null);
  const referenceControllerRef = useRef(null);
  const detailControllerRef = useRef(null);
  const mutationLockRef = useRef(false);
  const noticeTimeoutRef = useRef(null);

  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [careers, setCareers] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [isLoadingReferences, setIsLoadingReferences] =
    useState(true);
  const [referencesError, setReferencesError] = useState("");

  const [detailState, setDetailState] = useState({
    isLoading: false,
    error: "",
    data: null,
  });

  const [actionKey, setActionKey] = useState("");
  const [notice, setNotice] = useState(null);

  const handleUnauthorized = useCallback(
    (error) => {
      if (error?.response?.status !== 401) {
        return false;
      }

      signOut();
      navigate(ROUTES.login, { replace: true });

      return true;
    },
    [navigate, signOut],
  );

  const showNotice = useCallback((message, extra = {}) => {
    if (noticeTimeoutRef.current) {
      window.clearTimeout(noticeTimeoutRef.current);
    }

    setNotice({
      type: "success",
      message,
      ...extra,
    });

    noticeTimeoutRef.current = window.setTimeout(() => {
      setNotice(null);
    }, 5_000);
  }, []);

  const loadRecommendations = useCallback(
    async ({ silent = false } = {}) => {
      listControllerRef.current?.abort();

      const controller = new AbortController();
      listControllerRef.current = controller;

      if (!silent) {
        setIsLoading(true);
      }

      setLoadError("");

      try {
        const result =
          await professorRecommendationService.list({
            signal: controller.signal,
          });

        setRecommendations(result.items);

        return true;
      } catch (error) {
        if (
          axios.isCancel(error) ||
          error?.name === "CanceledError" ||
          error?.code === "ERR_CANCELED"
        ) {
          return false;
        }

        if (!handleUnauthorized(error)) {
          setLoadError(getApiErrorMessage(error));
        }

        return false;
      } finally {
        if (
          listControllerRef.current === controller &&
          !silent
        ) {
          setIsLoading(false);
        }
      }
    },
    [handleUnauthorized],
  );

  const loadReferences = useCallback(async () => {
    referenceControllerRef.current?.abort();

    const controller = new AbortController();
    referenceControllerRef.current = controller;

    setIsLoadingReferences(true);
    setReferencesError("");

    try {
      const [careerItems, campusItems] = await Promise.all([
        recommendationReferenceService.listCareers(
          controller.signal,
        ),
        recommendationReferenceService.listCampuses(
          controller.signal,
        ),
      ]);

      setCareers(careerItems);
      setCampuses(campusItems);

      return true;
    } catch (error) {
      if (
        axios.isCancel(error) ||
        error?.name === "CanceledError" ||
        error?.code === "ERR_CANCELED"
      ) {
        return false;
      }

      if (!handleUnauthorized(error)) {
        setReferencesError(getApiErrorMessage(error));
      }

      return false;
    } finally {
      if (referenceControllerRef.current === controller) {
        setIsLoadingReferences(false);
      }
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    loadRecommendations();
    loadReferences();

    return () => {
      listControllerRef.current?.abort();
      referenceControllerRef.current?.abort();
      detailControllerRef.current?.abort();

      if (noticeTimeoutRef.current) {
        window.clearTimeout(noticeTimeoutRef.current);
      }
    };
  }, [loadRecommendations, loadReferences]);

  const loadDetail = useCallback(
    async (recommendationId) => {
      detailControllerRef.current?.abort();

      const controller = new AbortController();
      detailControllerRef.current = controller;

      setDetailState({
        isLoading: true,
        error: "",
        data: null,
      });

      try {
        const data =
          await professorRecommendationService.getById(
            recommendationId,
            controller.signal,
          );

        setDetailState({
          isLoading: false,
          error: "",
          data,
        });

        return data;
      } catch (error) {
        if (
          axios.isCancel(error) ||
          error?.name === "CanceledError" ||
          error?.code === "ERR_CANCELED"
        ) {
          return null;
        }

        handleUnauthorized(error);

        setDetailState({
          isLoading: false,
          error: getApiErrorMessage(error),
          data: null,
        });

        return null;
      }
    },
    [handleUnauthorized],
  );

  const clearDetail = useCallback(() => {
    detailControllerRef.current?.abort();

    setDetailState({
      isLoading: false,
      error: "",
      data: null,
    });
  }, []);

  const runMutation = useCallback(
    async ({
      key,
      request,
      successExtra,
    }) => {
      if (mutationLockRef.current) {
        return {
          ok: false,
          message:
            "Ya existe una operación en proceso. Espera un momento.",
        };
      }

      mutationLockRef.current = true;
      setActionKey(key);

      try {
        const result = await request();

        await loadRecommendations({ silent: true });

        showNotice(result.message, successExtra?.(result) ?? {});

        return {
          ok: true,
          data: result.data ?? null,
          message: result.message,
        };
      } catch (error) {
        const wasUnauthorized = handleUnauthorized(error);

        if (error?.response?.status === 409 && !wasUnauthorized) {
          await loadRecommendations({ silent: true });
        }

        if (import.meta.env.DEV) {
          console.error(
            "Error administrando recomendaciones:",
            {
              message: error?.message,
              status: error?.response?.status,
              response: error?.response?.data,
            },
          );
        }

        return {
          ok: false,
          status: error?.response?.status,
          message: getApiErrorMessage(error),
        };
      } finally {
        mutationLockRef.current = false;
        setActionKey("");
      }
    },
    [
      handleUnauthorized,
      loadRecommendations,
      showNotice,
    ],
  );

  const updateRecommendation = useCallback(
    (recommendationId, payload) => {
      return runMutation({
        key: `update:${recommendationId}`,
        request: () =>
          professorRecommendationService.update(
            recommendationId,
            payload,
          ),
      });
    },
    [runMutation],
  );

  const acceptRecommendation = useCallback(
    (recommendationId, payload) => {
      return runMutation({
        key: `accept:${recommendationId}`,
        request: () =>
          professorRecommendationService.accept(
            recommendationId,
            payload,
          ),
        successExtra: (result) => ({
          professor: result?.data?.professor ?? null,
        }),
      });
    },
    [runMutation],
  );

  const rejectRecommendation = useCallback(
    (recommendationId, rejectionReason) => {
      return runMutation({
        key: `reject:${recommendationId}`,
        request: () =>
          professorRecommendationService.reject(
            recommendationId,
            rejectionReason,
          ),
      });
    },
    [runMutation],
  );

  const deleteRecommendation = useCallback(
    (recommendationId) => {
      return runMutation({
        key: `delete:${recommendationId}`,
        request: () =>
          professorRecommendationService.remove(
            recommendationId,
          ),
      });
    },
    [runMutation],
  );

  return {
    recommendations,
    isLoading,
    loadError,

    careers,
    campuses,
    isLoadingReferences,
    referencesError,

    detailState,
    actionKey,
    notice,

    reload: loadRecommendations,
    reloadReferences: loadReferences,
    loadDetail,
    clearDetail,

    updateRecommendation,
    acceptRecommendation,
    rejectRecommendation,
    deleteRecommendation,
  };
}
