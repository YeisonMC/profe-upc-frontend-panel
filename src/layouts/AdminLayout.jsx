import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

import { AdminMobileHeader } from "./components/AdminMobileHeader.jsx";
import { AdminSidebar } from "./components/AdminSidebar.jsx";

export function AdminLayout() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback((restoreFocus = false) => {
    setIsSidebarOpen(false);

    if (restoreFocus) {
      window.requestAnimationFrame(() => {
        menuButtonRef.current?.focus();
      });
    }
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeSidebar(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSidebar, isSidebarOpen]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <a
        href="#admin-main-content"
        className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-lg bg-upc-red px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0"
      >
        Saltar al contenido
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] lg:block">
        <AdminSidebar />
      </aside>

      <AdminMobileHeader
        isSidebarOpen={isSidebarOpen}
        menuButtonRef={menuButtonRef}
        onOpenSidebar={openSidebar}
      />

      <AnimatePresence>
        {isSidebarOpen ? (
          <>
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
              className="fixed inset-0 z-40 bg-zinc-950/35 backdrop-blur-[1px] lg:hidden"
              onClick={() => closeSidebar(true)}
            />

            <motion.aside
              id="admin-mobile-sidebar"
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
              initial={shouldReduceMotion ? { opacity: 0 } : { x: "-100%" }}
              animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: "-100%" }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="fixed inset-y-0 left-0 z-50 w-[min(82vw,300px)] bg-white shadow-2xl lg:hidden"
            >
              <AdminSidebar
                isMobile
                closeButtonRef={closeButtonRef}
                onClose={closeSidebar}
                onNavigate={() => closeSidebar(false)}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="min-h-dvh pt-16 lg:pl-[250px] lg:pt-0">
        <main
          id="admin-main-content"
          className="min-h-[calc(100dvh-4rem)] overflow-x-clip lg:min-h-dvh"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={
                shouldReduceMotion
                  ? {
                      opacity: 1,
                    }
                  : {
                      opacity: 0,
                      scale: 0.995,
                    }
              }
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                transformOrigin: "top center",
              }}
              className="min-h-[calc(100dvh-4rem)] lg:min-h-dvh"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
