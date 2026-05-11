# Admin Control Panel Link Audit

Date: 2026-05-11

## Summary

Every main admin sidebar route exists and renders. The remaining distinction is whether each section has deep production persistence or an MVP configuration/editor state.

| Link label | Route | File exists | Page renders | Editable values | Saves to database | API route exists | Validation exists | Missing pieces | Priority | Action taken |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Overview | `/admin` | yes | yes | partial | partial via settings API | `/api/admin/settings` | Zod | Dashboard widgets need deeper user preference model | P1 | Added settings model/API foundation |
| Products | `/admin/products` | yes | yes | yes | yes after migration | `/api/admin/products` | Zod | Needs Neon migration applied | P0 | Already upgraded |
| New product | `/admin/products/new` | yes | yes | yes | yes after migration | `/api/admin/products` | Zod | Needs Neon migration applied | P0 | Already upgraded with R2 upload |
| Product detail | `/admin/products/[id]` | yes | yes | yes | yes after migration | `/api/admin/products/[id]` | Zod | Needs Neon migration applied | P0 | Already upgraded |
| Categories | `/admin/categories` | yes | yes | partial | settings/model scaffold | `/api/admin/settings` | Zod | Dedicated category edit API still recommended | P1 | Edit actions present |
| Collections | `/admin/collections` | yes | yes | partial | settings/model scaffold | `/api/admin/settings` | Zod | Dedicated collection edit API still recommended | P1 | Edit actions present |
| Orders | `/admin/orders` | yes | yes | partial | partial | `/api/admin/orders` | guarded | Full order state transitions need provider wiring | P0 | Route renders |
| Order detail | `/admin/orders/[id]` | yes | yes | partial | partial | `/api/admin/orders` | guarded | Full notes/timeline API recommended | P0 | Route renders |
| Refunds | `/admin/refunds` | yes | yes | partial | `/api/admin/refunds` | `/api/admin/refunds` | Zod | Stripe refund execution depends on config | P0 | Route renders |
| Refund detail | `/admin/refunds/[id]` | yes | yes | scaffold | partial | `/api/admin/refunds` | Zod | Dedicated detail persistence can be expanded | P0 | Added missing route |
| Returns | `/admin/returns` | yes | yes | scaffold | partial | settings scaffold | Zod via settings | Dedicated return API recommended | P1 | Route renders |
| Return detail | `/admin/returns/[id]` | yes | yes | scaffold | partial | settings scaffold | Zod via settings | Dedicated return API recommended | P1 | Route renders |
| Inventory | `/admin/inventory` | yes | yes | partial | inventory service/schema | existing modules | TypeScript validation | Deeper admin adjustment API recommended | P0 | Route renders |
| Printful | `/admin/printful` | yes | yes | partial | env/status + settings scaffold | settings scaffold | Zod via settings | Requires Printful credentials | P1 | Route renders |
| Fulfillment | `/admin/fulfillment` | yes | yes | partial | schema scaffold | settings scaffold | Zod via settings | Provider integrations pending | P1 | Route renders |
| Shipping options | `/admin/shipping-options` | yes | yes | partial | schema/settings scaffold | settings scaffold | Zod via settings | Dedicated shipping option CRUD recommended | P1 | Route renders |
| Promotions | `/admin/promotions` | yes | yes | partial | promotion/schema scaffold | settings scaffold | Zod via settings | Advanced rules pending | P1 | Route renders |
| Sales channels | `/admin/sales-channels` | yes | yes | partial | schema/settings scaffold | settings scaffold | Zod via settings | Dedicated CRUD recommended | P1 | Route renders |
| Regions | `/admin/regions` | yes | yes | partial | schema/settings scaffold | settings scaffold | Zod via settings | Dedicated CRUD recommended | P1 | Route renders |
| Shops | `/admin/shops` | yes | yes | partial | shop schema | settings scaffold | Zod via settings | Multi-shop UI can deepen later | P1 | Route renders |
| Discounts | `/admin/discounts` | yes | yes | partial | discount schema | discount pages/API scaffold | partial | Advanced usage limits pending | P0 | Route renders |
| Shipping | `/admin/shipping` | yes | yes | partial | settings scaffold | `/api/admin/settings` | Zod | Carrier integrations pending | P0 | Route renders |
| Tax | `/admin/tax` | yes | yes | partial | tax class/settings scaffold | `/api/admin/settings` | Zod | Production tax provider pending | P0 | Route renders |
| Customers | `/admin/customers` | yes | yes | partial | customer schema scaffold | settings scaffold | Zod via settings | Auth/customer profile API pending | P1 | Route renders |
| Customer detail | `/admin/customers/[id]` | yes | yes | scaffold | partial | settings scaffold | Zod via settings | Dedicated profile API pending | P1 | Added missing route |
| Affiliates | `/admin/affiliates` | yes | yes | yes | yes after migration | affiliate APIs | Zod | Binary/Matrix payout engines scaffolded | P0 | Active level editor repaired |
| Events | `/admin/events` | yes | yes | filter/retry scaffold | event schema | settings scaffold | Zod via settings | Async worker pending | P1 | Route renders |
| Audit logs | `/admin/audit-logs` | yes | yes | filters only | audit schema | read scaffold | n/a | Export can be added later | P1 | Route renders |
| Security | `/admin/security` | yes | yes | partial | settings/env status | settings scaffold | Zod via settings | Full RBAC pending | P0 | Route renders |
| Settings | `/admin/settings` | yes | yes | yes | ShopSetting/PlatformSetting | `/api/admin/settings` | Zod | Needs migration applied | P0 | Added settings persistence model/API |

## Result

No listed admin sidebar route should 404. Editable production depth varies by area; product and affiliate plan controls are the most complete. Generic settings persistence now exists for admin configuration that does not deserve a dedicated model yet.
