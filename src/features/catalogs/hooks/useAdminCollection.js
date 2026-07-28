import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../../app/config/routePaths.js";
import { useAuth } from "../../auth/hooks/useAuth.js";
import {
  getApiErrorMessage,
  isCanceledRequest,
  isUnauthorizedRequest,
} from "../../../services/apiError.js";

const getItemId = (item) => item?._id ?? item?.id;

const sortByName = (items) => {
  return [...items].sort((firstItem, secondItem) =>
    String(firstItem?.name ?? "").localeCompare(
      String(secondItem?.name ?? ""),
      "es",
      { sensitivity: "base" },
    ),
  );
};

export function useAdminCollection({
  listResource,
  createResource,
  updateResource,
  deleteResource,
  loadErrorMessage,
}) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState(null);

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

  const loadItems = useCallback(
    async ({ signal } = {}) => {
      setIsLoading(true);
      setLoadError("");

      try {
        const result = await listResource({ signal });
        setItems(sortByName(result.data));
      } catch (error) {
        if (isCanceledRequest(error)) {
          return;
        }

        if (!handleUnauthorized(error)) {
          setLoadError(
            getApiErrorMessage(error, loadErrorMessage),
          );
        }
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [handleUnauthorized, listResource, loadErrorMessage],
  );

  useEffect(() => {
    const abortController = new AbortController();

    loadItems({ signal: abortController.signal });

    return () => {
      abortController.abort();
    };
  }, [loadItems]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setNotice(null);
    }, 4_000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [notice]);

  const createItem = useCallback(
    async (payload) => {
      if (!createResource || isSaving) {
        return {
          ok: false,
          message: "La operación ya se encuentra en proceso.",
        };
      }

      setIsSaving(true);

      try {
        const result = await createResource(payload);

        setItems((currentItems) =>
          sortByName([...currentItems, result.data]),
        );

        setNotice({
          type: "success",
          message: result.message || "Registro creado correctamente.",
        });

        return { ok: true, ...result };
      } catch (error) {
        if (handleUnauthorized(error)) {
          return { ok: false, message: "Sesión vencida." };
        }

        return {
          ok: false,
          message: getApiErrorMessage(
            error,
            "No se pudo crear el registro.",
          ),
        };
      } finally {
        setIsSaving(false);
      }
    },
    [createResource, handleUnauthorized, isSaving],
  );

  const updateItem = useCallback(
    async (itemId, payload) => {
      if (!updateResource || isSaving) {
        return {
          ok: false,
          message: "La operación ya se encuentra en proceso.",
        };
      }

      setIsSaving(true);

      try {
        const result = await updateResource(itemId, payload);

        setItems((currentItems) =>
          sortByName(
            currentItems.map((item) =>
              getItemId(item) === itemId ? result.data : item,
            ),
          ),
        );

        setNotice({
          type: "success",
          message:
            result.message || "Registro actualizado correctamente.",
        });

        return { ok: true, ...result };
      } catch (error) {
        if (handleUnauthorized(error)) {
          return { ok: false, message: "Sesión vencida." };
        }

        return {
          ok: false,
          message: getApiErrorMessage(
            error,
            "No se pudo actualizar el registro.",
          ),
        };
      } finally {
        setIsSaving(false);
      }
    },
    [handleUnauthorized, isSaving, updateResource],
  );

  const deleteItem = useCallback(
    async (itemId) => {
      if (!deleteResource || deletingId) {
        return {
          ok: false,
          message: "La operación ya se encuentra en proceso.",
        };
      }

      setDeletingId(itemId);

      try {
        const result = await deleteResource(itemId);

        setItems((currentItems) =>
          currentItems.filter((item) => getItemId(item) !== itemId),
        );

        setNotice({
          type: "success",
          message:
            result.message || "Registro eliminado correctamente.",
        });

        return { ok: true, ...result };
      } catch (error) {
        if (handleUnauthorized(error)) {
          return { ok: false, message: "Sesión vencida." };
        }

        return {
          ok: false,
          message: getApiErrorMessage(
            error,
            "No se pudo eliminar el registro.",
          ),
        };
      } finally {
        setDeletingId(null);
      }
    },
    [deleteResource, deletingId, handleUnauthorized],
  );

  const total = useMemo(() => items.length, [items.length]);

  return {
    items,
    total,
    isLoading,
    loadError,
    isSaving,
    deletingId,
    notice,
    clearNotice: () => setNotice(null),
    reload: () => loadItems(),
    createItem,
    updateItem,
    deleteItem,
  };
}
