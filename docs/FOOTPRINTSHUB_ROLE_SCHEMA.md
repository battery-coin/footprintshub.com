# FootprintsHub Role Schema

Added:

- `AppRole`
- `UserAppRole`
- `AuditLog`
- `User.appRoles`
- `Shop.userAppRoles`

`UserAppRole` stores role, user, optional shop scope, assignment metadata, revocation time, and notes.

`AuditLog` stores actor, action, target, category, severity, JSON metadata, optional IP hash, and timestamp.

No secrets are stored in these tables.

Prisma status:

- `npx prisma format`: passed
- `npx prisma validate`: passed
- `npx prisma generate`: passed
