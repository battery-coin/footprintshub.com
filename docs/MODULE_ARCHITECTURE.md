# Module Architecture

FootprintsHub now uses a Medusa-inspired, lightweight module map without adopting Medusa as a runtime dependency.

## Module Boundaries

- `tenancy`: host/shop resolution and shop isolation.
- `catalog`: products, variants, categories, collections, brands, channels, and product metadata.
- `cart`: guest/customer carts, line items, validation, and totals.
- `checkout`: cart-to-payment-session workflow.
- `payments`: provider-neutral payment sessions with Stripe Checkout first.
- `orders`: order lifecycle, order history, refunds, payments, and fulfillment state.
- `inventory`: inventory items, stock locations, levels, reservations, deductions, and releases.
- `fulfillment`: fulfillment providers, shipping options, fulfillment records, and tracking.
- `promotions`: coupon/automatic/campaign rule evaluation.
- `customers`: customer profiles, addresses, groups, order history, and Hero Studio identity mapping.
- `affiliates`: attribution, 7-level ambassador commissions, wallet ledger, payouts, and fraud controls.
- `events`: commerce events and subscribers.
- `notifications`: provider-agnostic notification hooks.
- `admin`: permission-aware admin surfaces.
- `security`: validation, admin gate, audit logs, webhook safety, and server-secret boundaries.

## Rules

- Server-only modules may import Prisma, Stripe, secrets, and workflow services.
- UI components should call API routes or safe client helpers instead of importing server-only modules.
- Every query that touches commerce data must include shop/tenant scope.
- Side effects that can be retried must use webhook events, commerce events, or idempotency keys.
- Existing Magento/OpenCart/affiliate services remain canonical until a replacement is explicitly wired and tested.

## Current Implementation

`src/modules/module-registry.ts` defines the static module map. Dynamic plugin loading is intentionally deferred.
