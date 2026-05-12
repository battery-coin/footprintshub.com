export type PaymentRatioInput = {
  fiatPercentageBps: number;
  tokenPercentageBps: number;
  requireExactRatio?: boolean;
};

export function validatePaymentRatio(input: PaymentRatioInput) {
  const fiat = Number(input.fiatPercentageBps);
  const token = Number(input.tokenPercentageBps);

  if (!Number.isInteger(fiat) || !Number.isInteger(token) || fiat < 0 || token < 0 || fiat > 10000 || token > 10000) {
    return { ok: false as const, error: "Payment percentages must be whole basis points from 0 to 10000." };
  }

  if (input.requireExactRatio !== false && fiat + token !== 10000) {
    return { ok: false as const, error: "USD portion and token portion must total 100%." };
  }

  return { ok: true as const };
}

export function calculatePaymentComposition(totalCents: number, ratio: PaymentRatioInput) {
  const validation = validatePaymentRatio(ratio);

  if (!validation.ok) {
    return validation;
  }

  const fiatRequiredCents = Math.round((totalCents * ratio.fiatPercentageBps) / 10000);
  const tokenUsdReferenceCents = Math.max(0, totalCents - fiatRequiredCents);

  return {
    ok: true as const,
    totalCents,
    fiatRequiredCents,
    tokenUsdReferenceCents,
    tokenRequiredUnits: tokenUsdReferenceCents,
    fiatPercentageBps: ratio.fiatPercentageBps,
    tokenPercentageBps: ratio.tokenPercentageBps,
  };
}

export function canCheckoutWithPolicy(policy: { compositionMode: string; tokenPercentageBps: number; tokenPaymentsEnabled?: boolean }) {
  if (policy.compositionMode === "fiat_only" || policy.tokenPercentageBps === 0) {
    return { ok: true as const };
  }

  if (!policy.tokenPaymentsEnabled) {
    return {
      ok: false as const,
      reason: "Mixed token checkout is configured but token processor is not enabled yet.",
    };
  }

  return { ok: true as const };
}
