import { useEffect, useMemo, useState } from "react";

const capitalizeFirstLetter = (value) => {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

export function DateTimeCard() {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentDate(new Date());
    }, 30_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const formattedDate = useMemo(() => {
    const value = new Intl.DateTimeFormat("es-PE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(currentDate);

    return capitalizeFirstLetter(value);
  }, [currentDate]);

  const formattedTime = useMemo(() => {
    return new Intl.DateTimeFormat("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(currentDate);
  }, [currentDate]);

  return (
    <section
      aria-label="Fecha y hora actual"
      className="w-full rounded-[13px] border border-zinc-200 bg-white px-4 py-3 text-right shadow-[0_3px_12px_rgba(0,0,0,0.045)] sm:w-[174px]"
    >
      <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
        Fecha y hora
      </p>

      <p className="mt-1 text-[11px] font-bold leading-4 text-zinc-900">
        {formattedDate}
      </p>

      <time
        dateTime={currentDate.toISOString()}
        className="block text-[10px] font-medium text-zinc-500"
      >
        {formattedTime}
      </time>
    </section>
  );
}
