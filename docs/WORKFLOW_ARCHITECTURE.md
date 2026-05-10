# Workflow Architecture

The app now has a lightweight, Medusa-inspired workflow pattern in `src/lib/workflows`.

## Why

Checkout and paid-order processing are multi-step operations:

1. Resolve tenant/shop.
2. Validate cart and product status.
3. Validate inventory.
4. Recalculate server-side totals.
5. Create payment session.
6. Mark payment/order paid after verified webhook.
7. Deduct inventory.
8. Grant digital unlocks.
9. Calculate affiliate commissions.
10. Emit events and notifications.

Keeping these as named steps makes retries, audits, and compensation safer.

## Step Shape

Each step has:

- `id`
- `name`
- `execute(input, context)`
- optional `compensate(input, context, error)`
- optional `idempotencyKey`
- optional `auditLog`

## Added Workflows

- `cart.create`
- `cart.add-line-item`
- `checkout.create-session`
- `payment.stripe-webhook`
- `order.complete`
- `inventory.reserve`
- `inventory.release`
- `inventory.deduct`
- `affiliate.calculate-order-commissions`
- `digital-unlock.grant`
- `notifications.send-order`

## Current Scope

The runner executes steps and compensates completed steps after failure. Persistent workflow execution storage and async workers are deferred.
