# Magento To React Feature Gap Matrix

Legend:

- Status `yes`: implemented in code.
- Status `partial`: schema/service/page/docs exist, but production UX or provider integration remains.
- Status `no`: not implemented.

| Magento Feature | Magento Module / Area | Business Purpose | MVP? | Hero Studio? | Current React Status | Priority | Target | Notes |
|---|---|---:|---:|---:|---|---|---|---|
| Products | Catalog | Sell items | yes | yes | yes | P0 | schema/service/page | Product model and public/admin pages exist. |
| Variants/configurable products | ConfigurableProduct | Size/color/options | yes | yes | partial | P0 | schema/admin | Variant schema exists; full option UI deferred. |
| Simple products | Catalog | Basic merch | yes | yes | yes | P0 | schema/service | Supported. |
| Bundles | Bundle | Founder/supporter bundles | yes | yes | partial | P1 | schema/docs | Product type exists; bundle composition deferred. |
| Grouped products | GroupedProduct | Product grouping | no | maybe | partial | P3 | docs | Use collections first. |
| Downloadable/digital | Downloadable | Digital unlocks | yes | yes | partial | P1 | schema/service | Digital product and unlock schema exist. |
| Virtual/service products | Catalog | Memberships/services | yes | yes | partial | P1 | schema | Product types added. |
| Product attributes | EAV/Catalog | Flexible merchandising | yes | yes | partial | schema/docs | P1 | Metadata exists; first-class attribute UI deferred. |
| Media gallery | Catalog/MediaGallery | Product images | yes | yes | partial | schema/page | P1 | ProductMedia model added. |
| Categories | Catalog | Navigation/filtering | yes | yes | partial | schema/page | P0 | Category model and pages added. |
| Collections | CatalogWidget/custom | Curated merch groups | yes | yes | partial | schema/page | P0 | Collection model and pages added. |
| Related products | Catalog | Discovery | yes | yes | partial | schema | P2 | RelatedProduct model added. |
| Upsells/cross-sells | Catalog | Increase AOV | no | yes | partial | schema | P2 | RelatedProduct type supports them. |
| Search/filter/sort | CatalogSearch/LayeredNavigation | Catalog UX | yes | yes | partial | page/docs | P1 | Basic filtering by category/franchise; search deferred. |
| Visibility rules | Catalog | Hide/direct-link products | yes | yes | partial | schema | P1 | ProductVisibility added. |
| SEO metadata | CatalogUrlRewrite | SEO/social | yes | yes | partial | schema | P1 | SEO fields added. |
| Reviews/ratings | Review | Social proof | no | maybe | no | P3 | schema/page | Deferred. |
| Guest cart | Quote | Anonymous shopping | yes | yes | yes | P0 | API/client | Existing cart plus server validation. |
| Logged-in cart | Quote/Customer | Account shopping | no | yes | partial | schema/docs | P1 | Customer cart schema exists; auth deferred. |
| Cart merge after login | Quote/Customer | Account continuity | no | yes | no | P2 | service | Deferred until auth. |
| Cart totals | Quote/Checkout | Accurate pricing | yes | yes | yes | P0 | service/test | `calculateCartTotals`. |
| Coupon application | SalesRule | Promotions | yes | yes | partial | service/API | P1 | Discount service and API estimates exist. |
| Shipping estimate | Shipping/Quote | Checkout total | yes | yes | partial | service | P1 | Flat-rate estimate added. |
| Tax estimate | Tax | Checkout total | yes | yes | partial | service | P1 | Placeholder only; not tax advice. |
| Cart expiration | Quote | Cleanup | yes | yes | partial | schema | P1 | Cart status/expiresAt added. |
| Guest checkout | Checkout | Reduce friction | yes | yes | partial | API | P0 | Stripe Checkout route exists. |
| Shipping/billing address | Checkout/Customer | Fulfillment | yes | yes | partial | schema | P0 | OrderAddress/CustomerAddress added; checkout UI deferred. |
| Shipping method | Shipping | Fulfillment choice | yes | yes | partial | schema/service | P1 | ShippingMethod model and estimate service. |
| Payment method | Payment | Collect money | yes | yes | partial | Stripe | P0 | Stripe Checkout first. |
| Order review | Checkout | Buyer confidence | yes | yes | partial | page | P1 | Checkout page exists; deeper review deferred. |
| Fraud checks | Security/Payment | Risk control | yes | yes | partial | service/docs | P1 | Affiliate fraud helpers; payment fraud deferred to Stripe. |
| Terms acceptance | CheckoutAgreements | Legal consent | yes | yes | partial | schema/page | P1 | Order terms field and legal pages. |
| Order lifecycle | Sales | Operations | yes | yes | partial | schema/webhook | P0 | Expanded statuses and webhook paid update. |
| Invoices | Sales | Accounting | no | yes | no | P2 | schema/docs | Deferred. |
| Shipments | Shipping/Sales | Fulfillment | yes | yes | partial | schema/admin | P1 | Shipment models and admin scaffold. |
| Credit memos/refunds | Sales | Refunds | yes | yes | partial | schema/webhook docs | P1 | Refund model; handler placeholder. |
| Order notes | Sales | Support | yes | yes | partial | schema | P1 | `adminNotes`. |
| Customer accounts | Customer | Identity | no | yes | partial | schema/docs | P1 | User/Customer schema; auth deferred. |
| Customer addresses | Customer | Checkout speed | yes | yes | partial | schema | P1 | Added. |
| Customer groups/tags | Customer | Pricing/access | yes | yes | partial | schema | P1 | Fields added. |
| Creator/fan mapping | Customer | Hero Studio bridge | yes | yes | partial | schema/docs | P1 | Hero Studio IDs added. |
| Cart price rules | SalesRule | Discounts | yes | yes | partial | schema/service | P1 | DiscountRule and DiscountCode. |
| Catalog price rules | CatalogRule | Sale pricing | no | yes | partial | schema/docs | P2 | DiscountRule scope supports catalog; no evaluator yet. |
| Usage limits | SalesRule | Abuse prevention | yes | yes | partial | schema | P1 | Fields added. |
| Free shipping rules | SalesRule/Shipping | Promotion | yes | yes | partial | schema/service | P2 | Discount type added. |
| Inventory quantity | CatalogInventory | Stock | yes | yes | yes | P0 | schema/service | Existing plus validation. |
| Backorders | CatalogInventory | Preorder/oversell | yes | yes | partial | schema/service | P1 | Fields and validation. |
| Low stock threshold | CatalogInventory | Ops alerts | yes | yes | partial | schema | P1 | Fields added. |
| Inventory ledger | Inventory | Audit stock changes | yes | yes | partial | schema/service | P0 | Added. |
| Reservations | Inventory | Prevent oversell | yes | yes | partial | schema/docs | P1 | Ledger type exists; reservation flow deferred. |
| Flat rate shipping | Shipping | Simple fulfillment | yes | yes | partial | service/schema | P1 | Added. |
| Tracking numbers | Shipping/Sales | Customer support | yes | yes | partial | schema/admin | P1 | Shipment fields added. |
| Tax classes | Tax | Tax setup | yes | yes | partial | schema/service | P1 | Added. |
| Stripe Checkout | Payment | Payments | yes | yes | yes | P0 | API | Implemented. |
| Webhook idempotency | Webapi/Payment | Safe retries | yes | yes | yes | P0 | schema/service | WebhookEvent added. |
| Refund handling | Payment/Sales | Reversals | yes | yes | partial | schema/docs | P1 | Refund model; full Stripe refund event deferred. |
| Admin dashboard | Backend | Operations | yes | yes | partial | pages | P0 | Multiple admin pages. |
| Product CRUD | Catalog/Admin | Manage products | yes | yes | partial | pages/API | P0 | Pages/API scaffold; full forms deferred. |
| Category/collection CRUD | Catalog/Admin | Merchandising | yes | yes | partial | pages/schema | P1 | Pages/schema added. |
| Orders dashboard | Sales/Admin | Operations | yes | yes | partial | page/schema | P0 | Existing scaffold plus schema. |
| API/headless | Webapi/GraphQl | Integrations | yes | yes | partial | API/docs | P1 | REST-style routes; GraphQL deferred. |
| Multi-store | Store | Shop isolation | yes | yes | partial | schema/resolver | P0 | ShopDomain and tenant resolver exist. |
| ACL/admin roles | Authorization/User | Security | yes | yes | partial | schema/docs | P1 | UserRole enum; enforcement deferred. |
| CSP | Csp | Browser hardening | yes | yes | partial | config/docs | P1 | Security headers added; production CSP needs review. |
| 2FA | TwoFactorAuth | Admin protection | no | yes | no | P2 | docs | Use Auth.js/Clerk/passkeys later. |
| ReCaptcha | ReCaptcha* | Bot control | no | yes | no | P2 | docs/provider | Deferred provider integration. |
| Security.txt | Securitytxt | Disclosure | yes | yes | docs | P2 | route/docs | Documented; route deferred. |
| Affiliate terms | Custom | Legal | yes | yes | yes | P0 | pages/docs | Added prior pass. |
| Blind box odds | Custom | Randomized collectible compliance | yes | yes | partial | legal/page | P1 | Legal page added; per-product odds still required. |
| Battery Coin checkout | Custom | Future utility payment | no | yes | no | P3 | docs | Placeholder only. |
