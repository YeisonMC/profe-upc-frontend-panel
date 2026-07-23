import { ShieldCheck } from "lucide-react";

export function SecurityNotice() {
  return (
    <aside
      aria-label="Aviso de seguridad"
      className="flex items-start gap-3 rounded-[11px] border border-zinc-200 bg-zinc-50/80 px-3.5 py-3.5"
    >
      <ShieldCheck
        aria-hidden="true"
        className="mt-0.5 h-4 w-4 shrink-0 text-upc-red"
        strokeWidth={1.8}
      />

      <p className="text-[11px] leading-[17px] text-zinc-500">
        Este panel es exclusivo para el equipo autorizado. Todos los inicios de
        sesión y acciones son registrados con fines de auditoría.
      </p>
    </aside>
  );
}
