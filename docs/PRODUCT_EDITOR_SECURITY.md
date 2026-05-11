# Product Editor Security

Date: 2026-05-10

## Implemented

- Admin API routes use the existing `ADMIN_SECRET` guard.
- Server-side Zod validation is required for product writes.
- Product writes are shop-scoped to the default active shop.
- CSV import has a size limit.
- API import includes URL validation and private network blocking.
- Admin audit logs are written for product create/update when a database is connected.

## Remaining

- Replace temporary secret gating with full authenticated admin sessions.
- Add CSRF protection for admin write actions after session auth lands.
- Add file upload limits when direct binary uploads are implemented.
- Add rate limiting for import endpoints.
