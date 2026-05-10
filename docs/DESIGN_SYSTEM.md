# FootprintsHub Design System

## Direction

FootprintsHub should feel premium, calm, and easy to operate. Customer pages stay minimal and product-led. Admin pages stay dense enough for repeated work, but hide advanced setup behind focused pages and status panels.

## Principles

- One primary action per section.
- Secondary actions support navigation, not pressure.
- Use accordions for FAQ, product policy, and legal detail.
- Use drawers for cart and quick actions.
- Use status badges for payment, fulfillment, refund, affiliate, and setup state.
- Use empty states that explain the next useful action.
- Never show raw stack traces or provider errors to customers.
- Keep admin controls honest when persistence or provider credentials are not configured.
- Use cents for money and basis points for percentages in admin copy.

## Components Added Or Standardized

- `Card` and `MetricCard` for dashboard and settings surfaces.
- `EmptyState` for missing products, refunds, orders, and setup states.
- `StatusBadge` for setup, workflow, and operational status.
- `Accordion` for FAQ, product story panels, and policy summaries.
- `Timeline` for order/refund/checkout workflow explanations.
- `SetupPanel` for Stripe, Printful, shipping, and deployment readiness.

## UX Notes

The customer storefront now exposes the actual shop, collections, product detail, affiliate application, FAQ, contact, support, and legal routes. The admin surface exposes setup panels rather than fake save flows when persistence is intentionally scaffolded.

