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
  const ratio = originalOrderTotalCents <= 0 ? 0 : Math.min(1, refundAmountCents / originalOrderTotalCents);

  return commissions
    .filter((commission) => commission.amountCents > 0 && commission.status !== "reversed")
    .map((commission) => {
      const reversalAmountCents = Math.floor(commission.amountCents * ratio);
      const fullReversal = reversalAmountCents >= commission.amountCents;

      return {
        commission: {
          ...commission,
          status: fullReversal ? ("reversed" as const) : ("partially_reversed" as const),
          reason: fullReversal ? "Refund reversed commission." : "Partial refund reversed commission proportionally.",
        },
        ledger: {
          shopId: commission.shopId,
          affiliateId: commission.affiliateId,
          commissionIdempotencyKey: commission.idempotencyKey,
          type: "reversal_debit",
          amountCents: -reversalAmountCents,
          currency: commission.currency,
          balanceType: commission.status === "paid" ? "available" : "pending",
          note: `Refund reversal for order ${commission.orderId}.`,
        } satisfies WalletLedgerDraft,
      };
    })
    .filter((entry) => entry.ledger.amountCents < 0);
}
