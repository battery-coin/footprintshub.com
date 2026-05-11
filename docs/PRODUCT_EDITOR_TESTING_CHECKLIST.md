# Product Editor Testing Checklist

Date: 2026-05-10

- [x] Prisma schema validates.
- [x] Product create API validates full product payload.
- [x] Product edit API validates full product payload.
- [x] Image URL gallery controls render.
- [x] Variant generator renders editable rows.
- [x] Duplicate SKU validation exists.
- [x] Cost/profit/margin helpers tested.
- [x] Scheduled discount helper tested.
- [x] CSV parser and mapper tested.
- [x] API import SSRF guard tested.
- [ ] Apply reviewed migration to Neon.
- [ ] Verify product save against Railway + Neon with `ADMIN_SECRET`.
- [ ] Verify Printful IDs against real Printful catalog.
- [ ] Verify tax settings with configured production tax provider.
