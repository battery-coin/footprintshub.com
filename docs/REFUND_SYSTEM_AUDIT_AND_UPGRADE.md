# Refund System Audit And Upgrade

## Added In This Pass

- `/admin/refunds` route with a clear refund review workflow.
- `/api/admin/refunds` route with `canManageRefunds` protection and Zod validation.
- `RefundItem` Prisma model for line-level refund quantity, amount, and restock intent.
- Refund legal copy and admin settings visibility.
- Server-side Stripe refund provider.
- Stripe refund webhook reconciliation.
- Order and order-item refund status fields.
- Inventory restock ledger hook.
- Affiliate commission reversal hook.
- Printful and digital access manual-review markers.

## Required Production Behavior

1. Validate order, payment, fulfillment, digital access, and product policy.
2. Create Stripe refund from server-side code when configured.
3. Record refund and refund item rows.
4. Reverse affiliate commissions across direct and enabled ambassador levels.
5. Restock inventory only when policy and product state allow it.
6. Write audit logs and customer/admin notifications.

## Remaining Work

Refund execution is implemented locally, but it should not be considered launch-complete until Stripe sandbox refunds, partial refunds, webhook idempotency, inventory restock, and affiliate reversal are tested end to end against the target Railway/Neon environment.
