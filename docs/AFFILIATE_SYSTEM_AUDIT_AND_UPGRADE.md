# Affiliate System Audit And Upgrade

## Current Status

The affiliate system includes shop-aware affiliate records, applications, referral codes, click tracking, attribution, commission rules, multi-level commission rules, 7-level plan support, wallet ledger, payout scaffolds, rank/tier docs, fraud controls, and legal guardrails.

## Fixes In This Pass

- `/affiliate/apply` now submits a real application payload to `/api/affiliate/apply`.
- `/api/affiliate/track` was added as an alias for click tracking so future clients can use the requested route.
- `/api/admin/affiliates` was added for admin reads with `ADMIN_SECRET` protection and safe no-database behavior.
- Homepage copy uses purchase-based affiliate language and avoids recruiting-income framing.
- Legal routes include affiliate terms, affiliate disclosure, ambassador program rules, and income disclaimer.

## 7-Level Guardrails

- Level 0 is the direct affiliate.
- Levels 1 through 7 are ancestor ambassadors only when enabled by plan configuration.
- Commissions are paid only on qualified purchases.
- Refunds and chargebacks can reverse commissions.
- No UI copy uses recruiting-income language.

## Remaining Work

- Wire production payout requests to approved wallet balance checks.
- Add admin actions for approve, reject, suspend, reactivate, and payout decisions with audit logs.
- Run sandbox paid-order tests to verify commission idempotency under real webhook retries.

