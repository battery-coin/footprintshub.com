# Security Checklist

## Implemented Baseline

- Stripe webhook signature verification.
- Webhook idempotency table.
- Zod validation for important API payloads.
- Server-side checkout price recalculation.
- Inventory deduction idempotency keys.
- Admin audit log model.
- Affiliate audit log model.
- Hashed IP helper for affiliate fraud detection.
- Security headers in `next.config.ts`.
- `.env.example` uses placeholders only.
- No raw card data storage.

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
- Moderate product reviews before public display.
- Enforce download entitlements, limits, expiration, and shop scope.
- Validate file upload type, size, storage path, and public/private access.
- Check admin permissions before product, order, return, payout, settings, and user actions.
- Keep gift vouchers, store credit, and loyalty balances ledger-based.
- Do not expose customer private data in wishlist, review, return, or download routes.
