# Crypto Checkout Architecture

## Decision

FootprintsHub uses two separate layers:

- Payment checkout: Coinbase Business Checkouts API.
- Wallet identity: optional wallet connection and signed-message verification.

Wallet connection is never payment proof.

## Order Flow

1. Customer chooses Pay with Crypto.
2. Server recalculates cart prices and inventory.
3. Server creates a pending order and `PaymentSession`.
4. Server creates Coinbase checkout with order metadata.
5. Customer is redirected to Coinbase hosted checkout.
6. Return pages show pending/cancelled messaging only.
7. Signed Coinbase webhook updates `PaymentSession`, `CryptoPayment`, `Payment`, and `Order`.
8. When paid, the shared `completePaidOrder` workflow runs Printful, digital unlocks, ad campaigns, inventory, and affiliate commissions.

## Status Rules

- `COMPLETED` maps to paid.
- `EXPIRED` maps to expired.
- `FAILED` maps to failed.
- `DEACTIVATED` maps to cancelled.
- `REFUNDED` and `PARTIALLY_REFUNDED` map to refund statuses.

## Hero Studio Future

This structure supports future creator shops by keeping provider settings shop-aware and by keeping wallet identity separate from payment collection.

## Battery Coin Language

Battery Coin and other token payments must be described as utility token payment or checkout composition only. No investment, ROI, appreciation, yield, or passive income language is allowed.
