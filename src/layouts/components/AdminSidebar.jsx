import { useState } from "react";
import { LogOut, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { adminNavigationSections } from "../../app/config/adminNavigation.js";
import { ROUTES } from "../../app/config/routePaths.js";
import { useAuth } from "../../features/auth/hooks/useAuth.js";

function BrandLogo() {
  const logoUrl =
    "https://res.cloudinary.com/dtsfiwmzt/image/upload/v1777857026/Logo_oomlqx.png";
  const [hasImageError, setHasImageError] = useState(false);

  const canShowImage = Boolean(logoUrl) && !hasImageError;

  return (
    <div className="flex flex-col items-center">
      {canShowImage ? (
        <img
          src={logoUrl}
          alt="Universidad Peruana de Ciencias Aplicadas"
          className="h-[86px] w-[86px] object-contain"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <div
          aria-label="Logo UPC no configurado"
          className="flex h-[86px] w-[86px] items-center justify-center rounded-2xl border border-red-100 bg-red-50 font-display text-2xl font-extrabold text-upc-red"
        >
          UPC
        </div>
      )}

      <p className="mt-2 font-display text-[17px] font-extrabold tracking-[-0.03em] text-zinc-950">
        Panel Admin
      </p>
    </div>
  );
}

export function AdminSidebar({
  isMobile = false,
  closeButtonRef,
  onClose,
  onNavigate,
}) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();

    onNavigate?.();

    navigate(ROUTES.login, {
      replace: true,
    });
  };

  return (
    <div className="flex h-full flex-col border-r border-zinc-200 bg-white">
      {isMobile ? (
        <div className="flex h-14 items-center justify-end px-4">
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Cerrar menú de navegación"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-4 focus-visible:ring-upc-red/15"
            onClick={() => onClose?.(true)}
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      ) : null}

      <div
        className={[
          "flex flex-1 flex-col overflow-y-auto px-5 pb-5",
          isMobile ? "pt-1" : "pt-7",
        ].join(" ")}
      >
        <BrandLogo />

        <nav aria-label="Navegación administrativa" className="mt-9 space-y-7">
          {adminNavigationSections.map((section) => (
            <section key={section.id} aria-labelledby={`${section.id}-title`}>
              <h2
                id={`${section.id}-title`}
                className="mb-2 px-2 text-[10px] font-medium text-zinc-400"
              >
                {section.label}
              </h2>

              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.to}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          [
                            "group relative flex min-h-10 items-center gap-2.5 rounded-lg px-2.5",
                            "text-[13px] outline-none transition-colors duration-150",
                            "focus-visible:ring-4 focus-visible:ring-upc-red/15",
                            isActive
                              ? "bg-red-50 font-semibold text-upc-red"
                              : "font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950",
                          ].join(" ")
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive ? (
                              <span
                                aria-hidden="true"
                                className="absolute -left-5 h-6 w-[3px] rounded-r-full bg-upc-red"
                              />
                            ) : null}

                            <Icon
                              aria-hidden="true"
                              className="h-[17px] w-[17px] shrink-0"
                              strokeWidth={1.75}
                            />

                            <span className="min-w-0 flex-1">{item.label}</span>

                            {item.badge ? (
                              <span
                                aria-label={`${item.badge} pendientes`}
                                className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-upc-red px-1 text-[10px] font-bold text-white"
                              >
                                {item.badge}
                              </span>
                            ) : null}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-upc-red px-4 text-[12px] font-semibold text-white outline-none transition-colors hover:bg-upc-red-dark focus-visible:ring-4 focus-visible:ring-upc-red/20 active:bg-upc-red-active"
            onClick={handleLogout}
          >
            <LogOut aria-hidden="true" className="h-4 w-4" strokeWidth={1.9} />
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
