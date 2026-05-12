# Affiliate Refund Reversal

Refunds reverse commissions exactly once per refund/commission pair.

## Full Refund

Direct, multi-level, rank, tier, coupon, and lifetime commissions tied to the refunded order are reversed when the order is fully refunded.

## Partial Refund

Partial refunds reverse commissions proportionally. If a commission is tied to a specific order item, the reversal uses that item's refunded amount. If the commission is order-level, the reversal uses refund amount divided by commission base.

## Paid Commission

If a commission has already been paid, the system creates a negative affiliate wallet ledger entry instead of deleting history. This preserves payout auditability and leaves any collection/future-balance decision for admin review.

## Idempotency

`src/lib/affiliate/refund-reversal.ts` checks for an existing refund reversal ledger with the refund ID in the note before creating a new debit. Duplicate webhook deliveries or repeated processing do not double-reverse the same commission.

## Implementation

- Pure reversal math helper: `calculateRefundReversal`
- Database side effect: `reverseCommissionsForRefund`
- Ledger type: `refund_reversal_debit`
- Commission statuses: `reversed`, `partially_reversed`, `held_due_to_refund`, `chargeback_reversed`
