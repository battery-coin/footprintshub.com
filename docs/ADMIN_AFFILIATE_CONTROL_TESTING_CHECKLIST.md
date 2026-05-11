# Admin Affiliate Control Testing Checklist

Date: 2026-05-11

## Routes

- [x] `/admin`
- [x] `/admin/products`
- [x] `/admin/products/new`
- [x] `/admin/categories`
- [x] `/admin/collections`
- [x] `/admin/orders`
- [x] `/admin/refunds`
- [x] `/admin/refunds/[id]`
- [x] `/admin/returns`
- [x] `/admin/inventory`
- [x] `/admin/printful`
- [x] `/admin/fulfillment`
- [x] `/admin/shipping-options`
- [x] `/admin/promotions`
- [x] `/admin/sales-channels`
- [x] `/admin/regions`
- [x] `/admin/shops`
- [x] `/admin/discounts`
- [x] `/admin/shipping`
- [x] `/admin/tax`
- [x] `/admin/customers`
- [x] `/admin/customers/[id]`
- [x] `/admin/affiliates`
- [x] `/admin/affiliates/structures`
- [x] `/admin/affiliates/levels`
- [x] `/admin/affiliates/plans`
- [x] `/affiliate/team`

## Affiliate Controls

- [x] Binary selectable and configurable
- [x] Matrix selectable and configurable
- [x] Unilevel selectable and configurable
- [x] Active 7-level page uses real level editor
- [x] Plan-specific levels page uses real level editor
- [x] Labels are editable
- [x] Percentages are editable and saved as basis points
- [x] Active plan API aliases exist
- [x] Affiliate team page reads the active plan
- [ ] Binary payout engine production execution
- [ ] Matrix payout engine production execution

## Commands

- [x] `npx prisma format`
- [x] `npx prisma validate`
- [x] `npx prisma generate`
- [x] `npm test`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
