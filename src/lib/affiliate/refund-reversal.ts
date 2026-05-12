import type { Prisma } from "@prisma/client";
import type { AffiliateCommissionDraft, WalletLedgerDraft } from "./types";

export function calculateRefundReversal({
  commissions,
  refundAmountCents,
  originalOrderTotalCents,
}: {
  commissions: AffiliateCommissionDraft[];
  refundAmountCents: number;
  originalOrderTotalCents: number;
}) {
  const ratio = Math.max(0, Math.min(1, refundAmountCents / Math.max(1, originalOrderTotalCents)));

  return commissions.map((commission) => {
    const amountCents = Math.floor(commission.amountCents * ratio);
    const fullyReversed = amountCents >= commission.amountCents;
    return {
      commission: {
        ...commission,
        amountCents: Math.max(0, commission.amountCents - amountCents),
        status: fullyReversed ? "reversed" : "partially_reversed",
      },
      ledger: {
        shopId: commission.shopId,
        affiliateId: commission.affiliateId,
        type: "reversal_debit",
        amountCents: -amountCents,
        currency: commission.currency,
        balanceType: commission.status === "approved" ? "approved" : "pending",
        note: "Refund commission reversal.",
      } satisfies WalletLedgerDraft,
    };
  });
}

export async function reverseCommissionsForRefund(tx: Prisma.TransactionClient, refundId: string) {
  const refund = await tx.refund.findUnique({
    where: { id: refundId },
    include: { items: true },
  });
  if (!refund) return { reversed: 0 };

  const commissions = await tx.affiliateCommission.findMany({
    where: {
      shopId: refund.shopId,
      orderId: refund.orderId,
      status: { in: ["pending", "held", "approved", "paid", "partially_reversed"] },
    },
  });

  let reversed = 0;
  for (const commission of commissions) {
    const existing = await tx.affiliateWalletLedger.findFirst({
      where: {
        commissionId: commission.id,
        type: "refund_reversal_debit",
        note: { contains: refund.id },
      },
    });
    if (existing) continue;

    const ratio = calculateCommissionRefundRatio(commission, refund);
    const reversalCents = Math.min(commission.amountCents, Math.max(0, Math.floor(commission.amountCents * ratio)));
    if (reversalCents <= 0) continue;

    await tx.affiliateWalletLedger.create({
      data: {
        shopId: commission.shopId,
        affiliateId: commission.affiliateId,
        commissionId: commission.id,
        type: "refund_reversal_debit",
        amountCents: -reversalCents,
        currency: commission.currency,
        balanceType: commission.status === "paid" ? "available" : "pending",
        note: `Refund reversal for refund ${refund.id}`,
      },
    });

    const fullyReversed = reversalCents >= commission.amountCents || refund.amountCents >= commission.commissionBaseCents;
    await tx.affiliateCommission.update({
      where: { id: commission.id },
      data: {
        status: fullyReversed ? "reversed" : "partially_reversed",
        reversedAt: new Date(),
        metadata: {
          ...(toRecord(commission.metadata) as Prisma.InputJsonObject),
          lastRefundReversalId: refund.id,
          lastRefundReversalCents: reversalCents,
        },
      },
    });
    reversed += 1;
  }

  return { reversed };
}

function calculateCommissionRefundRatio(commission: { orderItemId: string | null; commissionBaseCents: number }, refund: { amountCents: number; items: Array<{ orderItemId: string; amountCents: number }> }) {
  if (commission.orderItemId) {
    const itemRefund = refund.items.find((item) => item.orderItemId === commission.orderItemId);
    if (!itemRefund) return 0;
    return itemRefund.amountCents / Math.max(1, commission.commissionBaseCents);
  }
  return refund.amountCents / Math.max(1, commission.commissionBaseCents);
}

function toRecord(value: Prisma.JsonValue | null | undefined): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
