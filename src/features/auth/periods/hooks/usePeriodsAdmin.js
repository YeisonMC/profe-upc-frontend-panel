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
import {
  PERIOD_TYPE_IDS,
} from "../config/periodTypes.js";
import { periodsService } from "../services/periods.service.js";

const EMPTY_COLLECTIONS = {
  [PERIOD_TYPE_IDS.recommendation]: [],
  [PERIOD_TYPE_IDS.review]: [],
};

const EMPTY_ACTIVE_PERIODS = {
  [PERIOD_TYPE_IDS.recommendation]: null,
  [PERIOD_TYPE_IDS.review]: null,
};

const getApiErrorMessage = (error) => {
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

  const statusCode = error.response.status;

  if (statusCode === 400) {
    return "Revisa los datos enviados.";
  }

  if (statusCode === 401) {
    return "Tu sesión venció. Inicia sesión nuevamente.";
  }

  if (statusCode === 403) {
    return "No tienes autorización para realizar esta acción.";
  }

  if (statusCode === 404) {
    return "El período solicitado no existe.";
  }

  if (statusCode === 409) {
    return "La operación entra en conflicto con el estado actual del período.";
  }

  if (statusCode === 429) {
    return "Has realizado demasiadas solicitudes. Espera un momento.";
  }

  if (statusCode >= 500) {
    return "El servidor presentó un problema. Inténtalo nuevamente.";
  }

  return "No se pudo completar la operación.";
};

export function usePeriodsAdmin() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const requestControllerRef = useRef(null);
  const mutationLockRef = useRef(false);
  const noticeTimeoutRef = useRef(null);

  const [periods, setPeriods] = useState(EMPTY_COLLECTIONS);
  const [activePeriods, setActivePeriods] = useState(
    EMPTY_ACTIVE_PERIODS,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionKey, setActionKey] = useState("");
  const [notice, setNotice] = useState(null);

  const [detailState, setDetailState] = useState({
    isLoading: false,
    error: "",
    data: null,
  });

  const handleUnauthorized = useCallback(
    (error) => {
      if (error?.response?.status !== 401) {
        return false;
      }

      signOut();
      navigate(ROUTES.login, {
        replace: true,
      });

      return true;
    },
    [navigate, signOut],
  );

  const showNotice = useCallback((message) => {
    if (noticeTimeoutRef.current) {
      window.clearTimeout(noticeTimeoutRef.current);
    }

    setNotice({
      type: "success",
      message,
    });

    noticeTimeoutRef.current = window.setTimeout(() => {
      setNotice(null);
    }, 4_000);
  }, []);

  const loadPeriods = useCallback(
    async ({ silent = false } = {}) => {
      requestControllerRef.current?.abort();

      const controller = new AbortController();
      requestControllerRef.current = controller;

      if (!silent) {
        setIsLoading(true);
      }

      setLoadError("");

      try {
        const [
          recommendationList,
          recommendationActive,
          reviewList,
          reviewActive,
        ] = await Promise.all([
          periodsService.list(
            PERIOD_TYPE_IDS.recommendation,
            controller.signal,
          ),
          periodsService.getActive(
            PERIOD_TYPE_IDS.recommendation,
            controller.signal,
          ),
          periodsService.list(
            PERIOD_TYPE_IDS.review,
            controller.signal,
          ),
          periodsService.getActive(
            PERIOD_TYPE_IDS.review,
            controller.signal,
          ),
        ]);

        setPeriods({
          [PERIOD_TYPE_IDS.recommendation]:
            recommendationList.items,
          [PERIOD_TYPE_IDS.review]: reviewList.items,
        });

        setActivePeriods({
          [PERIOD_TYPE_IDS.recommendation]:
            recommendationActive,
          [PERIOD_TYPE_IDS.review]: reviewActive,
        });

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
          requestControllerRef.current === controller &&
          !silent
        ) {
          setIsLoading(false);
        }
      }
    },
    [handleUnauthorized],
  );

  useEffect(() => {
    loadPeriods();

    return () => {
      requestControllerRef.current?.abort();

      if (noticeTimeoutRef.current) {
        window.clearTimeout(noticeTimeoutRef.current);
      }
    };
  }, [loadPeriods]);

  const runMutation = useCallback(
    async ({ key, request }) => {
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

        await loadPeriods({
          silent: true,
        });

        showNotice(result.message);

        return {
          ok: true,
          data: result.data ?? null,
          message: result.message,
        };
      } catch (error) {
        handleUnauthorized(error);

        if (import.meta.env.DEV) {
          console.error("Error administrando períodos:", {
            message: error?.message,
            status: error?.response?.status,
            response: error?.response?.data,
          });
        }

        return {
          ok: false,
          message: getApiErrorMessage(error),
        };
      } finally {
        mutationLockRef.current = false;
        setActionKey("");
      }
    },
    [handleUnauthorized, loadPeriods, showNotice],
  );

  const createPeriod = useCallback(
    (typeId, payload) => {
      return runMutation({
        key: `${typeId}:create`,
        request: () => periodsService.create(typeId, payload),
      });
    },
    [runMutation],
  );

  const updatePeriod = useCallback(
    (typeId, periodId, payload) => {
      return runMutation({
        key: `${typeId}:update:${periodId}`,
        request: () =>
          periodsService.update(typeId, periodId, payload),
      });
    },
    [runMutation],
  );

  const closePeriod = useCallback(
    (typeId, periodId) => {
      return runMutation({
        key: `${typeId}:close:${periodId}`,
        request: () =>
          periodsService.close(typeId, periodId),
      });
    },
    [runMutation],
  );

  const deletePeriod = useCallback(
    (typeId, periodId) => {
      return runMutation({
        key: `${typeId}:delete:${periodId}`,
        request: () =>
          periodsService.remove(typeId, periodId),
      });
    },
    [runMutation],
  );

  const loadPeriodDetail = useCallback(
    async (typeId, periodId) => {
      setDetailState({
        isLoading: true,
        error: "",
        data: null,
      });

      try {
        const data = await periodsService.getById(
          typeId,
          periodId,
        );

        setDetailState({
          isLoading: false,
          error: "",
          data,
        });

        return data;
      } catch (error) {
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
    setDetailState({
      isLoading: false,
      error: "",
      data: null,
    });
  }, []);

  return {
    periods,
    activePeriods,
    isLoading,
    loadError,
    actionKey,
    notice,
    detailState,

    reload: loadPeriods,
    createPeriod,
    updatePeriod,
    closePeriod,
    deletePeriod,
    loadPeriodDetail,
    clearDetail,
  };
}
