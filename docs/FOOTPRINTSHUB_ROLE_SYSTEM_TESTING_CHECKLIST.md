# FootprintsHub Role System Testing Checklist

- Owner can access `/owner/roles`.
- Owner can assign `admin_products`.
- Owner can revoke `admin_products`.
- Role assignment creates `role.assigned` audit log.
- Role revocation creates `role.revoked` audit log.
- Admin Products can access product pages.
- Admin Products cannot access owner role pages.
- Affiliate Manager can manage affiliate plans/levels.
- Affiliate Manager cannot approve payouts unless also payout approver.
- Payout Approver can access payout approval APIs when implemented.
- Finance Manager can view finance reports but cannot change payout destination.
- Suspended users receive no member/admin permissions.
- Unauthorized users see `/access-denied` or the `AccessDenied` component.
- Admin sidebar hides unauthorized links.
- Sensitive APIs reject unauthorized callers server-side.

Latest checks:

- `npx prisma format`: passed
- `npx prisma validate`: passed
- `npx prisma generate`: passed
- `npm run test`: passed
- `npm run typecheck`: passed after fixes
