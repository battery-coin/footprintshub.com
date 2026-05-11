# Product CSV Import Guide

Date: 2026-05-10

## Routes

- UI panel: `/admin/products/new`
- API: `/api/admin/products/import/csv`
- Template: `/templates/footprintshub-product-import-template.csv`

## Supported Behavior

- CSV preview
- CSV import as product drafts or row-defined statuses
- Image URL import
- Category, collection, tag, SKU, inventory, SEO, and fulfillment fields
- Import job tracking when a database is connected

## Limits

- MVP CSV body limit: 500 KB
- Error reports are tracked in the API response and import job counts; downloadable error reports are a future enhancement.
