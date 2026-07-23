import { Activity, ArrowUpRight, Inbox } from "lucide-react";
import { Link } from "react-router-dom";

const iconToneClasses = {
  blue: "border-blue-200 bg-blue-50 text-blue-500",
  amber: "border-amber-200 bg-amber-50 text-amber-500",
};

export function ModerationQueue({ items }) {
  return (
    <section
      aria-labelledby="moderation-queue-title"
      className="overflow-hidden rounded-[17px] border border-zinc-200 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.05)]"
    >
      <header className="flex flex-col gap-3 border-b border-zinc-200 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity
              aria-hidden="true"
              className="h-4 w-4 text-upc-red"
              strokeWidth={1.9}
            />

            <h2
              id="moderation-queue-title"
              className="font-display text-[15px] font-bold tracking-[-0.025em] text-zinc-900"
            >
              Cola de moderación
            </h2>
          </div>

          <p className="mt-1 text-[11px] text-zinc-500">
            Últimas solicitudes que requieren tu revisión.
          </p>
        </div>

        <span className="w-fit rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-semibold text-zinc-700">
          {items.length} pendientes
        </span>
      </header>

      {items.length > 0 ? (
        <ul className="divide-y divide-zinc-200 px-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.id}>
                <div className="flex min-h-[52px] items-center gap-3 py-2.5">
                  <div
                    className={[
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border",
                      iconToneClasses[item.tone] ?? iconToneClasses.blue,
                    ].join(" ")}
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-[12px] font-semibold leading-4 text-zinc-900">
                        {item.person}
                      </p>

                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[8px] font-bold uppercase text-amber-500">
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-0.5 text-[10px] leading-4 text-zinc-500">
                      {item.type} · {item.context} · {item.date}
                    </p>
                  </div>

                  <Link
                    to={item.to}
                    aria-label={`Revisar ${item.type.toLowerCase()} de ${item.person}`}
                    className="flex min-h-9 shrink-0 items-center gap-1 rounded-lg px-2 text-[11px] font-semibold text-zinc-800 outline-none transition-colors hover:bg-zinc-100 hover:text-upc-red focus-visible:ring-4 focus-visible:ring-upc-red/15"
                  >
                    <span className="hidden sm:inline">Revisar</span>

                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex min-h-52 flex-col items-center justify-center px-6 text-center">
          <Inbox aria-hidden="true" className="h-8 w-8 text-zinc-300" />

          <p className="mt-3 text-sm font-semibold text-zinc-700">
            No hay solicitudes pendientes
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Las nuevas solicitudes aparecerán aquí.
          </p>
        </div>
      )}
    </section>
  );
}
