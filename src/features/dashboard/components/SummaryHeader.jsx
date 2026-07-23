import { ShieldCheck } from "lucide-react";

import { DateTimeCard } from "./DateTimeCard.jsx";

export function SummaryHeader() {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1">
          <ShieldCheck
            aria-hidden="true"
            className="h-3.5 w-3.5 text-upc-red"
            strokeWidth={1.9}
          />

          <span className="text-[10px] font-bold uppercase tracking-[0.04em] text-upc-red">
            Panel de administración
          </span>
        </div>

        <h1 className="mt-3 font-display text-[27px] font-extrabold leading-none tracking-[-0.045em] text-zinc-950 sm:text-[29px]">
          Centro de control
        </h1>

        <p className="mt-2 text-[12px] leading-5 text-zinc-500">
          Modera contenido y administra la taxonomía de ProfeUPC desde un solo
          lugar.
        </p>
      </div>

      <DateTimeCard />
    </header>
  );
}
