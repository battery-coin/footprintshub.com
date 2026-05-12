# Multi-Tenant Refund Architecture

Refunds are shop-scoped.

## Scope

Every refund stores:

- `shopId`
- `orderId`
- `paymentId` when available
- provider details

## Permissions

Platform owner can manage all refunds. Future shop owners should only manage refunds for their assigned shop. Refund APIs must continue to resolve and enforce tenant scope before creator shops are enabled.

## Creator Shop Future

For `creatorname.herostudio.org`, refund policy may be shop-specific, but FootprintsHub should preserve platform-level authority for chargebacks, payment-provider disputes, affiliate reversal, and fraud review.

## Commission Reversal

Affiliate commission reversal must stay within the same shop scope as the refunded order.
