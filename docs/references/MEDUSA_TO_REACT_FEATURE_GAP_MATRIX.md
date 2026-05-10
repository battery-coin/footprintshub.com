# Medusa to React Feature Gap Matrix

| Medusa Feature | Medusa Area / Package / Module | Business Purpose | Already in FootprintsHub? | Magento Covered? | OpenCart Covered? | Conflict Risk | Multi-Tenant Impact | MVP? | Hero Studio? | Priority | Target | Notes |
|---|---|---:|---|---|---|---|---|---|---|---|---|---|
| Domain module registry | `packages/modules`, `modules-sdk` | Keep commerce domains isolated | partial | no | partial | low | high | yes | yes | P0 | service/docs | Added static registry; no dynamic loading. |
| Workflow engine | `core-flows`, `workflows-sdk` | Coordinate multi-step cart/checkout/order operations | partial | partial | no | medium | high | yes | yes | P0 | service/tests/docs | Added lightweight runner and scaffold workflows. |
| Workflow compensation | `orchestration` | Reverse failed steps where possible | partial | no | no | medium | high | yes | yes | P0 | service/tests | Runner supports `compensate`; DB rollback remains future. |
| Storefront SDK pattern | `js-sdk/store` | Typed frontend/API calls | no | no | no | low | medium | yes | yes | P1 | client/API | Added local Storefront client and Store API aliases. |
| Admin SDK/resource pattern | `js-sdk/admin` | Consistent admin operations | partial | partial | partial | low | high | no | yes | P2 | docs | Deferred until admin auth stabilizes. |
| Product sales channels | `sales-channel`, `product` | Show products in selected surfaces | no | partial | partial | medium | high | yes | yes | P0 | schema/admin/docs | Added `SalesChannel` and join model. |
| Region/market | `region`, `tax`, `payment`, `fulfillment` | Currency/country/payment/shipping availability | partial | partial | partial | medium | high | yes | yes | P1 | schema/admin/API | Added lightweight `MarketRegion`. Shop remains tenant identity. |
| Payment provider abstraction | `payment`, `payment-stripe` | Add providers without rewriting checkout | partial | partial | no | medium | high | yes | yes | P0 | service/schema | Added provider interface and Stripe adapter. Existing checkout kept stable. |
| Payment session | `payment`, `payment-collection` | Track provider checkout session lifecycle | partial | yes | no | medium | high | yes | yes | P0 | schema/service | Added `PaymentSession`. |
| Payment collection | `payment-collection` | Group payable/refundable order amounts | no | partial | no | medium | medium | no | yes | P1 | schema/docs | Added model; UI deferred. |
| Cart line-item workflows | `cart/core-flows` | Validate pricing, inventory, shipping, taxes | partial | partial | partial | medium | high | yes | yes | P0 | workflow | Existing cart retained; workflow scaffold added. |
| Cart adjustments | `cart`, `promotion` | Discounts/tax/shipping line accounting | partial | partial | partial | medium | medium | yes | yes | P1 | service | Existing totals pipeline remains source. |
| Inventory items | `inventory` | Decouple sellable variants from stock units | partial | partial | no | medium | high | yes | yes | P1 | schema/service | Added inventory item and variant link models. |
| Stock locations | `stock-location` | Support multi-location fulfillment | no | partial | no | medium | high | no | yes | P1 | schema/admin | Added schema and admin direction. |
| Inventory reservations | `cart/core-flows`, `inventory` | Hold stock during checkout | partial | partial | no | medium | high | yes | yes | P0 | schema/workflow/tests | Added model/service; persistence wiring deferred. |
| Fulfillment providers | `fulfillment` | Provider-specific shipping/fulfillment | partial | partial | partial | medium | high | no | yes | P1 | schema/admin | Added provider and fulfillment records. |
| Shipping profiles/options | `fulfillment` | Product shipping behavior and available methods | partial | partial | partial | low | high | yes | yes | P1 | schema/API/admin | Added `ShippingProfile` and `ShippingOption`. |
| Promotions | `promotion` | Coupon/automatic/campaign rules/actions | partial | partial | partial | medium | high | yes | yes | P1 | schema/service/admin | Added `Promotion`, rules/actions and evaluator. |
| Buy-X-get-Y | `promotion` | Advanced marketing discount | no | partial | partial | medium | medium | no | yes | P2 | schema/docs | Action type scaffolded only. |
| Event bus | `event-bus-local`, `event-bus-redis` | Trigger side effects safely | no | partial | no | medium | high | yes | yes | P0 | service/schema/tests | Added local bus and `CommerceEvent`. |
| Outbox events | event modules | Durable async processing | partial | no | no | medium | high | yes | yes | P1 | schema/docs | Schema added; worker deferred. |
| Subscribers | event modules | Notifications, commissions, unlocks | partial | no | no | medium | high | yes | yes | P1 | service/docs | Local subscriber scaffold added. |
| Idempotency key table | workflows/API | Prevent duplicate side effects | partial | yes | no | low | high | yes | yes | P0 | schema | Added generic `IdempotencyKey`. |
| Order returns/exchanges | order workflows | RMA/exchange lifecycle | partial | partial | partial | medium | medium | no | yes | P2 | docs | OpenCart return foundation already exists. |
| Order edits/draft orders | plugins/core-flows | Admin order modifications | no | partial | partial | high | medium | no | yes | P2 | docs | Deferred; risky before auth/payment lifecycle matures. |
| Workflow execution admin | admin SDK | Debug workflow runs | no | no | no | low | medium | no | yes | P2 | admin/docs | Events page added; execution storage deferred. |
| Provider modules | modules/providers | Payments, fulfillment, notifications, files | partial | no | partial | medium | high | no | yes | P2 | plugin docs | Existing plugin registry remains canonical. |
| Auth/RBAC | `auth`, `rbac`, `user` | Secure admin/customer access | partial | partial | partial | high | high | yes | yes | P0 | docs | Admin gate exists; full auth deferred. |
| Settings module | `settings` | Admin preferences/entity config | partial | no | partial | low | medium | no | yes | P3 | docs | Defer. |
| File module | `file`, providers | Upload and download assets | partial | partial | partial | medium | medium | no | yes | P2 | docs | Need upload validation before production. |
| Notification module | `notification` | Email/provider abstraction | partial | partial | no | low | high | no | yes | P2 | module/docs | Scaffolded in module registry. |
| Cache/locking | cache/locking modules | Performance and concurrency | no | partial | no | medium | high | no | yes | P2 | docs | Use DB idempotency first; Redis later. |
