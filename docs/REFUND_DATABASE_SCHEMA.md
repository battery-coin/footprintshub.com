# Refund Database Schema

## New And Expanded Concepts

`Refund`

- provider: `stripe`, `manual`, `store_credit`, `coinbase_future`
- type: `full`, `partial`, `manual`, `store_credit`, `chargeback_adjustment`
- status lifecycle
- provider refund IDs
- Stripe payment intent / charge IDs
- request, response, and error payload snapshots
- admin/customer notes
- approval and processing timestamps
- idempotency key

`RefundItem`

- shop/order scope
- order item
- quantity
- amount
- restock intent
- item reason

`Order`

- refund status
- refunded amount
- refundable amount
- refunded timestamp

`OrderItem`

- refunded quantity
- refunded amount
- refund status

`StoreCreditLedger`

- optional refund relation

`InventoryLedger`

- `refund_restock`
- `return_received`
- `refund_no_restock`

`AffiliateCommission`

- refund and chargeback reversal statuses.

`AffiliateWalletLedger`

- refund and chargeback debit types.

## Migration Note

The Prisma schema validates and generates successfully. Apply a real database migration before enabling production refunds against Railway/Neon.
