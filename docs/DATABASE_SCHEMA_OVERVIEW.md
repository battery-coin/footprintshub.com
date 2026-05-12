# Database Schema Overview

The FootprintsHub commerce database is a shared Neon Postgres database with explicit shop scoping. Magento's quote/order/catalog separation is used as a reference, but the implementation is clean Prisma/TypeScript.

## Multi-Tenant Core

- `Shop`: tenant root for flagship, platform, and creator shops.
- `ShopDomain`: root domains, custom domains, and system subdomains.
- `ShopSetting`: scoped JSON settings such as shipping, tax, affiliate, security, and checkout behavior.
- `User`: platform/shop/admin/customer identity placeholder.
- `Customer`: shop-scoped buyer profile with Hero Studio mapping fields.
- `CustomerAddress`: reusable billing/shipping addresses.

## Catalog

- `Product`: shop-scoped product with type, status, visibility, SEO, inventory, preorder, token-gating, randomized-product, and digital-unlock fields.
- Product editor fields now include cost, barcode, vendor, tags, dimensions, taxable flag, fulfillment type, Printful mapping, affiliate eligibility, scheduled publishing, canonical URL, and badge toggles.
- `Brand`: OpenCart-inspired manufacturer/brand model for shop-scoped filtering and landing pages.
- `ProductOption` / `ProductOptionValue`: buyer-selectable options with required flags, price deltas, and SKU suffix support.
- `ProductVariant`: SKU-level pricing, cost, inventory, option values, image URL, tax flag, and Printful variant mapping.
- `ProductMedia`: gallery images or future video/media assets with primary image and optional variant assignment.
- `DiscountSchedule`: product, variant, category, or collection sale windows for percentage, fixed, and sale-price discounts.
- `ImportJob` / `ImportJobRow`: CSV/API/manual product import tracking and row-level diagnostics.
- `ProductReview`: moderated product review and rating records.
- `Category`: hierarchical navigation and filtering.
- `ProductCategory`: many-to-many category assignment.
- `Collection`: curated merchandising groups.
- `ProductCollection`: many-to-many collection assignment.
- `RelatedProduct`: related, upsell, and cross-sell links.
- `TaxClass`: taxable/non-taxable product classification.

## Cart / Quote

- `Cart`: active, converted, expired, or abandoned cart tied to shop, session, customer, and optional discount.
- `CartItem`: item quantity, trusted unit price snapshot, variant, and metadata.

Client localStorage is a convenience only. Server services recalculate prices and validate inventory.

## OpenCart-Inspired Customer Commerce

- `Wishlist` / `WishlistItem`: customer saved products.
- `CompareList` / `CompareItem`: guest/customer compare lists.
- `GiftVoucher`: voucher code and remaining balance.
- `StoreCreditLedger`: customer store-credit movements.
- `LoyaltyPointLedger`: customer reward point movements.
- `CustomerGroup`: structured customer group/tier model.

## Promotions

- `DiscountRule`: Magento-inspired promotion rule with scope, conditions, actions, date windows, priority, and free-shipping support.
- `DiscountCode`: coupon codes with usage limits, date windows, min subtotal, product/category/collection restrictions, affiliate attribution, and one-coupon-per-cart support.

Money is stored in integer cents. Percent values are basis points.

## Orders / Sales

- `Order`: historical checkout record with order number, statuses, totals, payment references, admin notes, and metadata.
- `OrderItem`: immutable product snapshot for historical reporting.
- `OrderAddress`: billing and shipping snapshots.
- `OrderHistory`: status/comment timeline with customer-visible flag.
- `Payment`: Stripe/manual/future Battery Coin payment records.
- `Refund`: refund and credit-memo foundation.
- `RefundItem`: line-level refund quantity, amount, and restock intent.
- `ReturnRequest`: RMA-style return, replacement, refund, and store-credit request workflow.
- `Shipment`: fulfillment and tracking foundation.
- `ShipmentItem`: item-level fulfillment records.
- `DownloadAsset` / `DownloadEntitlement`: digital download assets and customer/order access.

Order items must not be recalculated from live products after purchase.

## Inventory

- `InventoryLedger`: stock changes for initial adjustments, reservations, releases, paid deductions, restocks, refund adjustments, and manual changes.
- `StockLocation`: Medusa-inspired stock location for the shop's default warehouse or future creator/fulfillment locations.
- `InventoryItem`: SKU-level stock unit separate from product/variant display data.
- `ProductVariantInventoryItem`: links variants to one or more inventory items with required quantity.
- `InventoryLevel`: stocked, reserved, and available quantity by inventory item and location.
- `InventoryReservation`: temporary hold for checkout/order flows with release/deduct/expire status.

Inventory quantity remains on product/variant for fast reads, but every paid deduction should also create a ledger row with an idempotency key.

## Medusa-Inspired Market, Payment, Fulfillment, and Events

- `MarketRegion`: shop-scoped market settings for currency, supported countries, and tax-inclusive mode. This does not replace `Shop`.
- `SalesChannel`: where products are available, such as FootprintsHub Online Store, Hero Studio Marketplace, Creator Subdomain Shops, Campaign Pages, and Affiliate Landing Pages.
- `ProductSalesChannel`: many-to-many product/channel availability.
- `PaymentProviderConfig`: shop-scoped provider enablement and non-secret config for Stripe Checkout, manual, PayPal placeholder, and Battery Coin placeholder.
- `PaymentSession`: provider-neutral checkout/payment session with provider identifiers and idempotency key.
- `CryptoPayment`: Coinbase crypto checkout record with hosted URL, provider checkout ID, status, transaction hash, and safe provider metadata.
- `WalletConnection`: verified public wallet address metadata for identity and future token-gated utility.
- `WalletVerificationNonce`: single-use wallet signature challenges for EVM wallet verification.
- `PaymentCollection`: order-level payable/refundable amount grouping for future capture/refund workflows.
- `FulfillmentProvider`: shop-scoped fulfillment provider configuration.
- `PrintfulOrder`: Printful submission state, external IDs, idempotency key, request hash, request/response/error snapshots, recipient/items/shipping snapshots, confirmation policy, and sync timestamps.
- `PrintfulOrderItem`: Printful item-to-order-item mapping with product, variant, and provider variant IDs.
- `PrintfulWebhookEvent`: received Printful webhook payloads for processing and audit review.
- `ProviderIdempotencyKey`: provider-neutral idempotency scaffold for Printful and future provider retries.
- `ShippingProfile`: shipping behavior groups such as standard, digital, heavy, fragile, and collectible.
- `ShippingOption`: region/provider shipping choices returned to checkout.
- `Fulfillment` / `FulfillmentItem`: provider-neutral fulfillment records separate from shipment tracking history.
- `Promotion` / `PromotionRule` / `PromotionAction`: higher-level coupon, automatic, and campaign promotion engine.
- `CommerceEvent`: internal outbox for order, payment, inventory, affiliate, digital unlock, and Hero Studio webhook events.
- `IdempotencyKey`: generic idempotency table for workflows and API operations.

## Webhooks

- `WebhookEvent`: provider/event ID storage for idempotency, payload hash, status, error, and processed timestamp.

Stripe webhook processing now records events before mutating orders, payments, inventory, and affiliate commissions.

## Affiliate Ledger

Affiliate money is ledger-based:

- `AffiliateCommission`: pending/approved/paid/reversed/capped commission records.
- `AffiliateWalletLedger`: balance movement source of truth.
- `AffiliatePayout`: payout workflow.

Do not mutate affiliate balances without a ledger row.

## Affiliate Plan Layer

- `AffiliatePlan`: business model, attribution, active depth, caps, hold days, payout mode, lifetime attribution, and fraud defaults.
- `AffiliatePlanLevel`: level 0 through level 7 rates, bases, caps, rank requirements, and compression behavior.
- `AffiliatePerformanceTier`: monthly sales/order/commission tiers.
- `AffiliateQualificationSnapshot`: period metrics for rank/tier decisions.
- `LifetimeCustomerAttribution`: optional customer-to-affiliate assignment.

`AffiliateCommission` records plan, plan level, rank, tier, business model, cap, and compression metadata so reports can explain every amount created.

## Admin And Security

- `AdminAuditLog`: privileged admin and platform actions.
- `AdminRole` / `AdminUserRole`: OpenCart-inspired admin permission scaffolding for platform and shop roles.
- `AffiliateAuditLog`: affiliate-specific changes.
- `WebhookEvent`: replay protection and incident review.

PII, payout details, and internal tokens must not be exposed to frontend code.
