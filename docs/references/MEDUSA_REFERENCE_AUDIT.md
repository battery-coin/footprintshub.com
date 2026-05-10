# Medusa Reference Audit

Date: 2026-05-10

Reference repo: https://github.com/medusajs/medusa

Local path inspected: `C:\Users\saveo\OneDrive\Documents\GitHub\medusa`

Status: the clone command timed out before Git resolved `HEAD`, but the local folder contains the Medusa package tree needed for architecture review. The inspected package metadata identifies `@medusajs/medusa` as version `2.14.2`, MIT licensed, Node `>=20`, with packages for modules, core flows, workflows SDK, framework, JS SDK, admin, and provider modules.

## Structure Inspected

- `packages/core/core-flows`: workflow definitions for cart, payment, payment collection, order, return, fulfillment, stock location, tax, product, sales channel, and promotion flows.
- `packages/core/workflows-sdk`: workflow composition primitives such as `createStep`, `createWorkflow`, workflow response helpers, and orchestration integration.
- `packages/core/orchestration`: workflow manager, local/global workflows, scheduler/storage abstractions, and execution tests.
- `packages/core/modules-sdk`: module registration/linking concepts, including cross-module link mocks for stock locations and inventory.
- `packages/core/js-sdk`: typed Store/Admin API client patterns for carts, payments, products, orders, regions, inventory, reservations, returns, sales channels, and promotions.
- `packages/modules`: domain modules for cart, customer, fulfillment, inventory, order, payment, pricing, product, promotion, region, sales channel, stock location, store, tax, user, RBAC, events, cache, notification, file, workflow engines, and settings.
- `packages/plugins`: examples such as draft orders and loyalty/store credit that demonstrate local extension patterns.

## Architecture Patterns Extracted

- Domain modules isolate product, cart, payment, order, inventory, fulfillment, promotion, region, and sales-channel concerns.
- Workflows coordinate multi-step commerce actions with explicit steps, validation, and compensation/rollback hooks.
- Payment is provider-neutral: payment collections and sessions abstract Stripe and future providers.
- Inventory is modeled separately from products through inventory items, stock locations, inventory levels, and reservations.
- Fulfillment is provider-based and separates shipping profiles/options from order state.
- Promotions wrap coupons, campaigns, rules, and actions rather than treating discount codes as the whole system.
- Store/Admin API clients are typed and organized by resource, with clear pagination/filter/sort conventions.
- Events/subscribers coordinate post-order side effects such as notifications, fulfillment, and integrations.

## Ecommerce Features Found

- Products, variants, options, categories, collections, tags, images, metadata, status, and sales channel visibility.
- Cart creation, line items, promotion application, shipping methods, tax lines, payment collection refresh, validation, and completion.
- Checkout completion workflows tied to payment authorization and order creation.
- Orders with payment, fulfillment, refunds, returns, exchanges, order edits, transfer flows, and status transitions.
- Regions/markets with currencies, countries, tax settings, payment provider availability, and fulfillment provider availability.
- Inventory items, reservations, stock locations, availability checks, and stock-location sales-channel links.
- Shipping profiles, shipping options, fulfillment providers, service zones, shipments, and delivery markers.
- Promotion campaigns, codes, rule conditions, actions, and promotion-to-cart adjustments.

## Admin Concepts Found

- Resource-focused admin sections for products, orders, customers, regions, shipping options, stock locations, inventory, promotions, payment collections, returns, users, and workflow executions.
- Data tables with filters, search, action menus, detail panels, metadata sections, activity timelines, and modal/drawer flows.
- Draft order plugin shows how operational admin workflows can be added without rewriting the core.

## API and SDK Concepts Found

- Store APIs for cart, products, payment sessions, regions, and shipping options.
- Admin APIs for products, orders, customers, promotions, inventory items, reservations, stock locations, regions, fulfillment, returns, and payment collections.
- A typed JS SDK structure that groups endpoints by domain.

## Features Relevant to FootprintsHub

- Lightweight domain modules around existing Next.js services.
- Workflow runner for add-to-cart, checkout session creation, paid webhook handling, inventory deduction, affiliate commission calculation, digital unlock grants, and notifications.
- Provider-neutral Stripe Checkout layer.
- Sales channels for FootprintsHub, Hero Studio marketplace, creator shops, campaigns, and affiliate landing pages.
- Market region and shipping option foundations.
- Commerce event outbox/subscriber model for Hero Studio webhooks.

## Features Relevant to Hero Studio Creator Shops

- Shop-scoped modules and sales channels.
- Creator shop product visibility through sales channels.
- Provider-specific payment/fulfillment configuration per shop.
- Events for `order.paid`, `membership.purchased`, `digital_unlock.granted`, `affiliate.commission_created`, and `creator_product.sold`.
- Admin separation between platform owner, shop owner, fulfillment staff, affiliate manager, and support roles.

## Already Covered by Magento/OpenCart Work

- Product, variant, category, collection, media, related products, reviews, wishlist, compare, discounts, orders, shipments, returns, downloads, store credit, loyalty, admin roles, audit logs, and legal pages.
- Affiliate/ambassador program, wallet ledger, payout requests, fraud controls, and 7-level commissions.

## Uniquely Useful from Medusa

- Modern TypeScript module boundaries.
- Workflow/step orchestration with compensation.
- Payment session/payment collection abstraction.
- Inventory items + stock locations + reservations.
- Sales channels and market regions as separate concepts from shop/tenant identity.
- Event bus/outbox and subscriber approach.
- Typed storefront SDK/client shape.

## Implement Now

- `src/modules/module-registry.ts`
- Lightweight workflow primitives and initial workflow definitions.
- Provider-neutral payment adapter with Stripe Checkout provider.
- Inventory reservation service scaffolds.
- Promotion rule/action service scaffolds.
- Event bus/subscriber scaffolds.
- Store API aliases and storefront client.
- Admin pages for fulfillment, shipping options, promotions, sales channels, regions, events, and audit logs.
- Schema additions for regions, sales channels, payment sessions, payment collections, stock locations, inventory reservations, fulfillment, promotions, events, and idempotency keys.

## Defer

- Full Medusa dependency adoption.
- Dynamic plugin loading.
- Multi-location allocation algorithms.
- Full payment capture/refund admin UI.
- Returns/exchanges/order edit parity.
- Async queue/worker infrastructure.
- Complex tax provider, multi-currency conversion, Stripe Connect marketplace payouts, and Battery Coin payment provider.
