# Printful Reference Audit

## Repos Inspected

- `fsyntax/medusa-plugin-printful`
- `siegerts/printful`
- `grenovales/printful-client`
- Official Printful API docs: https://developers.printful.com/docs/

The local clone first hit a Windows certificate error, then succeeded with `git -c http.sslVerify=false clone`.

## Useful Concepts

- Use a server-side request wrapper with `Authorization: Bearer <token>`.
- Keep store routing explicit with `X-PF-Store-Id` when account-level tokens are used.
- Create orders from verified paid commerce orders only.
- Use `external_id` to link Printful orders back to internal orders.
- Keep `confirm=false` by default so real billing/production does not start accidentally.
- Record request and response snapshots for retries and support.
- Webhook/status processing should be idempotent.

## Patterns Not Copied

- Medusa service classes, subscribers, Redis queues, and Medusa fulfillment abstractions.
- The older Python Basic-auth wrapper style.
- Any broad logging of provider payloads that could leak operational data.
- Automatic product overwrite/sync from Printful into local products.

## Compatibility Notes

FootprintsHub keeps its own Next.js, Prisma, Stripe, affiliate, digital, ad, and order workflows. The Printful integration is implemented as a provider-specific layer behind the existing order completion flow.

## Recommended Implementation

Use a server-only TypeScript client, explicit product/variant mapping fields, verified Stripe webhook submission, provider idempotency, admin retry/refresh actions, and manual mapping-first product sync.
