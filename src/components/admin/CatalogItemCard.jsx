import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export function CatalogItemCard({
  item,
  icon: Icon,
  meta,
  onEdit,
  onDelete,
  isDeleting = false,
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[66px] items-center gap-3 rounded-[12px] border border-zinc-200 bg-white px-4 py-3 transition-colors hover:border-zinc-300"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-upc-red">
        <Icon
          aria-hidden="true"
          className="h-[18px] w-[18px]"
          strokeWidth={1.8}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium text-zinc-950">
          {item.name}
        </h3>

        {meta ? (
          <p className="mt-0.5 truncate text-[11px] text-zinc-500">
            {meta}
          </p>
        ) : null}
      </div>

      {onEdit || onDelete ? (
        <div className="flex shrink-0 items-center gap-1.5">
          {onEdit ? (
            <button
              type="button"
              aria-label={`Editar ${item.name}`}
              disabled={isDeleting}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-900 outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-4 focus-visible:ring-upc-red/15 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => onEdit(item)}
            >
              <Pencil
                aria-hidden="true"
                className="h-[17px] w-[17px]"
                strokeWidth={1.8}
              />
            </button>
          ) : null}

          {onDelete ? (
            <button
              type="button"
              aria-label={`Eliminar ${item.name}`}
              disabled={isDeleting}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-red-500 outline-none transition-colors hover:bg-red-50 focus-visible:ring-4 focus-visible:ring-red-500/15 disabled:cursor-wait disabled:opacity-40"
              onClick={() => onDelete(item)}
            >
              <Trash2
                aria-hidden="true"
                className="h-[17px] w-[17px]"
                strokeWidth={1.8}
              />
            </button>
          ) : null}
        </div>
      ) : null}
    </motion.article>
  );
}
