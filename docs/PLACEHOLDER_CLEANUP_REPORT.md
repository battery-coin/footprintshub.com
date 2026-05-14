# Placeholder Cleanup Report

## Search Targets

The app was checked for customer-facing placeholder language, hash-only CTAs, JavaScript void links, local-only production URLs, and dead setup buttons.

## Fixed

- Affiliate application submit now calls `/api/affiliate/apply`.
- Product, discount, payout, and archive buttons now clearly show setup-required state when persistence is not enabled.
- Legal page copy no longer describes itself as early placeholder text.
- Missing routes now render useful pages rather than 404s.
- Custom not-found page added for moved or unknown routes.
- Removed visible "placeholder" labels from active-looking buttons in discount, affiliate settings, affiliate rules, affiliate coupon, and QR preview surfaces.
- Reworded customer account, support, FAQ, shipping, fulfillment, return, order, and promotion pages so incomplete areas read as intentional setup or prepared account states.

## Intentional Scaffolds

Some admin writes remain scaffolded until Neon, durable auth, and provider-specific execution are configured. They are labeled as setup-required states instead of active CTAs.

## Remaining Intentional Matches

- Form `placeholder` attributes remain for inputs because they are standard UX hints, not dead content.
- Product media files live under `/product-placeholders/`.
- The required seed item `Digital Twin Registration Placeholder` remains intentionally named for the future digital-twin workflow and is not enabled as a paid live checkout product.

