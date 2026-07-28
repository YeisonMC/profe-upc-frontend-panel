import { CheckCircle2, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

export function OperationNotice({ notice, onClose }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {notice ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 8 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 6 }
          }
          className="fixed bottom-5 right-5 z-[90] flex max-w-[calc(100vw-2.5rem)] items-start gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-xl"
        >
          <CheckCircle2
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
          />

          <p className="text-sm leading-5 text-zinc-800">
            {notice.message}
          </p>

          <button
            type="button"
            aria-label="Cerrar mensaje"
            className="-mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-upc-red/20"
            onClick={onClose}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
