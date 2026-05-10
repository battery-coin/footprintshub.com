# Cart Totals Pipeline

OpenCart's order-total extension concept is rebuilt as a server-side TypeScript pipeline.

## Order

1. subtotal
2. discount/coupon
3. gift voucher
4. store credit
5. loyalty points
6. shipping
7. tax
8. grand total

## Implementation

- `src/lib/totals/totals-pipeline.ts`
- Existing `calculateCartTotals` now delegates to the pipeline while preserving its public return shape.

## Safety

- Client totals are never trusted.
- Gift voucher, store credit, and loyalty deductions are clamped to avoid negative totals.
- Physical carts can add shipping; digital-only carts skip shipping.
