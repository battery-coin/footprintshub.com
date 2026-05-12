# Printful Schema Mapping

## Product

- `fulfillmentType=printful`
- `printfulEnabled`
- `printfulProductId`
- `printfulSyncProductId`
- `printfulTemplateId`
- `printfulNeedsVariantMapping`

## ProductVariant

- `printfulVariantId`
- `printfulSyncVariantId`
- `printfulSku`
- `printfulRetailPriceCents`
- `printfulCurrency`
- `printfulEnabled`

## OrderItem

- `fulfillmentTypeSnapshot`
- `fulfillmentProvider`
- `printfulVariantId`
- `printfulSyncVariantId`
- `printfulOrderItemId`
- `printfulStatus`

## Fulfillment

Provider-neutral record with Printful-specific provider IDs, external IDs, submitted/fulfilled timestamps, tracking, and error message.

## PrintfulOrder

Stores idempotency key, Printful order ID, external ID, request/response/error payloads, recipient/items/shipping snapshots, status, and sync timestamps.

## PrintfulOrderItem

Connects each provider line item to the internal `OrderItem`, product, variant, and mapping IDs.

## ProviderIdempotencyKey

General-purpose provider idempotency scaffold for Printful and future providers.
