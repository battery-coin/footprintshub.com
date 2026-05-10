# OpenCart Feature QA Checklist

## Catalog

- Product can have a brand.
- Product can have options and option values.
- Product review can be pending, approved, or rejected.
- Wishlist add/remove works after auth exists.
- Compare add/remove works for guest/customer sessions.

## Cart / Checkout

- Coupon applies.
- Gift voucher applies.
- Store credit applies.
- Loyalty points redemption is hidden or validated until enabled.
- Totals pipeline returns ordered total lines.
- Digital-only cart skips shipping.
- Physical cart requires shipping.
- Terms acceptance is required.
- Preorder acknowledgement required for preorder items.
- Randomized odds acknowledgement required for blind boxes/booster packs.

## Orders / Returns / Downloads

- Order history event is created.
- Return request is created and respects return window.
- Download entitlement is created after paid digital order.
- Remaining download count and expiration are enforced.

## Admin / Security

- Admin permission check blocks unauthorized action.
- Tenant resolver preserves shop isolation.
- No duplicate models/routes conflict with existing systems.
- No secrets in client bundle.

## Commands

```powershell
npm run prisma:generate
npm run typecheck
npm test
npm run lint
npm run build
```
