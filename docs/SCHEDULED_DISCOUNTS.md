# Scheduled Discounts

Date: 2026-05-10

## Support

Product-level scheduled discounts are supported through `DiscountSchedule`.

Types:

- Percentage
- Fixed amount
- Sale price

## Rules

- Active only when `startsAt <= now <= endsAt` and `active=true`.
- Discounts never produce negative prices.
- Fixed discounts cannot exceed the product price.
- Sale price cannot be higher than the product price.

## Helpers

- `src/lib/pricing/scheduled-discounts.ts`
- `src/lib/pricing/price-calculator.ts`
