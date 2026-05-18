# FootprintsHub Commerce Architecture Canon

This is the canonical architecture ledger for FootprintsHub and its future Hero Studio commerce integration. Keep it updated when routes, components, schemas, workflows, deployment settings, or cross-repo contracts change.

## Canon Rules

- Treat this file as the map, not the implementation.
- Update the current-state sections when architecture moves.
- Append a dated snapshot for meaningful changes instead of overwriting history.
- Do not paste secrets, private URLs with tokens, API keys, wallet keys, seed phrases, Railway tokens, Cloudflare tokens, Stripe secrets, Printful secrets, or database credentials.
- Mark scaffolded or setup-required features honestly. Do not call a feature live until it is implemented, deployed, and tested.
- Battery Coin, NFT, token, and crypto language must stay utility/payment/access oriented. Avoid investment, ROI, profit, yield, appreciation, passive-income, staking-reward, or resale-value claims.

## Snapshot Protocol

Use this format whenever the architecture changes:

```md
### YYYY-MM-DD - Short Change Name

- Branch:
- Commit:
- Repo(s):
- Changed:
- New/removed routes:
- New/removed schema objects:
- Build/QA:
- Deployment:
- Risks:
- Follow-up:
```

Useful commands before recording a snapshot:

```powershell
git status --short --branch
git log -1 --oneline --decorate
rg --files src/app
rg --files src/components src/lib src/modules src/workflows prisma docs public
npm run typecheck
npm run lint
npm test
npm run build
```

## Repository Canon

### FootprintsHub

- Path: `C:\Users\saveo\OneDrive\Documents\GitHub\footprintshub.com`
- Remote: `https://github.com/battery-coin/footprintshub.com.git`
- Current branch at snapshot: `full-mvp-audit-polish`
- Current head at snapshot: `64583b32 Polish MVP setup states and QA docs`
- Framework: Next.js App Router, React 19, TypeScript
- Package manager: npm
- ORM/database: Prisma with Neon/Postgres target
- Hosting target: Railway
- DNS/security/storage target: Cloudflare DNS, WAF, R2 product media
- Payments: Stripe Checkout first; Coinbase crypto checkout remains future/disabled unless reviewed and configured
- Fulfillment: internal/manual MVP, Printful setup-ready but not live until credentials, mappings, paid-order tests, and status sync are verified

### Hero Studio

- Path: `C:\Users\saveo\OneDrive\Documents\GitHub\hero-reel-studio`
- Current branch at snapshot: `main`
- Current head at snapshot: `171f940 Break creator tier circular import warning`
- Framework: Vite React app with TypeScript, shadcn/Radix-style UI, React Router, Vite/Vitest/Playwright
- Server: `server/index.mjs`
- Future role: marketplace and creator/fan-club surface consuming or embedding FootprintsHub commerce capabilities
- Current local status at snapshot: dirty worktree in Hero Studio (`server/index.mjs`, `src/App.tsx`, untracked `package-lock.json`); this canon does not modify Hero Studio

## FootprintsHub Build Canon

```text
footprintshub.com
├─ app runtime: Next.js 16 App Router
├─ language: TypeScript
├─ UI: Tailwind CSS 4, local UI components, lucide icons
├─ database: Prisma Client, Postgres/Neon
├─ payment provider: Stripe Checkout
├─ media storage: Cloudflare R2 through S3-compatible client
├─ fulfillment: manual/internal first, Printful integration surface
├─ deploy: Railway, healthcheck /api/health
└─ scripts
   ├─ npm run dev
   ├─ npm run build
   ├─ npm run start
   ├─ npm run lint
   ├─ npm run typecheck
   ├─ npm test
   ├─ npm run prisma:generate
   ├─ npm run prisma:migrate
   └─ npm run prisma:seed
```

## FootprintsHub Component Tree

```text
src
├─ app
│  ├─ public storefront
│  │  ├─ /
│  │  ├─ /shop
│  │  ├─ /products
│  │  ├─ /products/[slug]
│  │  ├─ /collections
│  │  ├─ /collections/[slug]
│  │  ├─ /categories/[slug]
│  │  ├─ /brands/[slug]
│  │  ├─ /cart
│  │  ├─ /checkout
│  │  ├─ /checkout/success
│  │  ├─ /checkout/cancel
│  │  ├─ /contact
│  │  ├─ /support
│  │  ├─ /faq
│  │  ├─ /compare
│  │  ├─ /legal/[slug]
│  │  └─ /not-found
│  ├─ account
│  │  ├─ /account/orders
│  │  ├─ /account/orders/[id]
│  │  ├─ /account/downloads
│  │  ├─ /account/returns
│  │  ├─ /account/returns/new
│  │  ├─ /account/store-credit
│  │  ├─ /account/wishlist
│  │  └─ /account/loyalty
│  ├─ affiliate
│  │  ├─ /affiliate -> dashboard redirect
│  │  ├─ /affiliate/apply
│  │  ├─ /affiliate/dashboard
│  │  ├─ /affiliate/links
│  │  ├─ /affiliate/commissions
│  │  ├─ /affiliate/payouts
│  │  ├─ /affiliate/team
│  │  ├─ /affiliate/wallet
│  │  ├─ /affiliate/coupons
│  │  ├─ /affiliate/resources
│  │  ├─ /affiliate/assets
│  │  ├─ /affiliate/reports
│  │  └─ /affiliate/settings
│  ├─ admin
│  │  ├─ dashboard
│  │  ├─ products, product editor, imports, media upload
│  │  ├─ orders, refunds, returns, customers
│  │  ├─ inventory, fulfillment, Printful, shipping, tax, regions
│  │  ├─ discounts, promotions, marketing, reports
│  │  ├─ affiliates
│  │  │  ├─ applications, profiles, rules, payouts, reports
│  │  │  ├─ structures
│  │  │  └─ plans with levels, preview, binary, matrix, unilevel
│  │  ├─ settings: payments, shipping, legal
│  │  ├─ security
│  │  └─ audit logs
│  └─ api
│     ├─ health
│     ├─ products and store products
│     ├─ cart
│     ├─ checkout/create-session
│     ├─ webhooks/stripe
│     ├─ printful/webhook
│     ├─ tenant/store resolution
│     ├─ affiliate apply/click/track/payout request
│     └─ admin products/orders/refunds/affiliates/product-media
├─ components
│  ├─ admin: shell, affiliate pages, structure actions, product editor
│  ├─ affiliate: shell, metrics
│  ├─ cart: provider, drawer, button, add-to-cart
│  ├─ product: card and artwork
│  └─ ui: accordion, badge, button, card, empty state, input, setup panel, status badge, timeline
├─ lib
│  ├─ admin/auth
│  ├─ affiliate: attribution, commission, structures, schema compatibility, fraud, wallet, plans
│  ├─ auth: permissions, roles
│  ├─ cart, checkout, catalog, products
│  ├─ db/prisma
│  ├─ discounts, export, import
│  ├─ inventory, orders, returns, shipping, tax
│  ├─ money, pricing, totals
│  ├─ plugins
│  ├─ printful
│  ├─ security/audit-log
│  ├─ shops/default-shop
│  ├─ storage/r2
│  ├─ stripe
│  ├─ tenant resolver
│  ├─ url/utils
│  ├─ webhooks
│  └─ workflows runner
├─ modules
│  ├─ events
│  ├─ inventory
│  ├─ payments
│  └─ promotions
├─ workflows
│  ├─ affiliates
│  ├─ cart
│  ├─ checkout
│  ├─ digital-unlocks
│  ├─ inventory
│  ├─ notifications
│  ├─ orders
│  └─ payments
└─ proxy.ts
```

## FootprintsHub Data/Schema Tree

```text
prisma
├─ schema.prisma
│  ├─ shop/domain/customer/admin models
│  ├─ product/catalog/media/category/collection/variant models
│  ├─ cart/order/order-item/address/history/payment/webhook models
│  ├─ refund/refund-item/return/store-credit models
│  ├─ inventory ledger and stock models
│  ├─ affiliate program/plan/level/tree/click/attribution/commission/wallet/payout models
│  ├─ binary/matrix/unilevel affiliate configuration models
│  ├─ Printful order/status models
│  ├─ discount/promotion/loyalty/gift-voucher models
│  └─ audit/log/security supporting models
├─ seed.ts
└─ migrations
   └─ currently untracked in this workspace snapshot; review before applying to Neon
```

## FootprintsHub Documentation Tree

```text
docs
├─ architecture and final reports
│  ├─ ARCHITECTURE_CANON.md
│  ├─ FINAL_MVP_COMPLETION_REPORT.md
│  ├─ FULL_MVP_AUDIT_REPORT.md
│  ├─ ROUTE_MAP_AND_404_AUDIT.md
│  ├─ DESIGN_SYSTEM.md
│  ├─ MODULE_ARCHITECTURE.md
│  └─ WORKFLOW_ARCHITECTURE.md
├─ deployment/infrastructure
│  ├─ RAILWAY_DEPLOYMENT_READINESS.md
│  ├─ RAILWAY_CONFIG.md
│  ├─ CLOUDFLARE_R2_PRODUCT_MEDIA.md
│  ├─ NEON_SETUP_FOR_RAILWAY_TEMP.md
│  └─ DEPLOYMENT_RAILWAY_NEON_CLOUDFLARE.md
├─ commerce domains
│  ├─ CHECKOUT_FLOW.md
│  ├─ CART_TOTALS_PIPELINE.md
│  ├─ PAYMENT_AUDIT_AND_UPGRADE.md
│  ├─ REFUND_SYSTEM_AUDIT_AND_UPGRADE.md
│  ├─ INVENTORY_AUDIT_AND_UPGRADE.md
│  ├─ PRINTFUL_AUDIT_AND_UPGRADE.md
│  └─ PRODUCT_* docs
├─ affiliate system
│  ├─ AFFILIATE_SYSTEM_ARCHITECTURE.md
│  ├─ AFFILIATE_THREE_STRUCTURE_*.md
│  ├─ AFFILIATE_BINARY_PLAN.md
│  ├─ AFFILIATE_MATRIX_PLAN.md
│  ├─ AFFILIATE_UNILEVEL_PLAN.md
│  └─ AFFILIATE_* guardrails, rules, testing, final reports
├─ legal/security/QA
│  ├─ LEGAL_PAGE_AUDIT_AND_UPGRADE.md
│  ├─ SECURITY_AUDIT_AND_HARDENING.md
│  ├─ BUILD_AND_QA_REPORT.md
│  ├─ PLACEHOLDER_CLEANUP_REPORT.md
│  └─ SEO_PERFORMANCE_ACCESSIBILITY_AUDIT.md
├─ Hero Studio integration
│  ├─ HERO_STUDIO_INTEGRATION_READINESS.md
│  ├─ HERO_STUDIO_COMMERCE_INTEGRATION_PLAN.md
│  └─ HERO_STUDIO_AFFILIATE_INTEGRATION_PLAN.md
└─ references/legacy
   ├─ Medusa/OpenCart/Magento reference audits
   └─ legacy Magento environment/security notes
```

## Hero Studio Component Tree

Hero Studio is tracked here as the future consumer/platform repo. This file does not make Hero Studio changes.

```text
hero-reel-studio
├─ app
├─ components
├─ database
├─ docs
├─ lib
├─ mobile-app
├─ packages
├─ public
├─ scripts
│  ├─ audits
│  ├─ security
│  ├─ neon
│  └─ footprints seed helpers
├─ server
│  └─ index.mjs
├─ src
├─ supabase
├─ tests
├─ types
├─ vite.config.ts
├─ railway.json
├─ package.json
└─ architecture/history files
   ├─ ARCHITECTURE_MAP.md
   ├─ MIGRATION_DECISIONS.md
   ├─ MIGRATION_INVENTORY_REPORT.md
   └─ WAVE69_FANDOM_PLATFORM_PACK.md
```

## Cross-Repo Integration Canon

```text
FootprintsHub standalone store
├─ owns product, cart, checkout, order, refund, affiliate, media, Printful, and admin commerce logic
├─ exposes future commerce surfaces through routes/API contracts
├─ resolves flagship and future shop domains
└─ remains the source of truth for paid-order commerce events

Hero Studio platform
├─ owns creator, fan-club, storytelling, media, and marketplace experience
├─ will route shop.herostudio.org and creatorname.herostudio.org to commerce-backed shop records
├─ should consume FootprintsHub purchase/order/affiliate events through a reviewed bridge
└─ must not duplicate checkout/payment truth unless a platform service split is intentionally designed
```

## Source Of Truth Boundaries

- Product price truth: server-side FootprintsHub catalog/database.
- Cart total truth: FootprintsHub server cart/checkout logic.
- Payment truth: Stripe webhook for card payments; future Coinbase webhook/status verification for crypto.
- Affiliate commission truth: qualified paid purchase events after refund/chargeback rules.
- Refund truth: server-side refund workflow and provider event reconciliation.
- Printful truth: FootprintsHub order/fulfillment status plus Printful provider status after API setup.
- Media truth: product media records plus Cloudflare R2 object keys and public URL configuration.
- Shop/domain truth: FootprintsHub `Shop`/`ShopDomain` and tenant resolver.

## Current Architecture Snapshot

### 2026-05-17 - Architecture Canon Created

- Branch: `full-mvp-audit-polish`
- Commit: `64583b32 Polish MVP setup states and QA docs`
- Repo(s): FootprintsHub inspected and updated; Hero Studio inspected read-only
- Changed:
  - Added `docs/ARCHITECTURE_CANON.md`
  - Captured FootprintsHub route/component/lib/module/workflow/schema/build tree
  - Captured Hero Studio top-level component tree as future integration context
  - Added snapshot protocol for future review history
- New/removed routes: none
- New/removed schema objects: none
- Build/QA:
  - Last recorded FootprintsHub verification in `docs/BUILD_AND_QA_REPORT.md`: typecheck pass, lint pass, 63 tests pass, production build pass with 127 routes/pages
  - No new build was required for this docs-only canon change
- Deployment:
  - No Railway deployment performed by this change
  - Railway will continue using the configured branch/service unless this branch is merged or explicitly deployed
- Risks:
  - `prisma/migrations/` is untracked in this workspace snapshot and should be reviewed before Neon migration use
  - Hero Studio had unrelated local modifications at snapshot time and was not edited
- Follow-up:
  - Append a new snapshot after every major schema, route, payment, fulfillment, affiliate, or deployment change
  - Consider adding a generated route manifest script if this file starts drifting from the App Router tree
