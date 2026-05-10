# Hero Studio Affiliate Integration Plan

FootprintsHub remains the standalone commerce engine first. Hero Studio later connects through links, APIs, webhooks, product cards, and checkout redirects.

## Future Domains

- `footprintshub.com`: flagship store.
- `shop.herostudio.org`: Hero Studio marketplace.
- `creatorname.herostudio.org`: creator/fan-club shop.

## Shop-Specific Affiliate Programs

Each shop can have:

- its own `AffiliateProgram`
- one or more `AffiliatePlan` records
- plan levels 0-7
- creator-specific commission rules
- product/category/campaign overrides
- payout policy
- fraud controls
- reports

## Hero Studio Touchpoints

- Creator profile Shop tab.
- Fan club Shop tab.
- Campaign product embeds.
- ProductPromoCard with `?ref=CODE`.
- Purchase webhook back to Hero Studio.
- Digital unlock webhook back to Hero Studio.
- Shared creator/shop ID mapping.
- Cross-domain affiliate attribution.

## Environment Variables

- `NEXT_PUBLIC_STORE_URL`
- `NEXT_PUBLIC_COMMERCE_API_URL`
- `COMMERCE_WEBHOOK_SECRET`
- `COMMERCE_INTERNAL_API_TOKEN`

Never expose `COMMERCE_INTERNAL_API_TOKEN` to frontend code.
