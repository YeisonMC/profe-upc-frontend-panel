import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function AdminModal({
  isOpen,
  title,
  description,
  children,
  onClose,
  isBusy = false,
  maxWidthClassName = "max-w-[512px]",
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(null);
  const previousActiveElementRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previousActiveElementRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      const preferredElement =
        dialogRef.current?.querySelector("[data-autofocus]");
      const firstFocusable =
        dialogRef.current?.querySelector(FOCUSABLE_SELECTOR);

      (preferredElement ?? firstFocusable)?.focus();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isBusy) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = [
        ...(dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) ?? []),
      ];

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);

      window.requestAnimationFrame(() => {
        previousActiveElementRef.current?.focus?.();
      });
    };
  }, [isBusy, isOpen, onClose]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-zinc-950/80 px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isBusy) {
              onClose();
            }
          }}
        >
          <motion.section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }
            }
            animate={{ opacity: 1, scale: 1 }}
            exit={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }
            }
            transition={{
              duration: shouldReduceMotion ? 0 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`w-full ${maxWidthClassName} rounded-[14px] border border-zinc-200 bg-white p-5 shadow-2xl sm:p-6`}
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id={titleId}
                  className="font-display text-[20px] font-bold tracking-[-0.035em] text-zinc-900"
                >
                  {title}
                </h2>

                {description ? (
                  <p
                    id={descriptionId}
                    className="mt-1 text-sm leading-5 text-zinc-500"
                  >
                    {description}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                aria-label="Cerrar ventana"
                disabled={isBusy}
                className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-500 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-4 focus-visible:ring-upc-red/15 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={onClose}
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </header>

            {children}
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
