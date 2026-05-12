# Product Type Security

## Digital downloads

- Tokenized links.
- Expiration and download limits.
- Access logs.
- Protected storage recommended.

## Subscriptions

- Stripe webhook signature verification remains required.
- Subscription state should be trusted from Stripe webhooks, not client UI.

## NFT-linked products

- No private keys or seed phrases.
- Manual/claim-based flow only.

## Services

- Customer briefs and notes should be treated as private customer data.
