import { Link } from "react-router-dom";

export function QuickActions({ actions }) {
  return (
    <section
      aria-labelledby="quick-actions-title"
      className="rounded-[17px] border border-zinc-200 bg-white px-4 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.05)]"
    >
      <h2
        id="quick-actions-title"
        className="font-display text-[13px] font-bold tracking-[-0.02em] text-zinc-900"
      >
        Acciones rápidas
      </h2>

      <p className="mt-1 text-[10px] text-zinc-500">
        Atajos frecuentes del panel.
      </p>

      <ul className="mt-3 space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <li key={action.id}>
              <Link
                to={action.to}
                className="flex min-h-9 items-center gap-2.5 rounded-[9px] border border-zinc-200 px-3 text-[11px] font-medium text-zinc-800 outline-none transition-[border-color,background-color,color,transform] hover:border-red-200 hover:bg-red-50 hover:text-upc-red focus-visible:ring-4 focus-visible:ring-upc-red/15 active:scale-[0.99]"
              >
                <Icon
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-upc-red"
                  strokeWidth={1.8}
                />

                {action.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
