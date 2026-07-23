import { Menu } from "lucide-react";

export function AdminMobileHeader({
  isSidebarOpen,
  menuButtonRef,
  onOpenSidebar,
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center border-b border-zinc-200 bg-white/95 px-4 backdrop-blur lg:hidden">
      <button
        ref={menuButtonRef}
        type="button"
        aria-label="Abrir menú de navegación"
        aria-expanded={isSidebarOpen}
        aria-controls="admin-mobile-sidebar"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-4 focus-visible:ring-upc-red/15"
        onClick={onOpenSidebar}
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
      </button>

      <p className="ml-3 font-display text-[16px] font-bold tracking-[-0.025em] text-zinc-950">
        Panel Admin
      </p>
    </header>
  );
}
