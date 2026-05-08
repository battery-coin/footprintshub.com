# Hero Studio Bridge Plan

## Boundary

Hero Studio must not contain the Magento application directly.

Hero Studio should connect to Footprints Hub Store through links, APIs, webhooks, product cards, checkout redirects, and future headless commerce integration.

## System Ownership

Hero Studio remains:

- fan platform
- audition platform
- campaign platform
- creator platform
- social/feed platform
- fan club system

Footprints Hub Magento becomes:

- product catalog
- cart
- checkout
- payments
- customer orders
- shipping
- inventory
- product promotions
- coupons
- commerce admin

## Allowed Integration Paths

- Store navigation link
- product cards
- commerce service wrapper
- Checkout redirects
- Magento REST API
- Magento GraphQL API
- Signed Magento webhooks
- Product feed components
- Customer/order ownership verification
- future blind box reveal event
- future Battery Coin checkout
- Future digital unlock bridge

## Hero Studio Environment Variables

Use these placeholders in Hero Studio later. Never expose server-only tokens to frontend code.

```env
NEXT_PUBLIC_STORE_URL=https://footprintshub.com
NEXT_PUBLIC_MAGENTO_BASE_URL=https://footprintshub.com
MAGENTO_API_BASE_URL=https://footprintshub.com/rest/V1
MAGENTO_GRAPHQL_URL=https://footprintshub.com/graphql
MAGENTO_WEBHOOK_SECRET=replace_me
MAGENTO_INTEGRATION_TOKEN=replace_me_never_commit
```

`MAGENTO_INTEGRATION_TOKEN` must stay server-only.

## Deferred Work

Do not deeply integrate Hero Studio until this repository has:

- Repository created
- Magento foundation committed
- Install plan completed
- Security package audited
- Store blueprint completed
- Basic product/category plan completed
- Deployment plan completed

## Hero Studio Repo Note

No Hero Studio files were changed during the Magento local readiness pass. The Magento application remains only in the Footprints Hub store repository.
