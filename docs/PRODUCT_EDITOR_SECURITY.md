# Product Editor Security

Date: 2026-05-10

## Implemented

- Admin API routes use the existing `ADMIN_SECRET` guard.
- Server-side Zod validation is required for product writes.
- Product writes are shop-scoped to the default active shop.
- CSV import has a size limit.
- API import includes URL validation and private network blocking.
- Cloudflare R2 uploads validate MIME type, block SVG, and enforce the configured size limit.
- R2 credentials are used only in server route handlers and must not be exposed with `NEXT_PUBLIC_`.
- Admin audit logs are written for product create/update when a database is connected.

## Remaining

- Replace temporary secret gating with full authenticated admin sessions.
- Add CSRF protection for admin write actions after session auth lands.
- Add rate limiting for import endpoints.
- Add delete-from-R2 cleanup when media is removed from products.
