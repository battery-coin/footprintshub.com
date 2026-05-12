# Security Checklist

## Implemented Baseline

- Stripe webhook signature verification.
- Coinbase webhook signature verification before crypto-paid order completion.
- Webhook idempotency table.
- Zod validation for important API payloads.
- Server-side checkout price recalculation.
- Server-side Coinbase checkout creation; no client-submitted payment amounts are trusted.
- Inventory deduction idempotency keys.
- Admin audit log model.
- Affiliate audit log model.
- Hashed IP helper for affiliate fraud detection.
- Security headers in `next.config.ts`.
- `.env.example` uses placeholders only.
- No raw card data storage.
- Printful API key remains server-only.
- Printful handoff runs only after verified Stripe payment.
- Printful order creation uses internal idempotency and provider external IDs.
- Printful admin retry/refresh routes require `canManagePrintful`.
- Refund APIs require `canManageRefunds`.
- Stripe refunds are created only through server-side code.
- Refund amounts are recalculated server-side and cannot exceed remaining refundable amount.
- Stripe refunds use idempotency keys.
- Refund webhooks are recorded idempotently.
- Affiliate refund reversals are idempotent per refund and commission.
- Inventory refund restock entries are idempotent per refund and order item.

## Required Before Production

- Replace `ADMIN_SECRET` with real auth and role-based authorization.
- Add MFA/passkeys for platform and shop admins.
- Add Cloudflare WAF managed rules.
- Add Cloudflare rate limiting for auth, affiliate application, checkout, and webhooks.
- Add Turnstile or reCAPTCHA provider abstraction.
- Review and tighten CSP for production.
- Add `/.well-known/security.txt`.
- Encrypt payout details before writing them.
- Add secret scanning in CI.
- Add database backup and restore plan.
- Add webhook failure alerting.
- Add admin activity export.

## Never Commit

- `.env`
- `.env.local`
- Stripe secret keys
- Neon connection strings
- private keys
- database dumps
- production credentials
- Magento `auth.json`

## OpenCart-Derived Additions

- Validate product option payloads server-side before pricing.

## Ad Sales

- Require payment verification before campaign creation.
- Require admin approval before ads go live.
- Reject unsafe ad target URLs such as `javascript:` and non-http schemes.
- Disable or sanitize HTML ads before any live display.
- Validate creative file type and file size before storage uploads.
- Keep click/impression fraud controls on the launch checklist.
- Moderate product reviews before public display.
- Enforce download entitlements, limits, expiration, and shop scope.
- Validate file upload type, size, storage path, and public/private access.
- Check admin permissions before product, order, return, payout, settings, and user actions.
- Keep gift vouchers, store credit, and loyalty balances ledger-based.
- Do not expose customer private data in wishlist, review, return, or download routes.

## Medusa-Derived Additions

- Treat `PaymentProviderConfig.config` as non-secret unless encrypted; keep provider secrets in environment variables.
- Use `PaymentSession`, `WebhookEvent`, `CommerceEvent`, and `IdempotencyKey` for retry-safe workflows.
- Wallet connection uses single-use nonce and signed-message verification; wallet connection is never payment proof.
- Reserve inventory before checkout only with expiration and idempotency.
- Deduct inventory only after verified payment.
- Release reservations on checkout cancellation/expiration.
- Keep event subscribers server-only.
- Do not expose workflow errors or stack traces to buyers in production.
- Ensure future Hero Studio webhooks are signed and replay-protected.
