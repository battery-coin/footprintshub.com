# Crypto Payment Schema

Added/extended concepts:

- `PaymentProviderConfigCode.coinbase_crypto`
- `PaymentSession.providerHostedUrl`
- `PaymentSession.expiresAt`
- `CryptoPayment`
- `WalletConnection`
- `WalletVerificationNonce`
- `Order.paymentProvider`
- `Order.cryptoPaymentStatus`
- `Order.paymentSessionId`
- `Order.paidAt`

## CryptoPayment

Stores Coinbase checkout ID, hosted URL, provider status, amount, currency, network/address metadata when returned, transaction hash when available, and raw status payload summary.

## WalletConnection

Stores verified public wallet address metadata only. It does not store private keys, seed phrases, wallet secrets, or signer credentials.

## WalletVerificationNonce

Stores single-use signed-message challenges. A nonce expires after ten minutes and is marked used after successful verification.

## Webhooks

The existing `WebhookEvent` model stores Coinbase webhook idempotency by provider and event ID.
