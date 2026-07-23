import { motion } from "framer-motion";

const iconToneClasses = {
  amber: "border-amber-200 bg-amber-50 text-amber-500",
  green: "border-emerald-200 bg-emerald-50 text-emerald-500",
  blue: "border-blue-200 bg-blue-50 text-blue-500",
};

export function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  tone = "blue",
  reduceMotion = false,
}) {
  return (
    <motion.article
      variants={{
        hidden: {
          opacity: 0,
          y: reduceMotion ? 0 : 8,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      }}
      transition={{ duration: reduceMotion ? 0.08 : 0.2 }}
      className="min-h-[84px] rounded-[13px] border border-zinc-200 bg-white px-4 py-3.5 shadow-[0_3px_12px_rgba(0,0,0,0.045)]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="pt-0.5 text-[10px] font-bold uppercase tracking-[0.02em] text-zinc-500">
          {label}
        </p>

        <div
          className={[
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
            iconToneClasses[tone] ?? iconToneClasses.blue,
          ].join(" ")}
        >
          <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
        </div>
      </div>

      <div className="-mt-0.5 flex items-end gap-1.5">
        <strong className="font-display text-[23px] font-extrabold leading-none tracking-[-0.04em] text-zinc-950">
          {value}
        </strong>

        {suffix ? (
          <span className="pb-0.5 text-[10px] text-zinc-500">{suffix}</span>
        ) : null}
      </div>
    </motion.article>
  );
}
