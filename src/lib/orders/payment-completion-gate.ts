export function canCompletePaidOrder(composition?: {
  fiatRequiredCents: number;
  fiatPaidCents: number;
  tokenRequiredUnits?: { toString(): string } | number | string | null;
  tokenPaidUnits?: { toString(): string } | number | string | null;
}) {
  if (!composition) {
    return { ok: true as const };
  }

  if (composition.fiatPaidCents < composition.fiatRequiredCents) {
    return { ok: false as const, reason: "Fiat payment portion is not complete." };
  }

  const requiredToken = Number(composition.tokenRequiredUnits ?? 0);
  const paidToken = Number(composition.tokenPaidUnits ?? 0);

  if (requiredToken > paidToken) {
    return { ok: false as const, reason: "Token payment portion is not complete." };
  }

  return { ok: true as const };
}
