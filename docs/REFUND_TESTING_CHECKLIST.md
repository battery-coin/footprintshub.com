# Refund Testing Checklist

## Automated Checks Run

- `npx prisma validate`
- `npx prisma generate`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`

## Required Sandbox QA

1. Create a paid Stripe test order.
2. Create a full refund through `/api/admin/refunds`.
3. Verify Stripe returns a refund ID.
4. Verify order status becomes `refunded`.
5. Verify order item refund status becomes `refunded`.
6. Create a partial item refund.
7. Verify refund cannot exceed remaining refundable amount.
8. Verify duplicate Stripe refund webhook does not duplicate side effects.
9. Verify direct affiliate commission reversal.
10. Verify 7-level affiliate commission reversal.
11. Verify paid commission reversal creates a negative ledger entry.
12. Verify inventory restock ledger entry when `restock=true`.
13. Verify no-restock refund does not increment inventory.
14. Verify digital download is marked for manual review by default.
15. Verify Printful progressed order gets manual-review warning.
16. Verify customer return request page loads.
17. Verify non-refund admins receive Access Denied.
18. Verify provider-initiated refund reconciliation from Stripe webhook.

## Not Done In This Pass

No live Stripe refund was issued. Run Stripe sandbox QA before launch.
