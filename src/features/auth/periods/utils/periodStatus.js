export const PERIOD_STATUS = Object.freeze({
  upcoming: "upcoming",
  open: "open",
  closed: "closed",
  unknown: "unknown",
});

export const getPeriodStatus = (period, now = new Date()) => {
  if (!period) {
    return PERIOD_STATUS.unknown;
  }

  if (!period.isActive) {
    return PERIOD_STATUS.closed;
  }

  const startDate = new Date(period.startDate);
  const endDate = new Date(period.endDate);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return PERIOD_STATUS.unknown;
  }

  if (now < startDate) {
    return PERIOD_STATUS.upcoming;
  }

  if (now <= endDate) {
    return PERIOD_STATUS.open;
  }

  return PERIOD_STATUS.closed;
};

export const PERIOD_STATUS_CONFIG = Object.freeze({
  [PERIOD_STATUS.upcoming]: {
    label: "Próximo",
    classes:
      "border-amber-300 bg-amber-50 text-amber-700",
  },
  [PERIOD_STATUS.open]: {
    label: "Abierto",
    classes:
      "border-emerald-300 bg-emerald-50 text-emerald-700",
  },
  [PERIOD_STATUS.closed]: {
    label: "Cerrado",
    classes:
      "border-red-300 bg-red-50 text-red-700",
  },
  [PERIOD_STATUS.unknown]: {
    label: "Sin estado",
    classes:
      "border-zinc-300 bg-zinc-100 text-zinc-600",
  },
});

export const getPeriodStatusConfig = (period) => {
  const status = getPeriodStatus(period);

  return {
    status,
    ...PERIOD_STATUS_CONFIG[status],
  };
};
