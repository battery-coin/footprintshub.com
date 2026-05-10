# Database Audit And Gap Fixes

## ORM

The project uses Prisma with Postgres/Neon. The schema already contains shop-aware commerce models for products, variants, media, categories, collections, carts, orders, payments, webhook events, inventory, discounts, affiliates, commission rules, payout ledgers, events, fulfillment, promotions, and customer features.

## Models Added In This Pass

- `RefundItem`: itemizes refund quantities, refund amount, and restock intent per order item.
- `PrintfulOrder`: records Printful submission state, external IDs, idempotency key, request hash, errors, and metadata.
- `PrintfulOrderStatus`: captures configuration-required, pending, submitted, accepted, failed, cancelled, and fulfilled states.

## Important Existing Models

- `Shop` and `ShopDomain` scope tenant behavior.
- `Order` and `OrderItem` store order snapshots.
- `WebhookEvent` and `IdempotencyKey` support webhook retry safety.
- `InventoryLedger` and inventory reservation models support stock movement records.
- `AffiliateCommission` and `AffiliateWalletLedger` keep affiliate money movement ledger-based.

## Money And Percentages

- Money values use integer cents.
- Percentages use basis points in commission and discount systems.
- Currency remains stored on money-bearing records.

## Remaining Schema Work

- Add migrations after this schema is reviewed against the target Neon database.
- Connect refund execution to Stripe refund IDs and proportional affiliate reversal.
- Connect Printful submission records to the paid-order workflow.

