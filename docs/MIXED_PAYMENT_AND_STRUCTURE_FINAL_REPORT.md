# Mixed Payment And Structure Final Report

## 1. Why Use This Structure Was Broken

The page used a client button and API, but the API only accepted `templateKey`. The requested `structureType` payload was unsupported, the client had limited error feedback, and Binary/Matrix UX looked unfinished because it displayed `scaffolded`.

## 2. How It Was Fixed

- API accepts `templateKey` or `structureType`.
- Creation uses a Prisma transaction.
- Button sends both identifiers and displays loading/error messages.
- Redirects are structure-specific.

## 3. Binary Status

Binary configuration is functional when the database schema is migrated. It creates plan levels and `BinaryPlanConfig`. Payout engine remains pending final activation.

## 4. Matrix Status

Matrix configuration is functional when the database schema is migrated. It creates plan levels and `MatrixPlanConfig`. Payout engine remains pending final activation.

## 5. Unilevel Status

Unilevel configuration and the current commission engine are functional.

## 6. Editable Settings

Plan levels, labels, percentages, caps, and structure-specific forms remain editable under plan routes.

## 7. Payment Ratios

Payment ratios are edited at `/admin/settings/payments/mixed`.

## 8. 50% USD / 50% Battery Coin

Saved as:

- `fiatPercentageBps = 5000`
- `tokenPercentageBps = 5000`

## 9. Checkout Handling

Fiat-only checkout continues through Stripe. Mixed/token checkout is blocked with a setup-required response unless `ENABLE_TOKEN_PAYMENT_PROVIDER=true`.

## 10. Token Provider Status

Token payment provider is scaffolded, not live. Manual verification API is owner/audit-log protected.

## 11. Order Completion Gate

Stripe webhook marks only the fiat portion as paid when a composition exists. Fulfillment and affiliate commission calculation run only when the composition is complete.

## 12. Remaining Scaffolded Items

- Live Battery Coin payment processor
- Automatic token payment verification
- Binary payout engine
- Matrix payout engine
- Product-specific payment policy persistence UI

## 13. Build/Lint/Typecheck Results

- `npx prisma format`: passed
- `npx prisma validate`: passed
- `npx prisma generate`: passed
- `npm run test`: passed, 63 tests
- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run build`: passed

## 14. Railway Deployment Instructions

Push branch `mixed-payment-and-affiliate-structure-fix`, deploy to Railway, then test:

- `/api/health`
- `/admin/affiliates/structures`
- `/admin/affiliates/plans`
- `/admin/settings/payments`
- `/admin/settings/payments/mixed`
- `/admin/settings/tokens`
- `/cart`
- `/checkout`

Do not claim live Battery Coin payment is enabled unless `ENABLE_TOKEN_PAYMENT_PROVIDER=true` and a real verification provider has been implemented and tested.
