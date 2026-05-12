# FootprintsHub Commerce

Custom Next.js ecommerce application for FootprintsHub and the future Hero Studio creator shop engine.

This branch pivots away from Magento and builds a lighter open-source commerce stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- Neon Postgres
- Stripe Checkout
- Native affiliate and ambassador commissions
- Railway hosting
- Cloudflare DNS, SSL, WAF, R2 product media, and future wildcard shop routing

## Current Scope

FootprintsHub is the flagship standalone shop at `footprintshub.com`.

Hero Studio commerce comes later through shared shop IDs, product cards, checkout redirects, webhooks, and digital unlock events. Magento is not embedded in Hero Studio.

## Development

```powershell
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment

Copy `.env.example` to `.env.local` and fill in local values. Never commit `.env`, Stripe secrets, Neon credentials, or production secrets.

## Key Scripts

```powershell
npm run dev
npm run build
npm run lint
npm run typecheck
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Safety

The app never trusts client-side prices at checkout. Checkout routes recalculate line items from the server catalog/database before creating a Stripe Checkout Session.

Affiliate commissions are calculated server-side after paid orders. The program is framed as a multi-tier affiliate and ambassador system tied only to qualified purchases, not recruiting-only compensation.

## Product Management

The admin product editor at `/admin/products/new` and `/admin/products/[id]` supports Shopify-style product setup: Cloudflare R2 image upload, media URLs, variants/options, pricing, cost and margin, inventory, tax/shipping/fulfillment settings, Printful mapping fields, scheduled discounts, SEO, CSV import, API import preview/import, and CSV export.

The editor also adapts by product type. Service products show service delivery settings, digital download products show secure download settings, subscription and membership products show recurring billing settings, NFT-linked products show claim/provenance/legal fields, and bundle products show hybrid fulfillment notes. NFT-linked products must be described as digital collectibles, certificates, access credentials, claims, or digital twins, not investments.

## Ad Sales

FootprintsHub now supports internal ad packages and sponsorship products through the same product, cart, checkout, order, affiliate, refund, and reporting foundation. Public buyers can start at `/ads` or `/ads/buy`; admins manage review and operations at `/admin/ads`.

Ad products are reviewed placements, sponsorships, creator/fan-club promotions, campaign boosts, newsletter ads, banners, video spotlights, and featured listings. They do not promise guaranteed impressions, clicks, conversions, or sales unless a specific package expressly states a deliverable.

Before using the editor against Neon, generate and review a Prisma migration for the product schema additions, then apply it to the target database.

For product media uploads, configure the `CLOUDFLARE_R2_*` Railway variables described in `docs/CLOUDFLARE_R2_PRODUCT_MEDIA.md`.
