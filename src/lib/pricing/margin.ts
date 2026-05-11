export function calculateProfitCents(priceCents: number, costCents?: number | null) {
  return priceCents - Math.max(0, costCents ?? 0);
}

export function calculateMarginBps(priceCents: number, costCents?: number | null) {
  if (priceCents <= 0 || costCents == null) {
    return null;
  }

  return Math.round((calculateProfitCents(priceCents, costCents) / priceCents) * 10_000);
}

export function formatMargin(bps?: number | null) {
  if (bps == null) {
    return "n/a";
  }

  return `${(bps / 100).toFixed(2)}%`;
}
