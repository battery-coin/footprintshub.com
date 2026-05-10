# Payment Audit And Upgrade

## Current Status

Stripe Checkout remains the first payment implementation. The project already has a create-session route, Stripe webhook route, payment abstractions, workflow docs, webhook idempotency concepts, and server-side price validation.

## Fixes In This Pass

- Payment settings page added at `/admin/settings/payments`.
- Env vars expanded for Stripe, Coinbase, and public feature flags.
- Legal route added for crypto payment terms.
- Admin dashboard now exposes payment readiness in the setup checklist.

## Production Requirements

- Never trust client totals.
- Verify Stripe webhook signatures with `STRIPE_WEBHOOK_SECRET`.
- Store webhook IDs and payment session IDs for idempotency.
- Complete paid orders only after verified provider events.
- Trigger inventory deduction, Printful handoff, digital unlocks, affiliate commissions, and notifications from the paid-order workflow.

## Remaining Work

Run Stripe sandbox checkout, successful payment webhook, duplicate webhook, failed payment, refund, and chargeback simulations before launch.

