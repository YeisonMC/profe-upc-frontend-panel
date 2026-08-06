import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { CatalogItemCard } from "../../../components/admin/CatalogItemCard.jsx";
import { CatalogPageShell } from "../../../components/admin/CatalogPageShell.jsx";
import { ConfirmDeleteModal } from "../../../components/admin/ConfirmDeleteModal.jsx";
import { OperationNotice } from "../../../components/admin/OperationNotice.jsx";
import {
  getApiErrorMessage,
  isUnauthorizedRequest,
} from "../../../services/apiError.js";
import { ROUTES } from "../../../app/config/routePaths.js";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { getCareers } from "../../careers/services/career.service.js";
import { useAdminCollection } from "../../catalogs/hooks/useAdminCollection.js";
import { CourseFormModal } from "../components/CourseFormModal.jsx";
import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "../services/course.service.js";
import {
  formatCourseCareerList,
  formatCourseCareerSummary,
  getCourseCareerNames,
} from "../utils/course.utils.js";

const getItemId = (item) => item?._id ?? item?.id;

const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function CoursesPage({ openCreateOnMount = false }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [searchValue, setSearchValue] = useState("");
  const [formMode, setFormMode] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [careers, setCareers] = useState([]);
  const [careersError, setCareersError] = useState("");

  const collection = useAdminCollection({
    listResource: getCourses,
    createResource: createCourse,
    updateResource: updateCourse,
    deleteResource: deleteCourse,
    loadErrorMessage: "No se pudieron cargar los cursos.",
  });

  useEffect(() => {
    if (openCreateOnMount) {
      setSelectedCourse(null);
      setFormMode("create");
    }
  }, [openCreateOnMount]);

  useEffect(() => {
    const abortController = new AbortController();

    const loadCareers = async () => {
      try {
        const result = await getCareers({
          signal: abortController.signal,
        });
        setCareers(result.data);
        setCareersError("");
      } catch (error) {
        if (isUnauthorizedRequest(error)) {
          signOut();
          navigate(ROUTES.login, { replace: true });
          return;
        }

        if (error?.code !== "ERR_CANCELED") {
          setCareersError(
            getApiErrorMessage(
              error,
              "No se pudieron cargar las carreras.",
            ),
          );
        }
      }
    };

    loadCareers();

    return () => {
      abortController.abort();
    };
  }, [navigate, signOut]);

  const filteredItems = useMemo(() => {
    const term = normalizeText(searchValue.trim());

    if (!term) {
      return collection.items;
    }

    return collection.items.filter((course) => {
      const searchableText = [
        course.name,
        course.code,
        ...getCourseCareerNames(course),
      ]
        .map(normalizeText)
        .join(" ");

      return searchableText.includes(term);
    });
  }, [collection.items, searchValue]);

  const closeForm = () => {
    if (collection.isSaving) {
      return;
    }

    setFormMode(null);
    setSelectedCourse(null);
    setFormError("");
  };

  const handleSave = async (payload) => {
    setFormError("");

    const result =
      formMode === "edit"
        ? await collection.updateItem(
            getItemId(selectedCourse),
            payload,
          )
        : await collection.createItem(payload);

    if (result.ok) {
      closeForm();
      return;
    }

    setFormError(result.message);
  };

  const handleDelete = async () => {
    const courseId = getItemId(selectedCourse);

    if (!courseId) {
      return;
    }

    setDeleteError("");
    const result = await collection.deleteItem(courseId);

    if (result.ok) {
      setSelectedCourse(null);
      setFormMode(null);
      return;
    }

    setDeleteError(result.message);
  };

  const openCreateForm = () => {
    if (careersError) {
      setFormError(careersError);
    } else if (careers.length === 0) {
      setFormError(
        "Primero debes registrar al menos una carrera activa.",
      );
    } else {
      setFormError("");
    }

    setSelectedCourse(null);
    setFormMode("create");
  };

  return (
    <>
      <CatalogPageShell
        title="Cursos"
        description="Catálogo de cursos asociables a profesores."
        total={collection.total}
        searchValue={searchValue}
        searchPlaceholder="Ej. Inteligencia Artificial"
        onSearchChange={setSearchValue}
        onAdd={openCreateForm}
        isLoading={collection.isLoading}
        loadError={collection.loadError}
        onRetry={collection.reload}
        hasItems={collection.items.length > 0}
        hasFilteredItems={filteredItems.length > 0}
        emptyMessage="Todavía no hay cursos registrados."
      >
        <motion.div
          layout
          className="grid grid-cols-1 gap-2 md:grid-cols-2"
        >
          <AnimatePresence initial={false}>
            {filteredItems.map((course) => {
              const courseId = getItemId(course);
              const meta = [course.code, formatCourseCareerSummary(course)]
                .filter(Boolean)
                .join(" · ");

              const metaTitle = [course.code, formatCourseCareerList(course)]
                .filter(Boolean)
                .join(" - ");

              return (
                <CatalogItemCard
                  key={courseId}
                  item={course}
                  icon={BookOpen}
                  meta={meta}
                  metaTitle={metaTitle}
                  isDeleting={collection.deletingId === courseId}
                  onEdit={(item) => {
                    setSelectedCourse(item);
                    setFormError(careersError);
                    setFormMode("edit");
                  }}
                  onDelete={(item) => {
                    setSelectedCourse(item);
                    setDeleteError("");
                    setFormMode("delete");
                  }}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      </CatalogPageShell>

      <CourseFormModal
        isOpen={formMode === "create" || formMode === "edit"}
        mode={formMode}
        initialItem={selectedCourse}
        careers={careers}
        isSubmitting={collection.isSaving}
        serverError={formError || careersError}
        onClose={closeForm}
        onSubmit={handleSave}
      />

      <ConfirmDeleteModal
        isOpen={formMode === "delete" && Boolean(selectedCourse)}
        entityName="el curso"
        itemName={selectedCourse?.name ?? ""}
        isDeleting={Boolean(collection.deletingId)}
        error={deleteError}
        onClose={() => {
          if (!collection.deletingId) {
            setSelectedCourse(null);
            setFormMode(null);
            setDeleteError("");
          }
        }}
        onConfirm={handleDelete}
      />

      <OperationNotice
        notice={collection.notice}
        onClose={collection.clearNotice}
      />
    </>
  );
}
