# Product Schema Upgrade

Date: 2026-05-10

## ORM

The project uses Prisma with Postgres/Neon.

## Extended Existing Models

- `Product`
- `ProductVariant`
- `ProductMedia`
- `TaxClass`
- `Shop`
- `Category`
- `Collection`

## New Models

- `DiscountSchedule`
- `ImportJob`
- `ImportJobRow`

## New Enums

- `ProductFulfillmentType`
- `ProductMediaType`
- `DiscountScheduleType`
- `ImportJobType`
- `ImportJobStatus`
- `ImportJobRowStatus`

## Notes

No production migration was run in this pass. Review and generate a Prisma migration before applying these schema changes to Neon.
