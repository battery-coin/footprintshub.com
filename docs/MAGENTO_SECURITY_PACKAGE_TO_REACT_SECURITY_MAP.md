# Magento Security Package To React Security Map

## Magento Security Package Findings

The inspected Magento security package includes:

- TwoFactorAuth modules with Google TOTP, Duo, Authy, and U2F/WebAuthn provider engines.
- Admin predispatch observer that enforces 2FA.
- Admin user 2FA configuration storage and encrypted secret patches.
- CLI reset/provider tooling.
- ReCaptcha modules for admin, checkout, customer, contact, newsletter, review, wishlist, PayPal, REST, GraphQL, and UI forms.
- Securitytxt module serving `/.well-known/security.txt` and signature content.
- ACL, admin routes, webapi routes, observers, plugins, DI configuration, setup patches, and tests.

## React/Next.js Mapping

| Magento Security Feature | React/Next Target | Current Status | Priority |
|---|---|---|---|
| Admin 2FA | Auth provider with MFA/passkeys | documented | P2 |
| ReCaptcha for forms | Turnstile/reCAPTCHA abstraction | documented | P2 |
| Security.txt | Static route or Cloudflare response | documented | P2 |
| ACL resources | `UserRole` and shop-scoped checks | partial | P1 |
| Admin session protection | Auth middleware/provider | partial | P1 |
| Password reset throttling | Auth provider rate limits | deferred | P2 |
| CSP | Next headers and Cloudflare | partial | P1 |
| Web API authorization | Route handlers with Zod/admin secret/service token | partial | P1 |
| Audit logs | `AdminAuditLog` and `AffiliateAuditLog` | partial | P1 |
| Encrypted secrets | env vars and encrypted payout details | partial | P1 |
| Bot protection | Cloudflare WAF and form challenge | docs | P1 |

## Implemented In This Pass

- Security headers in `next.config.ts`.
- Stripe webhook signature verification remains active.
- Webhook event idempotency model and service.
- Admin audit log model and writer.
- Zod validation for cart, checkout, affiliate, and admin status APIs.
- Hashed IP handling for affiliate fraud helpers.
- Server-only secret placeholders in `.env.example`.
- No raw payment data storage.

## Production Requirements Before Launch

- Replace temporary admin-secret protection with real auth and role checks.
- Add MFA/passkeys for platform/admin users.
- Add Cloudflare WAF managed rules and rate limiting.
- Add Turnstile or reCAPTCHA to affiliate application, checkout abuse-sensitive forms, and admin login.
- Add reviewed CSP for production scripts, images, analytics, Stripe, and future Hero Studio embeds.
- Add `/.well-known/security.txt`.
- Encrypt payout details before persistence.
- Add security event monitoring and alerting.
