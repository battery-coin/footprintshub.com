# Security Audit And Hardening

## Implemented Or Existing

- Admin APIs use `ADMIN_SECRET` guard where present.
- Stripe webhook route exists for signature-based payment events.
- Zod validation is used in important APIs.
- `.env.example` documents server-only and public variables separately.
- Printful webhook route can enforce `PRINTFUL_WEBHOOK_SECRET` through a private header.
- Affiliate IP hashing is designed through `AFFILIATE_IP_HASH_SECRET`.
- Admin dashboard warns when `ADMIN_SECRET` is not configured.

## Added In This Pass

- Admin settings for payments, shipping, and legal readiness.
- Printful setup page and webhook security path.
- Refund API protected by `ADMIN_SECRET`.
- Affiliate admin list API protected by `ADMIN_SECRET`.

## Required Before Production

- Replace temporary admin secret gating with durable auth and role-based permissions.
- Add rate limiting for checkout, affiliate application, referral tracking, and admin APIs.
- Confirm Stripe webhook raw body and signature verification in production.
- Add Cloudflare WAF rules for admin, webhook, and checkout endpoints.
- Ensure no `NEXT_PUBLIC_` variable contains secrets.
- Keep Printful, Stripe, Coinbase, Neon, Railway, and Cloudflare credentials server-only.

