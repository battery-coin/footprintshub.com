# Medusa Conflict Avoidance Plan

## Main Rule

Medusa is a reference blueprint only. FootprintsHub remains a custom Next.js, TypeScript, Prisma, Neon/Postgres, Stripe, Railway, and Cloudflare commerce engine.

## Mapping Rules

- Medusa Store/Sales Channel concepts map to `Shop`, `ShopDomain`, `MarketRegion`, and `SalesChannel`.
- Medusa Product/Variant concepts map to existing `Product` and `ProductVariant`.
- Medusa Cart maps to existing `Cart` and `CartItem`.
- Medusa Payment Collection and Payment Session map to new provider-neutral `PaymentCollection` and `PaymentSession`.
- Medusa Order maps to existing `Order`, `OrderItem`, `Payment`, `Refund`, `Shipment`, `OrderHistory`, and new `Fulfillment`.
- Medusa Region maps to `MarketRegion`; it must not replace `Shop`.
- Medusa Promotion maps to `Promotion`, `PromotionRule`, and `PromotionAction`; existing `DiscountCode` remains the MVP coupon table.
- Medusa Workflow maps to the lightweight `src/lib/workflows` runner, not a full Medusa dependency.
- Medusa Modules map to local `src/modules/*` TypeScript domain modules.
- Medusa Events/Subscribers map to `CommerceEvent` plus local event bus/subscriber scaffolds.

## Conflict Risks Avoided

- No Medusa runtime dependency was added.
- No Medusa source code was copied into the app.
- Existing product/cart/order/affiliate/Stripe routes remain intact.
- Existing OpenCart-derived `ShippingMethod`, `DiscountCode`, `DiscountRule`, `ReturnRequest`, `StoreCreditLedger`, and `GiftVoucher` models were not duplicated.
- The existing affiliate 7-level commission engine remains canonical for commissions.
- The existing totals pipeline remains canonical for cart/order totals.
- Stripe Checkout remains the first live payment provider.
- `Shop` remains tenant identity; `MarketRegion` only describes market/payment/shipping/tax availability.

## Implementation Boundaries

- `PaymentSession` stores provider checkout/session identifiers and idempotency metadata.
- `PaymentCollection` groups payable/refundable order amounts for future capture/refund workflows.
- `SalesChannel` controls product visibility across FootprintsHub, Hero Studio marketplace, creator shops, campaign pages, and affiliate landing pages.
- `InventoryReservation` is for temporary holds; `InventoryLedger` remains the money-safe stock history.
- `Fulfillment` is the provider-neutral fulfillment record; existing `Shipment` remains shipment/tracking history.
- `Promotion` is a future higher-level wrapper; existing discounts continue to power the current cart.

## Before Any Future Merge

- Run Prisma generate, typecheck, tests, lint, and build.
- Confirm admin pages do not expose server-only data.
- Confirm checkout still recalculates prices server-side.
- Confirm webhook idempotency still prevents duplicate paid-order effects.
- Confirm affiliate commission idempotency still prevents duplicate ledger entries.
- Confirm tenant resolver behavior stays unchanged for `footprintshub.com`, `shop.herostudio.org`, and creator subdomains.
