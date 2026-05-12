# Refund System Architecture

## Refund Types

- `full`: refunds all remaining refundable order amount.
- `partial`: refunds selected items, quantities, or a validated amount.
- `manual`: records an external/manual refund without calling Stripe.
- `store_credit`: creates store credit instead of returning cash.
- `chargeback_adjustment`: records payment-provider dispute effects.

## Lifecycle

Refund status:

- `requested`
- `approved`
- `processing`
- `succeeded`
- `failed`
- `cancelled`
- `rejected`
- `partially_succeeded`

Order refund status:

- `not_refunded`
- `refund_requested`
- `partially_refunded`
- `refunded`
- `refund_failed`
- `chargeback_opened`
- `chargeback_lost`
- `chargeback_won`

## Workflow

1. Admin calls `POST /api/admin/refunds`.
2. Server verifies `canManageRefunds`.
3. Server loads the order, paid payment, refunds, and order items.
4. Server recalculates refundable amount.
5. Server creates `Refund` and `RefundItem` rows.
6. If `processNow=true`, server processes the provider action:
   - Stripe refund through server-only Stripe SDK.
   - Store credit ledger entry.
   - Manual refund record.
7. On success, side effects run in a transaction:
   - order refund status update
   - order item refunded quantity/amount update
   - inventory restock ledger entry if requested
   - affiliate commission reversals
   - digital unlock manual-review marker
   - Printful review flag when applicable

## Provider Webhooks

Stripe refund and chargeback-related webhooks are stored idempotently and reconciled by provider refund ID, payment intent, or charge.

The webhook is allowed to create a provider-initiated refund record if a refund occurs outside the FootprintsHub admin UI.

## Security

Refund amounts are never trusted from the browser without server validation. Stripe refunds run only server-side and use idempotency keys.
