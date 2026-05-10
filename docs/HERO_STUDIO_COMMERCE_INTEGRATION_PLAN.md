# Hero Studio Commerce Integration Plan

FootprintsHub commerce remains a standalone Next.js/Railway/Neon/Stripe app. Hero Studio should integrate through links, APIs, signed webhooks, and embeds.

## Integration Surfaces

- Main nav Store link.
- Creator profile Shop tab.
- Fan club Shop tab.
- Campaign product embeds.
- Matrix Decoded collectible embeds.
- Footprints supporter bundle embeds.
- Product promo cards.
- Checkout redirects.
- Purchase webhooks back into Hero Studio.
- Digital unlock events back into Hero Studio.
- Fan tier upgrades after purchase.
- Affiliate referral attribution across store and creator domains.

## Shared Identity Fields

Commerce schema includes:

- `User.heroStudioUserId`
- `Customer.heroStudioUserId`
- `Customer.verifiedFanId`
- `Shop.ownerUserId`
- future creator/shop mapping metadata

## Commerce Webhooks To Hero Studio

Future signed events:

- `order.paid`
- `order.refunded`
- `digital_unlock.created`
- `membership.purchased`
- `fan_tier.upgraded`
- `affiliate.commission_pending`
- `affiliate.commission_approved`
- `affiliate.commission_created`
- `creator_product.sold`
- `campaign_supporter_purchased`

## Required Hero Studio Environment Variables

```text
NEXT_PUBLIC_STORE_URL=https://footprintshub.com
NEXT_PUBLIC_COMMERCE_API_URL=https://footprintshub.com/api
COMMERCE_WEBHOOK_SECRET=replace_me
COMMERCE_INTERNAL_API_TOKEN=replace_me_never_commit
```

Never expose `COMMERCE_INTERNAL_API_TOKEN` to frontend code.

## Do Not Do

- Do not copy Magento into Hero Studio.
- Do not copy FootprintsHub commerce logic directly into Hero Studio.
- Do not expose Stripe secret keys or internal commerce tokens in Hero Studio frontend bundles.
- Do not make Battery Coin payment claims before legal and payment review.

## OpenCart-Derived Creator Shop Features

For future Hero Studio creator shops, the OpenCart reference adds useful shop-level foundations:

- shop settings, logo, banner, contact, currency, and metadata
- brands/manufacturers for creator collections
- product options for merch sizes, colors, editions, and add-ons
- reviews and moderation
- wishlists and compare lists
- gift vouchers, store credit, and loyalty points
- return/RMA requests
- download entitlements for digital goods
- information pages and legal content per shop
- admin staff roles and permissions
- reports for sales, products, customers, and affiliates

These must remain scoped by `Shop` and `ShopDomain`; do not manually create each creator subdomain in SiteGround.

## Medusa-Inspired Commerce Layer

The Medusa reference adds modern architecture patterns for the Hero Studio phase:

- `SalesChannel` separates product availability from shop ownership.
- `MarketRegion` allows creator shops to inherit USD/US defaults now and expand later.
- `PaymentSession` and `PaymentProviderConfig` keep Stripe Checkout first while leaving room for future providers.
- `InventoryReservation` supports checkout holds before paid order deduction.
- `Fulfillment` and `ShippingOption` support creator shop fulfillment rules and future providers.
- `CommerceEvent` gives Hero Studio a clean signed-webhook source for purchases, digital unlocks, memberships, fan tier updates, affiliate commissions, and campaign support events.

Each creator shop should eventually get:

- shop and shop domain
- default market region
- default sales channel
- product catalog and channel visibility
- payment provider settings
- shipping profile and shipping options
- affiliate program and commission plan
- admin staff roles
- event/webhook configuration back to Hero Studio
