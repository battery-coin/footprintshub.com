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
