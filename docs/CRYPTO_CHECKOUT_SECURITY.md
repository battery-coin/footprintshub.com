# Crypto Checkout Security

- Coinbase Business API credentials are read only from server environment variables.
- Coinbase credentials are not exposed through `NEXT_PUBLIC_`.
- Coinbase webhook requests require a webhook secret and signature verification.
- Return URLs do not mark an order paid.
- Coinbase paid status triggers the same order completion workflow used by Stripe.
- Duplicate webhooks are ignored through `WebhookEvent`.
- Wallet verification uses nonce + EVM signature verification with `viem`.
- Wallet verification does not authorize token transfers or payments.
- Private keys, seed phrases, mnemonics, and recovery phrases are never requested or stored.
- Admin crypto payment pages show configuration presence only, never secret values.
- Cloudflare WAF/rate limits should be added for `/api/checkout/*`, `/api/webhooks/*`, and `/api/wallet/*`.
