# Affiliate Refund Reversal

## Full Refund

All direct, level, rank, tier, coupon, and lifetime commissions tied to the refunded order are reversed.

## Partial Refund

Commissions are reversed proportionally based on refund amount divided by original order total.

## Paid Commission

If a commission was already paid, the system creates a negative ledger adjustment or future-balance debit. It does not erase history.

## Chargeback

Chargebacks should immediately hold or reverse commissions and flag the affiliate/order for manual review.

## Implementation

`src/lib/affiliate/refund-reversal.ts` calculates proportional reversal drafts and debit ledger entries.
