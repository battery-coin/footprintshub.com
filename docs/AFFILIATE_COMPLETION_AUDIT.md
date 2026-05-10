# Affiliate Completion Audit

## Existing Implementation

FootprintsHub already had a native React/Next.js affiliate foundation before this pass:

- Prisma models for affiliate programs, affiliates, tree closure, clicks, attribution, commission rules, multi-level rules, commission ledger, wallet ledger, payouts, ranks, coupons, assets, notifications, and audit logs.
- Public routes for affiliate application, dashboard, links, commissions, payouts, wallet, coupons, assets, reports, team, settings, and `/r/[code]`.
- Admin routes for applications, referrals, commissions, payouts, rules, 7-level settings, ranks, bonuses, assets, reports, and settings.
- API routes for affiliate application, click tracking, payout request, and admin status changes.
- Stripe paid-order path that calls affiliate commission calculation after verified payment.
- Tests for direct commission, fixed commission, product/category/affiliate overrides, multi-level depth, own-referral blocking, refund ledgers, webhook idempotency, monthly cap, payout minimum, and wallet ledger balances.

## Gaps Found

- The database did not yet have a first-class `AffiliatePlan` business model layer.
- Level configuration existed as `MultiLevelCommissionRule`, but not as editable plan levels with rank requirements and compression behavior.
- Ranks were simple labels with bonus bps, not qualification/depth rules.
- Performance tiers were missing.
- Lifetime customer attribution was missing.
- Commission records did not store plan, plan level, rank, tier, cap, compression, or business model metadata.
- Admin plan pages and performance tier pages were missing.
- Affiliate dashboard did not yet include rank progress or disclosure reminders.
- Legal pages covered affiliate terms, disclosure, and ambassador rules, but not an income disclaimer.

## Conflict Risks

- Existing `AffiliateProgram` remains the shop-level container; `AffiliatePlan` is now the compensation plan inside that program.
- Existing `MultiLevelCommissionRule` is preserved for backward compatibility, while `AffiliatePlanLevel` becomes the preferred configurable 0-7 level model.
- Existing Stripe webhook idempotency remains the gate before commission calculation.

## Recommended Fixes Applied

- Add affiliate plans, levels, performance tiers, qualification snapshots, lifetime attribution, and richer commission metadata.
- Seed a conservative purchase-only 7-level plan.
- Add pure TypeScript services for plan resolution, caps, compression, ranks, tiers, lifetime attribution, and refund reversal.
- Add admin pages for plan review, plan templates, level editor, and performance tiers.
- Add affiliate resources page and dashboard disclosure reminder.
- Add docs and test checklist for business models, 7-level rules, legal guardrails, and Hero Studio expansion.
