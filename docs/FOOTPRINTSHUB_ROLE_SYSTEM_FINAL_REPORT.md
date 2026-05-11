# FootprintsHub Role System Final Report

## 1. Existing role/auth state

The app had MVP environment-based admin access and a broad `isAdmin` helper. Admin routes and APIs were not consistently permission-specific.

## 2. Roles added

Added `AppRole` with owner, product, catalog, order, refund, finance, payout, affiliate, ads, sponsor, Printful, fulfillment, inventory, tax, security, analyst, shop owner, creator, affiliate, customer, fan, and suspended roles.

## 3. Permissions added

Added a typed permission matrix covering role management, products, pricing, catalog, orders, refunds, funds, payouts, affiliates, ads, sponsors, Printful, fulfillment, inventory, tax, customers, support, moderation, security, audit logs, analytics, shop settings, affiliate dashboard, and customer account access.

## 4. Database models added

- `UserAppRole`
- `AuditLog`
- `User.appRoles`
- `Shop.userAppRoles`

## 5. Owner bootstrap status

Added `npm run role:bootstrap-owner`. It assigns owner only when a user exists for `PLATFORM_OWNER_EMAIL`.

## 6. Owner UI status

Added:

- `/owner/roles`
- `/owner/audit-logs`

## 7. Routes protected

`AdminShell` now gates admin pages and accepts per-page `requiredPermission`. Admin page files were tagged with specific permissions for products, catalog, orders, refunds, fulfillment, tax, customers, affiliates, security, settings, and reports.

## 8. APIs protected

Added owner API guards and replaced selected sensitive admin APIs for products, orders, refunds, settings, and affiliate plan/structure management.

## 9. Sidebar filtering

Admin sidebar links now render only when the current user has the matching permission.

## 10. Broad admin removal

Generic admin is no longer modeled as a broad role. Legacy `isAdmin` means `canViewAdmin`.

## 11. Audit logs

Added audit helpers for roles, products, pricing, refunds, payouts, affiliate plans, ads, Printful retries, security settings, and denied access attempts.

## 12. Remaining setup

Add real session/auth provider before production. Run `npm run role:bootstrap-owner` after David's user exists. Apply a Prisma migration separately after review.

## 13. Verification

- `npx prisma format`: passed
- `npx prisma validate`: passed
- `npx prisma generate`: passed
- `npm run test`: passed, 63 tests
- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run build`: passed

## 14. Railway notes

This branch still needs to be pushed and deployed after the role-system commit. Configure `PLATFORM_OWNER_EMAIL` in Railway before using owner-only pages.

## 15. How David assigns roles

1. Set `PLATFORM_OWNER_EMAIL` to David's account email.
2. Ensure David's `User` exists in Neon.
3. Run `npm run role:bootstrap-owner`.
4. Open `/owner/roles`.
5. Assign only the narrow role needed for the person.

## 16. How to verify owner access

Open `/owner/roles`. If access is denied, check `PLATFORM_OWNER_EMAIL`, confirm the user row exists, and rerun `npm run role:bootstrap-owner`.
