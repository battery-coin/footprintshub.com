# Refund System Audit And Upgrade

## Added In This Pass

- `/admin/refunds` route with a clear refund review workflow.
- `/api/admin/refunds` route with `ADMIN_SECRET` protection and Zod validation.
- `RefundItem` Prisma model for line-level refund quantity, amount, and restock intent.
- Refund legal copy and admin settings visibility.

## Required Production Behavior

1. Validate order, payment, fulfillment, digital access, and product policy.
2. Create Stripe refund from server-side code when configured.
3. Record refund and refund item rows.
4. Reverse affiliate commissions across direct and enabled ambassador levels.
5. Restock inventory only when policy and product state allow it.
6. Write audit logs and customer/admin notifications.

## Remaining Work

Refund execution is scaffolded. It should not be considered production complete until Stripe sandbox refunds, partial refunds, webhook idempotency, inventory restock, and affiliate reversal are tested end to end.

