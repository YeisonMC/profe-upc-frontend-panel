const isValidDate = (date) => {
  return date instanceof Date && !Number.isNaN(date.getTime());
};

export const toDateTimeLocalValue = (isoDate) => {
  if (!isoDate) {
    return "";
  }

  const date = new Date(isoDate);

  if (!isValidDate(date)) {
    return "";
  }

  const timezoneOffset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
};

export const fromDateTimeLocalValue = (localDateTime) => {
  if (!localDateTime) {
    return null;
  }

  const date = new Date(localDateTime);

  if (!isValidDate(date)) {
    return null;
  }

  return date.toISOString();
};

export const formatPeriodDate = (isoDate) => {
  if (!isoDate) {
    return "Sin fecha";
  }

  const date = new Date(isoDate);

  if (!isValidDate(date)) {
    return "Fecha no válida";
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export const areSameInstants = (firstDate, secondDate) => {
  const firstTime = firstDate ? new Date(firstDate).getTime() : Number.NaN;
  const secondTime = secondDate ? new Date(secondDate).getTime() : Number.NaN;

  return (
    Number.isFinite(firstTime) &&
    Number.isFinite(secondTime) &&
    firstTime === secondTime
  );
};
