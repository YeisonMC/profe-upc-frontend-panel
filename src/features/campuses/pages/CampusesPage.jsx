import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Building2 } from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { CatalogItemCard } from "../../../components/admin/CatalogItemCard.jsx";
import { CatalogPageShell } from "../../../components/admin/CatalogPageShell.jsx";
import { NameFormModal } from "../../../components/admin/NameFormModal.jsx";
import { OperationNotice } from "../../../components/admin/OperationNotice.jsx";
import { useAdminCollection } from "../../catalogs/hooks/useAdminCollection.js";
import {
  createCampus,
  getCampuses,
} from "../services/campus.service.js";

const normalizeText = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function CampusesPage({ openCreateOnMount = false }) {
  const [searchValue, setSearchValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const collection = useAdminCollection({
    listResource: getCampuses,
    createResource: createCampus,
    loadErrorMessage: "No se pudieron cargar las sedes.",
  });

  useEffect(() => {
    if (openCreateOnMount) {
      setFormError("");
      setIsFormOpen(true);
    }
  }, [openCreateOnMount]);

  const filteredItems = useMemo(() => {
    const term = normalizeText(searchValue.trim());

    if (!term) {
      return collection.items;
    }

    return collection.items.filter((campus) =>
      normalizeText(campus.name).includes(term),
    );
  }, [collection.items, searchValue]);

  const handleCreate = async (payload) => {
    setFormError("");
    const result = await collection.createItem(payload);

    if (result.ok) {
      setIsFormOpen(false);
      return;
    }

    setFormError(result.message);
  };

  return (
    <>
      <CatalogPageShell
        title="Sedes"
        description="Campus disponibles en la plataforma."
        total={collection.total}
        searchValue={searchValue}
        searchPlaceholder="Ej. Pueblo Libre"
        onSearchChange={setSearchValue}
        onAdd={() => {
          setFormError("");
          setIsFormOpen(true);
        }}
        isLoading={collection.isLoading}
        loadError={collection.loadError}
        onRetry={collection.reload}
        hasItems={collection.items.length > 0}
        hasFilteredItems={filteredItems.length > 0}
        emptyMessage="Todavía no hay sedes registradas."
      >
        <motion.div
          layout
          className="grid grid-cols-1 gap-2 md:grid-cols-2"
        >
          <AnimatePresence initial={false}>
            {filteredItems.map((campus) => (
              <CatalogItemCard
                key={campus._id ?? campus.id}
                item={campus}
                icon={Building2}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </CatalogPageShell>

      <NameFormModal
        isOpen={isFormOpen}
        mode="create"
        entityLabel="sede"
        maxLength={100}
        isSubmitting={collection.isSaving}
        serverError={formError}
        onClose={() => {
          if (!collection.isSaving) {
            setIsFormOpen(false);
            setFormError("");
          }
        }}
        onSubmit={handleCreate}
      />

      <OperationNotice
        notice={collection.notice}
        onClose={collection.clearNotice}
      />
    </>
  );
}
