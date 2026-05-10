# Affiliate Three-Structure Audit

Date: 2026-05-10

## Scope

This audit covers the owner/admin plan builder for Binary, Matrix, and Unilevel affiliate structures in the FootprintsHub commerce app.

## Existing Routes Reviewed

- `/affiliate/team`
- `/affiliate/dashboard`
- `/affiliate/commissions`
- `/affiliate/payouts`
- `/affiliate/links`
- `/admin/affiliates`
- `/admin/affiliates/plans`
- `/admin/affiliates/plans/[id]`
- `/admin/affiliates/plans/[id]/levels`
- `/api/admin/affiliates/*`
- `/api/affiliate/*`

## Existing Models Reviewed

- `AffiliateProgram`
- `AffiliatePlan`
- `AffiliatePlanLevel`
- `CommissionRule`
- `AffiliateCommission`
- `AffiliateTreeClosure`
- `AffiliateRank`
- `AffiliatePerformanceTier`
- `AffiliateWalletLedger`
- `AffiliatePayout`

## Gaps Found

- The affiliate-facing `/affiliate/team` page was being treated as the visible place to inspect team structure, but it was not an owner plan editor.
- The owner/admin area did not expose a clear structure selector for Binary, Matrix, and Unilevel.
- Plan labels and commission percentages were not editable from a dedicated plan-level editor.
- Binary and Matrix configuration fields were not persisted as first-class plan configuration.
- Binary and Matrix payout engines were not production-hardened and needed explicit scaffolded status.
- Admin navigation did not have a direct Structures entry.

## Structure Status

| Structure | Exists Now | Owner Selectable | Editable Labels/Rates | Payout Engine |
| --- | --- | --- | --- | --- |
| Binary | Yes | Yes | Yes | Scaffolded |
| Matrix | Yes | Yes | Yes | Scaffolded |
| Unilevel | Yes | Yes | Yes | Functional |

## Owner/Affiliate Separation

- Owner/admin plan editing now lives under `/admin/affiliates/*`.
- `/affiliate/team` remains affiliate-facing.
- Owner/admin users see management CTAs on `/affiliate/team`.
- Normal affiliates do not receive structure editing controls.

## Compliance Rule

All three structures are framed as qualified purchase commission plans. The system does not pay commissions merely for recruitment or signup.
