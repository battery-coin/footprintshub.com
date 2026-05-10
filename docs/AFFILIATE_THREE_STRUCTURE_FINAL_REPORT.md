# Affiliate Three-Structure Final Report

Date: 2026-05-10

## What Was Missing Before

- No dedicated owner/admin structure selector for Binary, Matrix, and Unilevel.
- No dedicated level label/rate/cap editor.
- `/affiliate/team` did not clearly separate affiliate viewing from owner plan management.
- Binary and Matrix settings were not persisted as first-class plan configuration.

## Where Owner/Admin Edits Structure Now

- `/admin/affiliates/structures`
- `/admin/affiliates/plans`
- `/admin/affiliates/plans/[id]`
- `/admin/affiliates/plans/[id]/levels`
- `/admin/affiliates/plans/[id]/preview`
- `/admin/affiliates/plans/[id]/binary`
- `/admin/affiliates/plans/[id]/matrix`
- `/admin/affiliates/plans/[id]/unilevel`

## Structures Added

- Binary: configurable and persisted; payout engine scaffolded.
- Matrix: configurable and persisted; payout engine scaffolded.
- Unilevel: configurable, persisted, and launch-functional.

## Level Labels and Percentages

Owners can edit labels and percentages in `/admin/affiliates/plans/[id]/levels`. Percentages are stored as basis points.

## Affiliate Team Page

`/affiliate/team` remains affiliate-facing. Owner/admin users see CTAs to manage plans, choose structures, edit levels, and preview active plan. Normal affiliates only see network/commission information.

## Admin Row Edit Buttons

Row-level edit actions were added across the requested admin tables/pages:

- Products
- Categories
- Collections
- Inventory
- Printful
- Fulfillment
- Shipping options
- Promotions
- Sales channels
- Regions
- Tax
- Affiliates

## Functional Status

- Unilevel: functional.
- Binary: scaffolded calculator/configuration.
- Matrix: scaffolded calculator/configuration.

## Remaining Setup

- Create and review a Prisma migration before applying schema changes to Neon.
- Replace temporary `ADMIN_SECRET` gating with real authenticated owner/shop roles.
- Complete and test Binary placement/volume engine before enabling Binary payouts.
- Complete and test Matrix placement/spillover engine before enabling Matrix payouts.

## QA Results

See `docs/BUILD_AND_QA_REPORT.md` for the latest command results.
