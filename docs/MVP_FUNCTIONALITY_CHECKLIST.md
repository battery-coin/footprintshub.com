# MVP Functionality Checklist

| Flow | Status | Notes |
| --- | --- | --- |
| Browse products | Fixed in this pass | Home, shop, products, collections, filters, and product detail pages render from seed or database products. |
| Cart | Complete for MVP | Cart provider, drawer, page, quantity updates, remove, clear, and checkout CTA exist. Server pricing remains source of truth. |
| Checkout | Partial | Stripe session route exists and validates prices server-side. Live checkout requires Stripe env vars and sandbox QA. |
| Order admin | Partial | Admin orders route exists with safe empty state. Paid order persistence requires Neon and webhook path validation. |
| Refund | Scaffolded | Refund admin page, API scaffold, schema models, and reversal docs exist. Stripe refund execution is future work. |
| Affiliate | Fixed in this pass | Application form posts to API. Admin affiliate routes and 7-level commission foundations exist. |
| Legal | Fixed in this pass | Required legal routes exist, including affiliate, digital goods, blind box, Printful, and crypto policy pages. |
| Admin | Fixed in this pass | Dashboard, products, orders, refunds, affiliates, settings, Printful, security, and audit pages have routable UX. |
| Printful | Scaffolded | Server-only setup panel and webhook route exist. Automatic submission awaits credentials and order workflow wiring. |
| Deployment health | Complete | `/api/health` returns `{ ok: true, service: "footprintshub-commerce" }`. |

## Deferred With Reason

- Full auth: requires provider decision and migration strategy.
- Real product/discount writes: API scaffolds exist, but production writes should follow auth and validation hardening.
- Automated refunds: Stripe refund execution must be tested with real sandbox credentials.
- Printful order submission: requires product mapping, idempotency records, and Printful sandbox/live credentials.

