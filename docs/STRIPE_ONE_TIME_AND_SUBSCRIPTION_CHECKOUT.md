# Stripe One-Time And Subscription Checkout

Checkout now resolves the cart mode before creating a Stripe Checkout Session.

- One-time carts use `mode=payment`.
- Recurring subscription or membership carts use `mode=subscription`.
- Mixed one-time and recurring carts are blocked with: “Please checkout subscription products separately from one-time products.”
- External payment products are blocked.
- Free checkout is scaffolded and blocked until entitlement-only checkout is enabled.

Subscription checkout uses recurring `price_data` from product metadata when no pre-created Stripe Price mapping exists. Stripe webhooks update paid orders and subscription status records.

Mixed utility token checkout for recurring subscriptions remains disabled until token-provider support is reviewed.
