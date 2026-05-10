import type { AffiliateCommissionDraft } from "./types";

export function applyMaxCommissionPool({
  subtotalCents,
  maxPoolBps,
  maxPoolCents,
  commissions,
}: {
  subtotalCents: number;
  maxPoolBps?: number;
  maxPoolCents?: number;
  commissions: AffiliateCommissionDraft[];
}) {
  const bpsCap = maxPoolBps === undefined ? Number.POSITIVE_INFINITY : Math.floor((subtotalCents * maxPoolBps) / 10000);
  const hardCap = maxPoolCents ?? Number.POSITIVE_INFINITY;
  let remaining = Math.min(bpsCap, hardCap);

  return commissions
    .map((commission) => {
      const amountCents = Math.max(0, Math.min(commission.amountCents, remaining));
      remaining -= amountCents;

      return {
        ...commission,
        amountCents,
        capApplied: amountCents < commission.amountCents ? true : commission.capApplied,
        status: amountCents < commission.amountCents ? ("capped" as const) : commission.status,
        reason: amountCents < commission.amountCents ? "Maximum commission pool cap applied." : commission.reason,
      };
    })
    .filter((commission) => commission.amountCents > 0);
}

export function applyMonthlyCap({
  amountCents,
  maxPerMonthCents,
  currentMonthCents,
}: {
  amountCents: number;
  maxPerMonthCents?: number;
  currentMonthCents: number;
}) {
  if (maxPerMonthCents === undefined) {
    return { amountCents, capped: false };
  }

  const remaining = Math.max(0, maxPerMonthCents - currentMonthCents);
  const cappedAmount = Math.min(amountCents, remaining);

  return { amountCents: cappedAmount, capped: cappedAmount < amountCents };
}
