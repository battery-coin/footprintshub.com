# Affiliate Admin Guide

Admin routes are scaffolded under `/admin/affiliates`.

## Current Admin Pages

- `/admin/affiliates`
- `/admin/affiliates/[id]`
- `/admin/affiliates/plans`
- `/admin/affiliates/plans/new`
- `/admin/affiliates/plans/[id]`
- `/admin/affiliates/plans/[id]/levels`
- `/admin/affiliates/applications`
- `/admin/affiliates/referrals`
- `/admin/affiliates/commissions`
- `/admin/affiliates/payouts`
- `/admin/affiliates/rules`
- `/admin/affiliates/levels`
- `/admin/affiliates/ranks`
- `/admin/affiliates/performance-tiers`
- `/admin/affiliates/bonuses`
- `/admin/affiliates/assets`
- `/admin/affiliates/reports`
- `/admin/affiliates/settings`

## MVP Actions

- Review pending applications.
- Approve, reject, suspend, or reactivate affiliates.
- Configure direct commission rules.
- Configure up to seven ancestor levels.
- Review pending commissions.
- Approve or reject payout requests.
- Export future CSV reports.
- Review fraud flags and audit logs.

## Admin API

- `POST /api/admin/affiliates/status`: update affiliate status behind `ADMIN_SECRET`.

Future admin endpoints should write `AffiliateAuditLog` records for every program, rule, status, payout, and manual commission change.

## Plan Controls

Use `AffiliateProgram` as the shop-level container and `AffiliatePlan` as the compensation plan. Use `AffiliatePlanLevel` for level 0 through level 7, `AffiliateRank` for max paid depth, `AffiliatePerformanceTier` for monthly thresholds, and `AffiliateQualificationSnapshot` for auditable qualification periods.

Cash payouts should remain disabled until payout compliance, tax form collection, and provider integrations are reviewed. Store credit is the recommended MVP payout mode.
