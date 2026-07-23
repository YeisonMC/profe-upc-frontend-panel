import { TrendingUp } from "lucide-react";

export function RatingHighlight({ rating, maximumRating, professor }) {
  return (
    <section
      aria-label="Profesor con mejor calificación"
      className="relative overflow-hidden rounded-[17px] bg-gradient-to-br from-[#08770f] via-[#0da916] to-[#20d80f] px-5 py-4 text-white shadow-[0_12px_28px_rgba(24,190,18,0.22)]"
    >
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-bold uppercase tracking-[0.04em] text-white/90">
            Mejor rating
          </p>

          <TrendingUp
            aria-hidden="true"
            className="h-4 w-4 text-white/90"
            strokeWidth={1.8}
          />
        </div>

        <div className="mt-2 flex items-end">
          <strong className="font-display text-[34px] font-extrabold leading-none tracking-[-0.055em]">
            {rating}
          </strong>

          <span className="pb-1 text-[14px] font-bold">/{maximumRating}</span>
        </div>

        <p className="mt-2 text-[11px] font-medium text-white/95">
          {professor}
        </p>
      </div>
    </section>
  );
}
