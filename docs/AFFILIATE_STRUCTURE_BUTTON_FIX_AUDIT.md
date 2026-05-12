# Affiliate Structure Button Fix Audit

Date: 2026-05-11

## Current route

- Page: `src/app/admin/affiliates/structures/page.tsx`
- Action component: `src/components/admin/affiliate-structure-actions.tsx`
- API: `src/app/api/admin/affiliates/structures/use-template/route.ts`

## Findings

1. `/admin/affiliates/structures` is a Server Component that renders a Client Component button.
2. “Use This Structure” had an `onClick`, but only posted `templateKey`.
3. The API existed and could create plans, levels, and structure config.
4. The API did not accept the requested `{ structureType }` payload.
5. The create flow was not atomic.
6. Binary/Matrix UX showed `scaffolded`, which made configuration look unfinished even though settings persistence exists.

## Fix Implemented

- API now accepts `templateKey` or `structureType`.
- Plan, level, config, and affiliate audit log creation now happen inside a Prisma transaction.
- Redirect now goes to structure-specific settings:
  - Binary -> `/admin/affiliates/plans/[id]/binary`
  - Matrix -> `/admin/affiliates/plans/[id]/matrix`
  - Unilevel -> `/admin/affiliates/plans/[id]/levels`
- Button now sends `templateKey` and `structureType`, shows loading state, and displays API errors.
- Cards now show “Configurable” for Binary/Matrix and “Recommended” for Unilevel.
- Binary/Matrix copy now says: “Configuration ready; payout engine requires final activation.”
