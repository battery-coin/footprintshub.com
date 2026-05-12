# Printful Shipping Strategy

## MVP

- Stripe Checkout collects shipping address when a cart contains Printful or physical fulfillment.
- Printful payload uses `PRINTFUL_DEFAULT_SHIPPING_METHOD`, defaulting to `STANDARD`.
- Checkout does not yet call Printful live shipping rates.
- Digital-only carts do not require shipping.

## Later

- Calculate Printful shipping rates before checkout.
- Map selected Stripe shipping option to a Printful shipping method.
- Enforce country restrictions by product and destination.
- Store provider shipping cost snapshots.

Do not claim exact live Printful rates until the shipping rate endpoint is integrated and tested.
