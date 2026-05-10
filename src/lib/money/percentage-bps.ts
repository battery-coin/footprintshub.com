export function percentToBps(value: string | number) {
  const normalized = typeof value === "number" ? value : Number.parseFloat(value.replace("%", "").trim());

  if (!Number.isFinite(normalized)) {
    throw new Error("Percentage must be a number.");
  }

  if (normalized < 0 || normalized > 100) {
    throw new Error("Percentage must be between 0 and 100.");
  }

  return Math.round(normalized * 100);
}

export function bpsToPercent(bps: number) {
  if (!Number.isFinite(bps)) {
    throw new Error("Basis points must be a number.");
  }

  return Number((bps / 100).toFixed(2));
}

export function formatBpsAsPercent(bps?: number | null) {
  if (bps === null || bps === undefined) {
    return "0%";
  }

  const percent = bpsToPercent(bps);
  return `${Number.isInteger(percent) ? percent.toFixed(0) : percent}%`;
}

export function validatePercentage(value: string | number) {
  try {
    return { ok: true as const, bps: percentToBps(value) };
  } catch (error) {
    return { ok: false as const, reason: error instanceof Error ? error.message : "Invalid percentage." };
  }
}
