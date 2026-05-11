# Admin Owner Auth Model

Date: 2026-05-10

## Current MVP Model

FootprintsHub currently uses a temporary admin gate for owner/admin API routes:

- `ADMIN_SECRET`
- `PLATFORM_OWNER_EMAIL`
- `ADMIN_EMAILS`

The helper file is `src/lib/auth/roles.ts`.

## 2026-05-11 RBAC Upgrade

The broad admin concept has been replaced with owner-controlled role assignments:

- `src/lib/auth/permissions.ts` defines the permission matrix.
- `src/lib/auth/current-user.ts` resolves the current MVP owner/role context.
- `src/lib/auth/require-permission.ts` enforces server-side API permissions.
- `UserAppRole` stores role assignments.
- `AuditLog` records sensitive actions.

`ADMIN_EMAILS` is now only a narrow fallback for temporary operational access. It is not owner access and does not grant finance, payout, role-management, refund, security, tax, Stripe, Coinbase, or Printful secret-management power.

## Role Helpers

- `getCurrentUser()`
- `isPlatformOwner(user)`
- `isAdmin(user)`
- `isShopOwner(user, shopOwnerEmail)`
- `requireAdmin()`
- `requirePlatformOwner()`
- `requireShopOwnerOrPlatformOwner(shopOwnerEmail)`

## Limitations

This is not a complete production auth system. It is an MVP bridge so owner-facing routes and API writes can be separated from affiliate-facing pages.

Known limitations:

- There is no full user session provider yet.
- Admin pages are still primarily protected by deployment configuration and the temporary secret pattern.
- Client-side admin write actions need a production auth/session replacement before public launch.

## Production Recommendation

Replace the temporary gate with Auth.js, Clerk, Supabase Auth, or an equivalent session-backed auth system before exposing write-capable admin controls broadly.

Minimum production requirements:

- Session-backed admin identity
- Platform owner role
- Shop owner role
- Staff role permissions
- CSRF protection for admin writes
- Audit logging for plan edits, activations, payout approvals, refunds, and structure changes
