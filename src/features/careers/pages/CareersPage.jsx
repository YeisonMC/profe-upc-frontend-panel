import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { GraduationCap } from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { CatalogItemCard } from "../../../components/admin/CatalogItemCard.jsx";
import { CatalogPageShell } from "../../../components/admin/CatalogPageShell.jsx";
import { ConfirmDeleteModal } from "../../../components/admin/ConfirmDeleteModal.jsx";
import { NameFormModal } from "../../../components/admin/NameFormModal.jsx";
import { OperationNotice } from "../../../components/admin/OperationNotice.jsx";
import { useAdminCollection } from "../../catalogs/hooks/useAdminCollection.js";
import {
  createCareer,
  deleteCareer,
  getCareers,
  updateCareer,
} from "../services/career.service.js";

const getItemId = (item) => item?._id ?? item?.id;

const normalizeText = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function CareersPage({ openCreateOnMount = false }) {
  const [searchValue, setSearchValue] = useState("");
  const [formMode, setFormMode] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const collection = useAdminCollection({
    listResource: getCareers,
    createResource: createCareer,
    updateResource: updateCareer,
    deleteResource: deleteCareer,
    loadErrorMessage: "No se pudieron cargar las carreras.",
  });

  useEffect(() => {
    if (openCreateOnMount) {
      setSelectedCareer(null);
      setFormError("");
      setFormMode("create");
    }
  }, [openCreateOnMount]);

  const filteredItems = useMemo(() => {
    const term = normalizeText(searchValue.trim());

    if (!term) {
      return collection.items;
    }

    return collection.items.filter((career) =>
      normalizeText(career.name).includes(term),
    );
  }, [collection.items, searchValue]);

  const closeForm = () => {
    if (collection.isSaving) {
      return;
    }

    setFormMode(null);
    setSelectedCareer(null);
    setFormError("");
  };

  const handleSave = async (payload) => {
    setFormError("");

    const result =
      formMode === "edit"
        ? await collection.updateItem(
            getItemId(selectedCareer),
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
    const careerId = getItemId(selectedCareer);

    if (!careerId) {
      return;
    }

    setDeleteError("");
    const result = await collection.deleteItem(careerId);

    if (result.ok) {
      setSelectedCareer(null);
      return;
    }

    setDeleteError(result.message);
  };

  const isDeleteOpen = Boolean(selectedCareer && formMode === "delete");

  return (
    <>
      <CatalogPageShell
        title="Carreras"
        description="Carreras o facultades registradas."
        total={collection.total}
        searchValue={searchValue}
        searchPlaceholder="Ej. Ingeniería Civil"
        onSearchChange={setSearchValue}
        onAdd={() => {
          setSelectedCareer(null);
          setFormError("");
          setFormMode("create");
        }}
        isLoading={collection.isLoading}
        loadError={collection.loadError}
        onRetry={collection.reload}
        hasItems={collection.items.length > 0}
        hasFilteredItems={filteredItems.length > 0}
        emptyMessage="Todavía no hay carreras registradas."
      >
        <motion.div
          layout
          className="grid grid-cols-1 gap-2 md:grid-cols-2"
        >
          <AnimatePresence initial={false}>
            {filteredItems.map((career) => {
              const careerId = getItemId(career);

              return (
                <CatalogItemCard
                  key={careerId}
                  item={career}
                  icon={GraduationCap}
                  isDeleting={collection.deletingId === careerId}
                  onEdit={(item) => {
                    setSelectedCareer(item);
                    setFormError("");
                    setFormMode("edit");
                  }}
                  onDelete={(item) => {
                    setSelectedCareer(item);
                    setDeleteError("");
                    setFormMode("delete");
                  }}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      </CatalogPageShell>

      <NameFormModal
        isOpen={formMode === "create" || formMode === "edit"}
        mode={formMode}
        entityLabel="carrera"
        initialItem={selectedCareer}
        maxLength={150}
        isSubmitting={collection.isSaving}
        serverError={formError}
        onClose={closeForm}
        onSubmit={handleSave}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        entityName="la carrera"
        itemName={selectedCareer?.name ?? ""}
        isDeleting={Boolean(collection.deletingId)}
        error={deleteError}
        onClose={() => {
          if (!collection.deletingId) {
            setSelectedCareer(null);
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
