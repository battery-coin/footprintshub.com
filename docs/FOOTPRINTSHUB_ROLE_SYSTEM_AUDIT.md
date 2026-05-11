# FootprintsHub Role System Audit

Date: 2026-05-11

## Current state before this pass

- Auth is still MVP/server-side and primarily environment/bootstrap driven.
- `PLATFORM_OWNER_EMAIL`, `ADMIN_EMAILS`, and `ADMIN_SECRET` already existed as temporary control inputs.
- Several admin APIs previously checked only `ADMIN_SECRET`.
- The admin sidebar showed every admin link to any visitor who could render `/admin`.
- Broad `isAdmin` behavior existed through `ADMIN_EMAILS`.
- No owner-only role assignment UI existed.
- No dedicated platform role table existed for the requested specific roles.
- Sensitive actions were not consistently written to a central audit log.

## Implementation path

- Added `AppRole`, `UserAppRole`, and `AuditLog` to Prisma.
- Added a specific permission matrix in TypeScript.
- Updated `isAdmin` compatibility behavior so it means `canViewAdmin`, not broad unlimited power.
- Added owner role management under `/owner/roles`.
- Added owner/security audit log view under `/owner/audit-logs`.
- Added permission-aware admin sidebar filtering.
- Added page-level admin guards through `AdminShell requiredPermission`.
- Added API permission guard helpers for sensitive admin/owner APIs.

## Remaining auth limitation

The project still needs a real user session provider before production. Until then, `PLATFORM_OWNER_EMAIL` and the owner bootstrap script are the bridge from environment configuration to database roles.
