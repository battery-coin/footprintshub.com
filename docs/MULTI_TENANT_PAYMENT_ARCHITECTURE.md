# Multi-Tenant Payment Architecture

Current FootprintsHub MVP:

- Platform Stripe account.
- Platform Coinbase Business account.
- Shop-aware orders, payment sessions, webhook events, and crypto payments.

Future Hero Studio:

- Platform account mode for `shop.herostudio.org`.
- Creator account mode only after encrypted credential storage, owner approval, audit logs, and security review.
- Shop-level payment enable flags.
- Shop-scoped success/cancel URLs and provider settings.

Creators should not enter Coinbase, Stripe, wallet, or Printful secrets until encrypted credential management and owner-controlled RBAC are complete.
