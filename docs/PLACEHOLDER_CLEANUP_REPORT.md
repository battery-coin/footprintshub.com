# Placeholder Cleanup Report

## Search Targets

The app was checked for customer-facing placeholder language, hash-only CTAs, JavaScript void links, local-only production URLs, and dead setup buttons.

## Fixed

- Affiliate application submit now calls `/api/affiliate/apply`.
- Product, discount, payout, and archive buttons now clearly show setup-required state when persistence is not enabled.
- Legal page copy no longer describes itself as early placeholder text.
- Missing routes now render useful pages rather than 404s.
- Custom not-found page added for moved or unknown routes.

## Intentional Scaffolds

Some admin writes remain scaffolded until Neon, durable auth, and provider-specific execution are configured. They are labeled as setup-required states instead of active CTAs.

