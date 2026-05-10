# Testing And QA Checklist

## Commands

```powershell
npm run prisma:generate
npm run typecheck
npm run lint
npm run test
npm run build
```

## Catalog

- Product list loads.
- Product detail loads.
- Category page loads.
- Collection page loads.
- Admin products page loads.
- Admin categories page loads.
- Admin collections page loads.
- Product status and visibility rules are respected.

## Cart

- Add to cart works.
- Cart drawer works.
- Quantity update works.
- Remove item works.
- Clear cart works.
- Server cart validation recalculates product prices.
- Coupon validation rejects inactive, expired, and below-minimum coupons.
- Totals include subtotal, discount, shipping, tax, and grand total.

## Checkout / Stripe

- Checkout route rejects invalid payloads.
- Checkout route rejects insufficient inventory.
- Stripe session is created server-side.
- Stripe metadata includes orderId, shopId, cartId when available, customer/referral IDs when available.
- Stripe webhook verifies signature.
- Webhook idempotency prevents duplicate processing.
- Order status changes to paid.
- Payment record is created once.
- Inventory deducts once.
- Affiliate commissions create once.

## Orders

- Admin orders page loads.
- Order detail page loads.
- Order item snapshots remain stable after product edits.
- Refund placeholder is visible in docs/schema.
- Shipment placeholder is visible in docs/schema.

## Affiliate

- Affiliate application validates terms/disclosure.
- Referral link stores attribution.
- Direct commission calculates.
- Multi-level commission calculates within configured depth.
- Own-referral is blocked.
- Refund reversal ledger is created.
- Payout below minimum is rejected.

## Security

- No server secrets in client bundle.
- Admin APIs reject missing/invalid admin secret.
- Stripe secret key is server-only.
- `COMMERCE_INTERNAL_API_TOKEN` is server-only.
- CSP/security headers are present.
- Webhook replay does not duplicate order processing.
