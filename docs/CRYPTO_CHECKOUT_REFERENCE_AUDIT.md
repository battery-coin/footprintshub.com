# Crypto Checkout Reference Audit

## Coinbase Business Checkouts API

Coinbase Business Checkouts are the P0 crypto payment path. The current docs expose a server-created checkout endpoint that returns a hosted `url`, supports metadata, redirect URLs, expiration, and an idempotency header. Authentication uses a CDP-style bearer JWT generated from the API key name and private key/secret material.

Important behavior: the success redirect means the customer returned from Coinbase. It is not final payment proof. FootprintsHub must update paid status from a signed Coinbase webhook or a verified server-side Coinbase status retrieval.

## Deprecated Payment Link APIs

The older Payment Link APIs are not the target for this integration. New FootprintsHub crypto checkout code uses the Checkouts API wrapper only.

## Coinbase Wallet / WalletConnect / Wagmi

Wallet connection is useful for identity, future token-gated access, future utility token flows, and Hero Studio compatibility. It is not required for Coinbase hosted checkout.

P1 wallet connection in this pass is intentionally small:

- browser EVM provider connect
- nonce creation
- signed message verification with `viem`
- verified wallet storage

Full wagmi, Coinbase Wallet SDK, and WalletConnect/Reown UI are deferred until the owner wants richer wallet UX.

## Security Notes

- Coinbase Business credentials are server-only.
- No private key, seed phrase, or wallet recovery phrase is requested or stored.
- Frontend wallet actions do not mark orders paid.
- Webhooks are idempotent through `WebhookEvent` and payment/order idempotency keys.
