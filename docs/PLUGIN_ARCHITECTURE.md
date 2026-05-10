# Plugin Architecture

OpenCart extensions are translated into a static TypeScript plugin model.

## Plugin Types

- paymentProvider
- shippingProvider
- taxProvider
- discountProvider
- fulfillmentProvider
- digitalUnlockProvider
- affiliateProvider
- notificationProvider
- analyticsProvider

## Implementation

- `src/lib/plugins/types.ts`
- `src/lib/plugins/registry.ts`

## MVP Rule

Do not dynamically load untrusted code. The first implementation is a static registry of known providers.

## Active Plugins

- Stripe Checkout payment provider.
- Flat-rate shipping provider.
