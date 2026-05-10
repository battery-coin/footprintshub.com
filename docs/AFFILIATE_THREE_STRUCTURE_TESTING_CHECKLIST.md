# Affiliate Three-Structure Testing Checklist

Date: 2026-05-10

## Owner/Admin

- [ ] Owner can access `/admin/affiliates/structures`.
- [ ] Owner can create a Binary plan from template.
- [ ] Owner can create a Matrix plan from template.
- [ ] Owner can create a Unilevel plan from template.
- [ ] Owner can edit a level label.
- [ ] Owner can edit a level percentage.
- [ ] Percentages are saved as basis points.
- [ ] Owner can activate a plan.
- [ ] Non-admin requests are blocked by admin APIs.

## Unilevel

- [ ] Levels 0 through 7 are created.
- [ ] Owner-defined labels display in the plan editor.
- [ ] Owner-defined percentages display in the plan editor.
- [ ] Commission calculation uses owner-defined plan/rule values.

## Matrix

- [ ] Width and depth save.
- [ ] Level labels save.
- [ ] Level percentages save.
- [ ] UI clearly says the placement engine is pending.

## Binary

- [ ] Left/right labels save.
- [ ] Weaker-leg percentage saves.
- [ ] Pair settings save.
- [ ] UI clearly says the placement engine is pending.

## Affiliate Team

- [ ] `/affiliate/team` shows active structure details.
- [ ] Owner/admin sees plan management CTAs.
- [ ] Normal affiliate does not see edit controls.

## Commands

- [ ] `npx prisma format`
- [ ] `npx prisma validate`
- [ ] `npx prisma generate`
- [ ] `npm test`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run build`
