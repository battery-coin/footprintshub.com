# Order Completion By Product Type

`src/workflows/orders/complete-paid-order.ts` now centralizes product-type completion.

When a fully paid order completes:

- Digital downloads create download entitlements.
- Services create service orders.
- Subscriptions create subscription plans when needed, customer subscriptions, and subscription entitlements.
- NFT-linked products create NFT entitlements when an NFT product mapping exists.
- Inventory deduction and affiliate commissions run after entitlement processing.

The workflow marks order metadata with `productTypeCompletionAt` for idempotency.
