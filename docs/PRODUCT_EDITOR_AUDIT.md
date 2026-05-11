# Product Editor Audit

Date: 2026-05-10

## Current Route Before Upgrade

- Create route: `/admin/products/new`
- Edit route: `/admin/products/[id]`
- API route: `/api/admin/products`

## Before

The create/edit screens were small scaffold forms with title, slug, description, price in cents, and SKU. The primary button was disabled with a setup-required message.

## Gaps Found

- No working save from the product editor UI.
- No reusable ProductEditor component.
- No image gallery controls.
- No variant/options editor.
- No admin-only cost/profit/margin fields.
- No scheduled discount controls.
- No CSV/API import UI.
- No product export.
- No Printful mapping fields.
- No tax/shipping/fulfillment panels.
- No SEO preview or canonical URL field.
- No persistence for nested media, options, variants, and scheduled discounts.

## Priority

- P0 fixed: editor UI, validation, save API, images by URL, pricing, inventory, options/variants, tax/shipping/fulfillment, SEO.
- P1 fixed/scaffolded: CSV import, API import with SSRF guard, CSV export, scheduled discounts, Printful mapping fields, live preview.
- P2 remaining: direct Cloudflare R2 upload, advanced bulk editing, advanced tax engine, advanced shipping profiles, draft preview tokens.
