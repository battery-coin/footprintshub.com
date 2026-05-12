# Refund Security Checklist

- Refund API requires `canManageRefunds`.
- Stripe refunds are created only server-side.
- Stripe secret keys are not exposed to the browser.
- Refund amount is recalculated server-side.
- Refund cannot exceed paid amount minus existing active refunds.
- Stripe refund calls use idempotency key `refund:{orderId}:{refundId}`.
- Stripe refund webhooks are stored idempotently by event ID.
- Provider-initiated refunds are reconciled by Stripe refund/payment IDs.
- Affiliate commission reversals are idempotent per refund and commission.
- Inventory restock uses idempotency key `inventory:refund-restock:{refundId}:{orderItemId}`.
- Digital access is marked for manual review instead of blindly revoked.
- Printful-progressed orders are flagged for manual review.
- No live refund should be issued without an intentional admin action.
- High-value refund review thresholds are recommended before launch.
