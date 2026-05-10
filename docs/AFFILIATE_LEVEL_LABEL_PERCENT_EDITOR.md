# Affiliate Level Label and Percentage Editor

Date: 2026-05-10

## Route

`/admin/affiliates/plans/[id]/levels`

## Editable Fields

- Enabled
- Label
- Commission type
- Percentage
- Fixed amount
- Commission base
- Max per order
- Max per month
- Sort order

## Percentage Storage

Percentages are displayed to the owner as normal percentages, such as `10` or `2.5`, and stored as basis points.

Examples:

- `10%` = `1000` bps
- `2.5%` = `250` bps
- `0.25%` = `25` bps

Helpers live in `src/lib/money/percentage-bps.ts`.

## Safety

All writes go through admin API routes, Zod validation, and the temporary `ADMIN_SECRET` gate. Replace the temporary gate with full authenticated owner roles before production launch.
