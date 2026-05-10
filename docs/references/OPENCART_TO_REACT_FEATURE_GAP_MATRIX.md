# OpenCart To React Feature Gap Matrix

| OpenCart Feature | OpenCart Area / Folder | Business Purpose | Already in FootprintsHub? | Magento gap covered? | Conflict risk | Multi-tenant impact | MVP? | Hero Studio? | Priority | Target | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Store settings | admin/model/setting | Shop identity and defaults | partial | partial | low | shop scoped | yes | yes | P0 | schema/docs | Existing `Shop`/`ShopSetting`; avoid duplicate store model. |
| Multi-store | setting/store | Multiple storefronts | yes | yes | medium | maps to `Shop`/`ShopDomain` | yes | yes | P0 | docs | Keep existing tenant resolver. |
| Manufacturers | catalog/manufacturer | Brand pages/filtering | no | partial | low | shop scoped | yes | yes | P1 | schema/page | Added `Brand`. |
| Product options | catalog/option | Selectable buyer options | partial | yes | medium | shop/product scoped | yes | yes | P1 | schema | Added `ProductOption`/`ProductOptionValue`; variants remain trusted SKU layer. |
| Reviews | catalog/review | Social proof/moderation | no | partial | low | shop/product scoped | no | yes | P1 | schema/page | Added moderation model. |
| Wishlist | account/wishlist | Save products | no | no | low | shop/customer scoped | no | yes | P1 | schema/page | Added account route and schema. |
| Compare | product/compare | Product comparison | no | no | low | shop/session scoped | no | optional | P2 | schema/page | Added scaffold. |
| Specials | product/special | Sale/featured products | partial | yes | low | product scoped | yes | yes | P1 | service/docs | Existing compare-at price and discount rules. |
| Downloads | account/download/catalog/download | Digital fulfillment | partial | yes | low | shop/customer/order scoped | yes | yes | P1 | schema/page | Added download asset/entitlement. |
| Gift vouchers | marketing/order totals | Gift/store value | no | no | medium | shop scoped | no | yes | P1 | schema/totals | Added voucher model and totals step. |
| Reward points | account/reward | Loyalty program | no | no | medium | shop/customer scoped | no | yes | P2 | schema/totals | Added `LoyaltyPointLedger`. |
| Store credit | account/transaction | Customer balance | no | partial | medium | shop/customer scoped | no | yes | P1 | schema/totals | Added ledger separate from affiliate wallet. |
| Returns | sale/returns/account/returns | RMA workflow | partial | partial | low | shop/order scoped | yes | yes | P1 | schema/routes/service | Added `ReturnRequest`. |
| Order history | sale/order | Status/comment audit | partial | yes | low | shop/order scoped | yes | yes | P0 | schema/service | Added `OrderHistory`. |
| Info pages | catalog/information | Content/legal pages | partial | no | low | shop scoped | yes | yes | P2 | schema/routes | Added `InformationPage`. |
| Banners | design/banner | Merchandising modules | no | no | low | shop scoped | no | yes | P2 | schema/routes | Added `Banner`. |
| Localization | localisation/* | Countries/zones/tax/units | partial | partial | medium | mostly global + shop rules | yes | yes | P2 | schema/docs | Added currencies/countries/zones/geo/tax/unit models. |
| Admin permissions | user/user_group | Role access control | partial | yes | medium | platform/shop scoped | yes | yes | P0 | schema/service/docs | Added `AdminRole`, `AdminUserRole`, helpers. |
| Extension modules | extension/* | Pluggable commerce services | no | partial | medium | platform/shop scoped | no | yes | P2 | service/docs | Added static TypeScript plugin registry. |
| Reports | report/* | Business visibility | partial | partial | low | shop/platform scoped | no | yes | P2 | routes/docs | Added report route scaffolds. |
| Newsletter | marketing/contact/account/newsletter | Consent marketing | no | no | medium | shop/customer scoped | no | yes | P2 | docs | Documented; provider later. |
| Payment extensions | extension/payment | Provider flexibility | partial | yes | high | shop scoped | yes | yes | P3 | plugin | Keep Stripe Checkout first. |
| Shipping extensions | extension/shipping | Provider flexibility | partial | yes | medium | shop scoped | yes | yes | P3 | plugin | Flat rate first. |
| Order total extensions | extension/total | Ordered total calculations | partial | no | medium | server scoped | yes | yes | P0 | service | Added totals pipeline. |
