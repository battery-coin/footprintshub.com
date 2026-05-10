# OpenCart Conflict Avoidance Plan

## Mapping Rules

- OpenCart store maps to `Shop`.
- OpenCart manufacturer maps to `Brand`.
- OpenCart option maps to `ProductOption`; SKU-bearing combinations still map to `ProductVariant`.
- OpenCart voucher maps to `GiftVoucher`, not `DiscountCode`.
- OpenCart reward points map to `LoyaltyPointLedger`, not affiliate wallet.
- OpenCart transactions/store credit map to `StoreCreditLedger`, not affiliate payout ledger.
- OpenCart returns map to `ReturnRequest`.
- OpenCart downloads map to `DownloadAsset` and `DownloadEntitlement`.
- OpenCart order totals map to `src/lib/totals/totals-pipeline.ts`.
- OpenCart extensions/modules map to static TypeScript plugin interfaces.

## Existing Systems Preserved

- Product and ProductVariant remain canonical catalog models.
- Category and Collection remain canonical merchandising groupings.
- Cart remains server-trusted and session/customer scoped.
- Stripe Checkout remains the only active payment system.
- Stripe webhook idempotency remains unchanged.
- Affiliate commission idempotency remains unchanged.
- Inventory ledger remains the stock source of truth.
- Tenant resolution remains host/shop based.
- Hero Studio integration remains API/link/webhook based.

## Explicit Non-Goals

- No PHP runtime.
- No OpenCart code copying.
- No wholesale OpenCart schema import.
- No duplicate affiliate system.
- No replacement of Stripe checkout with OpenCart payment extension flow.
- No client-side trusted totals.
