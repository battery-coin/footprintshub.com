# Affiliate Owner Setup

Date: 2026-05-10

## Temporary Admin Gate

The MVP uses the existing `ADMIN_SECRET` pattern for admin APIs and owner pages. Add these environment variables:

- `ADMIN_SECRET`
- `PLATFORM_OWNER_EMAIL`
- `ADMIN_EMAILS`

`ADMIN_SECRET` must be random, private, and never committed.

## Choose a Structure

1. Open `/admin/affiliates/structures`.
2. Review Binary, Matrix, and Unilevel cards.
3. Use Unilevel for the launch-ready structure.
4. Use Binary or Matrix only for configuration previews until their placement engines are completed.

## Edit Levels

1. Open `/admin/affiliates/plans`.
2. Select a plan.
3. Open `/admin/affiliates/plans/[id]/levels`.
4. Edit labels, percentages, fixed amounts, bases, and caps.
5. Save.
6. Activate only after reviewing the preview and cap warnings.

## Production Readiness Note

Before public launch, replace the temporary admin gate with proper authenticated owner/shop staff roles and test all payout logic against paid-order, refund, chargeback, and idempotency scenarios.
