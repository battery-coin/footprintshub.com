# Affiliate Commission Engine

## Execution Point

Commissions are calculated only after verified payment. Stripe webhook processing marks the order paid, deducts inventory, grants digital unlocks where applicable, and calls the affiliate commission engine.

## Flow

1. Load order and order items.
2. Resolve shop and active affiliate program.
3. Resolve active affiliate plan:
   - affiliate override
   - campaign override
   - creator shop override
   - preferred plan type
   - shop default
4. Resolve attribution:
   - coupon
   - lifetime customer assignment
   - first touch
   - last touch
   - manual override
5. Validate affiliate status, shop isolation, own-referral rules, sale item exclusions, and product/category exclusions.
6. Calculate level 0 direct commission from the best rule by precedence.
7. Load ancestors from `AffiliateTreeClosure`.
8. Calculate levels 1-7 using active `AffiliatePlanLevel` records.
9. Apply rank requirements, compression behavior, monthly caps, per-order caps, and max commission pool.
10. Create `AffiliateCommission` rows in pending status.
11. Create `AffiliateWalletLedger` pending credits.
12. Write `AffiliateAuditLog`.

## Idempotency

- `WebhookEvent` prevents duplicate provider event processing.
- The commission path checks for existing order commissions before creating new rows.
- Commission drafts include idempotency keys by order, affiliate, level, and rule.

## Rule Precedence

1. manual override
2. affiliate + product
3. affiliate + category
4. product
5. category/collection
6. campaign/membership
7. rank/performance tier/affiliate
8. coupon/lifetime
9. shop global

## Implementation Files

- `src/lib/affiliate/commission-engine.ts`
- `src/lib/affiliate/order-commission.ts`
- `src/lib/affiliate/plan-resolver.ts`
- `src/lib/affiliate/level-commission.ts`
- `src/lib/affiliate/commission-caps.ts`
- `src/lib/affiliate/compression.ts`
- `src/lib/affiliate/rank-qualification.ts`
- `src/lib/affiliate/performance-tiers.ts`
- `src/lib/affiliate/refund-reversal.ts`
