import { Prisma } from "@prisma/client";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";
import { calculatePaymentComposition } from "./mixed-payment-calculator";

export async function createOrderPaymentComposition({
  orderId,
  shopId,
  totalCents,
  policy,
}: {
  orderId: string;
  shopId: string;
  totalCents: number;
  policy: {
    id?: string;
    fiatCurrency: string;
    fiatPercentageBps: number;
    tokenPercentageBps: number;
    tokenAssetId?: string | null;
    tokenSymbol?: string | null;
    requireExactRatio?: boolean;
  };
}) {
  const composition = calculatePaymentComposition(totalCents, policy);

  if (!composition.ok || !hasDatabaseUrl()) {
    return { ok: composition.ok, stored: false, composition };
  }

  const saved = await getPrisma().orderPaymentComposition.create({
    data: {
      shopId,
      orderId,
      paymentPolicyId: policy.id?.startsWith("fallback") ? null : policy.id,
      fiatCurrency: policy.fiatCurrency,
      fiatRequiredCents: composition.fiatRequiredCents,
      tokenAssetId: policy.tokenAssetId ?? null,
      tokenSymbol: policy.tokenSymbol ?? null,
      tokenRequiredUnits: policy.tokenPercentageBps ? new Prisma.Decimal(composition.tokenRequiredUnits) : null,
      tokenUsdReferenceCents: composition.tokenUsdReferenceCents,
      status: composition.tokenUsdReferenceCents > 0 || composition.fiatRequiredCents > 0 ? "pending" : "paid",
    },
  });

  return { ok: true as const, stored: true, composition: saved };
}
