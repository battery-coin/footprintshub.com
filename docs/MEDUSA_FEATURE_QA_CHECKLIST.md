# Medusa Feature QA Checklist

## Commands

- `npm run prisma:generate`
- `npm run typecheck`
- `npm test`
- `npm run lint`
- `npm run build`

## Localhost

- Confirm dev server is running.
- Check `http://127.0.0.1:3000/api/health`.
- Check `http://localhost:3000/api/health`.
- If `127.0.0.1` works but `localhost` does not, repair Windows hosts/DNS resolution.

## Module and Workflow

- Module registry lists all expected commerce domains.
- Workflow runner completes happy path.
- Workflow runner compensates executed steps after failure.
- Checkout workflow still recalculates server-side totals before payment.
- Paid webhook workflow uses idempotency.

## Payment

- Stripe secret remains server-only.
- Stripe webhook secret remains server-only.
- Payment session metadata includes `shopId`, `cartId`, and `orderId` when available.
- Duplicate Stripe webhook does not duplicate order processing.

## Inventory

- Inventory reservation rejects invalid quantities.
- Inventory reservation can be idempotent.
- Inventory deduction runs only after verified payment.
- Failed/cancelled checkout can release reservations.

## Promotions

- Product/category/campaign conditions evaluate server-side.
- Fixed and percentage discounts are capped at subtotal.
- Existing `DiscountCode` checkout behavior remains intact.
- Affiliate coupon attribution is not duplicated.

## Events

- `order.paid` can publish affiliate and digital unlock events.
- `CommerceEvent` outbox rows can be used by future worker.
- Event handlers do not expose PII to client routes.

## Admin

- `/admin/fulfillment` loads.
- `/admin/shipping-options` loads.
- `/admin/promotions` loads.
- `/admin/sales-channels` loads.
- `/admin/regions` loads.
- `/admin/events` loads.
- `/admin/audit-logs` loads.

## Store API

- `/api/store/products` returns products.
- `/api/store/products/[idOrSlug]` returns a product or 404.
- `/api/store/tenant` resolves host.
- `/api/store/regions` returns launch region.
- `/api/store/shipping-options` returns launch shipping options.

## Conflict Checks

- No duplicate product/cart/order/affiliate system was introduced.
- Existing cart drawer and checkout page still load.
- Existing admin products/orders/affiliates pages still load.
- Existing affiliate commission tests still pass.
- Existing OpenCart totals pipeline tests still pass.
