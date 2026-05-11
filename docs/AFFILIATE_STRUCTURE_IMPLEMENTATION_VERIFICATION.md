# Affiliate Structure Implementation Verification

Date: 2026-05-11

## Binary

- Schema: yes, `BinaryPlanConfig` and binary-aware plan/level/commission fields exist.
- UI: yes, `/admin/affiliates/structures`, `/admin/affiliates/plans/[id]/binary`, and preview pages exist.
- API: yes, template creation and structure config routes exist.
- Persistence: yes after Prisma migration is applied to Neon.
- Commission engine: scaffolded. Binary placement and weaker-leg volume payout execution are not production-complete.

## Matrix

- Schema: yes, `MatrixPlanConfig`, `MatrixPosition`, and matrix-aware plan/level/commission fields exist.
- UI: yes, `/admin/affiliates/structures`, `/admin/affiliates/plans/[id]/matrix`, and preview pages exist.
- API: yes, template creation and structure config routes exist.
- Persistence: yes after Prisma migration is applied to Neon.
- Commission engine: scaffolded. Matrix placement/spillover payout execution is not production-complete.

## Unilevel

- Schema: yes, `UnilevelPlanConfig` and 0-7 level rows exist.
- UI: yes, structures, plan list/detail, plan levels, active 7-level settings, and affiliate team pages exist.
- API: yes, plan CRUD, activate, duplicate, level editor, active-plan, and active-plan level aliases exist.
- Persistence: yes after Prisma migration is applied to Neon.
- Commission engine: functional for launch through the existing closure-table ancestor commission path.

## Level Editing

The owner/admin can edit:

- label
- enabled flag
- commission type
- percentage basis points
- fixed cents
- commission base
- max per order
- max per month

Default Unilevel rows now match the requested labels and rates:

- Direct affiliate: 10%
- Parent ambassador: 2%
- Grandparent ambassador: 1.5%
- Third-level ambassador: 1%
- Fourth-level ambassador: 0.75%
- Fifth-level ambassador: 0.50%
- Sixth-level ambassador: 0.25%
- Seventh-level ambassador: 0.25%

## Action Taken

- Added active plan API aliases.
- Repaired `/admin/affiliates/levels` to use the real plan level editor.
- Connected `/affiliate/team` to the active plan instead of a hardcoded fallback.
- Added the `src/lib/affiliate/percentage-bps.ts` helper aliases requested by the prompt.
