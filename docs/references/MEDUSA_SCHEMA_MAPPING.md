# Medusa Schema Mapping

| Medusa Concept | FootprintsHub Model | Status | Notes |
|---|---|---|---|
| Store | `Shop` | existing | Tenant identity and shop ownership. |
| Store domain | `ShopDomain` | existing | Cloudflare/Railway routing target. |
| Sales channel | `SalesChannel`, `ProductSalesChannel` | added | Product visibility surface, not tenant identity. |
| Region | `MarketRegion` | added | Currency/country/tax/payment/shipping availability. |
| Product | `Product` | existing | Already enriched by Magento/OpenCart work. |
| Variant | `ProductVariant` | existing | Added links to inventory items. |
| Product option | `ProductOption`, `ProductOptionValue` | existing | OpenCart-derived option layer. |
| Cart | `Cart`, `CartItem` | existing | Existing API remains canonical. |
| Payment provider | `PaymentProviderConfig` | added | Named differently to avoid enum conflict with existing `PaymentProvider`. |
| Payment session | `PaymentSession` | added | Stripe Checkout session abstraction. |
| Payment collection | `PaymentCollection` | added | Future capture/refund grouping. |
| Order | `Order`, `OrderItem` | existing | Existing lifecycle remains canonical. |
| Fulfillment | `Fulfillment`, `FulfillmentItem` | added | Provider-neutral fulfillment records. |
| Shipment | `Shipment`, `ShipmentItem` | existing | Tracking history remains available. |
| Inventory item | `InventoryItem` | added | SKU/stock unit separate from product variant. |
| Stock location | `StockLocation` | added | One default location for MVP; multi-location later. |
| Inventory level | `InventoryLevel` | added | Stocked/reserved/available quantity per location. |
| Reservation item | `InventoryReservation` | added | Checkout holds and release/deduct lifecycle. |
| Promotion | `Promotion` | added | Wrapper for coupon/automatic/campaign promotions. |
| Promotion rule/action | `PromotionRule`, `PromotionAction` | added | Rule/action scaffold; existing discounts remain live. |
| Event bus/outbox | `CommerceEvent` | added | Durable event record for future worker. |
| Idempotency key | `IdempotencyKey` | added | Generic idempotency across workflows/API/webhooks. |
| Webhook event | `WebhookEvent` | existing | Stripe webhook idempotency remains canonical for raw provider events. |
| Affiliate commission | Affiliate models | existing | Affiliate engine remains canonical; events can trigger it. |

## Design Notes

- All new commerce models are shop-aware where they touch tenant data.
- No new model stores card data or raw payment credentials.
- Provider config JSON must not contain plaintext secrets in production; use environment variables or encrypted config.
- Money remains integer cents. Percentages remain basis points.
- `CommerceEvent` is an outbox table, not a replacement for `WebhookEvent`.
