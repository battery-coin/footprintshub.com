# Event Bus and Subscribers

FootprintsHub uses a Medusa-inspired event model for commerce side effects.

## Event Types

- `cart.created`
- `cart.updated`
- `checkout.session_created`
- `payment.authorized`
- `payment.captured`
- `order.created`
- `order.paid`
- `order.cancelled`
- `order.refunded`
- `fulfillment.created`
- `fulfillment.shipped`
- `customer.created`
- `affiliate.commission_created`
- `digital_unlock.granted`
- `inventory.reserved`
- `inventory.deducted`
- `inventory.released`

## Current Implementation

- `src/modules/events/event-bus.ts` provides local subscribe/publish helpers.
- `CommerceEvent` in Prisma is the future durable outbox table.
- `src/modules/events/subscribers.ts` maps `order.paid` to affiliate commission and digital unlock subscriber events.

## Future Worker

A future Railway worker can poll `CommerceEvent` rows with status `pending`, dispatch handlers, and mark events `processed` or `failed`.

## Hero Studio

The same event bus can emit signed Hero Studio webhooks for:

- `order.paid`
- `membership.purchased`
- `digital_unlock.granted`
- `affiliate.commission_created`
- `creator_product.sold`
- `fan_tier_updated`
- `campaign_supporter_purchased`
