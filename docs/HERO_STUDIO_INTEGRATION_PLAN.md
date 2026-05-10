# Hero Studio Integration Plan

FootprintsHub commerce is built standalone first.

## Phase 1

Primary store:

```text
https://footprintshub.com
```

Responsibilities:

- Product catalog
- Cart
- Stripe Checkout
- Orders
- Discounts
- Customer purchase records
- Digital unlock records

## Phase 2

Hero Studio platform commerce:

```text
https://shop.herostudio.org
https://creatorname.herostudio.org
```

Hero Studio remains:

- Fan platform
- Audition platform
- Campaign platform
- Creator platform
- Social/feed platform
- Fan club system

FootprintsHub commerce becomes:

- Shop engine
- Creator product catalog
- Checkout engine
- Order ledger
- Digital unlock issuer
- Creator payout source of truth

## Integration Points

- Store nav link
- Product cards
- Creator profile Shop tab
- Campaign product cards
- Fan club product cards
- Checkout redirects to the shop engine
- Shared user identity later
- Shared creator/shop ID mapping
- Signed purchase webhooks
- Digital unlocks back into Hero Studio accounts
- Creator affiliate and fan ambassador referral links
- Purchase webhooks that unlock Hero Studio badges, fan-club access, or campaign rewards
- Future creator payout and affiliate payout reconciliation

## Required Hero Studio Environment Variables Later

```text
NEXT_PUBLIC_STORE_URL=https://footprintshub.com
NEXT_PUBLIC_COMMERCE_BASE_URL=https://footprintshub.com
COMMERCE_API_BASE_URL=https://footprintshub.com/api
COMMERCE_WEBHOOK_SECRET=replace_me
COMMERCE_SERVICE_TOKEN=replace_me_never_commit
NEXT_PUBLIC_AFFILIATE_REF_PARAM=ref
```

Never expose `COMMERCE_SERVICE_TOKEN` to frontend code.

## Affiliate Bridge Later

Hero Studio should link into FootprintsHub commerce instead of embedding commerce logic directly. Creator profile pages, campaigns, fan clubs, and product cards can append `?ref=CODE` to store URLs after a creator or fan ambassador is approved for the relevant shop.

Future Hero Studio webhook handling should listen for:

- Paid order
- Refunded order
- Digital unlock issued
- Affiliate commission pending
- Affiliate commission approved
- Payout paid

## Current Pass

Do not deeply modify `hero-reel-studio` yet. This repository owns the commerce engine first.
