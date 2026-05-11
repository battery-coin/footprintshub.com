# Build And QA Report

## Prisma P1012 Fix

Prisma validation failed with:

`Error validating field orderItem in model Refund: The relation field orderItem on model Refund is missing an opposite relation field on the model OrderItem.`

Fixed by adding the missing `OrderItem.refunds Refund[]` back relation while keeping `OrderItem.refundItems RefundItem[]` for line-level refund records.

## Commands Run

| Command | Result | Notes |
| --- | --- | --- |
| `pwd` | pass | Confirmed working tree under `C:\Users\saveo\OneDrive\Documents\GitHub\footprintshub.com`; sandbox display path differed, but Git root resolved to the project path. |
| `git status --short --branch` | pass | Branch: `full-mvp-audit-polish`. |
| `git diff -- prisma/schema.prisma` | pass | Confirmed schema changes before commit. |
| `npx prisma format` | pass | Formatted `prisma/schema.prisma`. |
| `npx prisma validate` | initial fail | Failed because `DATABASE_URL` was not present in the shell environment, not because of relation syntax. |
| `$env:DATABASE_URL=...; npx prisma validate` | pass | Schema is valid. |
| `npx prisma generate` | pass | Prisma Client generated successfully. |
| `npm run typecheck` | pass | TypeScript check passed. |
| `npm run lint` | pass | ESLint passed. |
| `npm test` | pass | 49 tests passed. |
| `npm run build` | pass | Next.js production build passed and generated 115 static pages. |
| `GET http://127.0.0.1:3000/api/health` | pass | Returned `{ "ok": true, "service": "footprintshub-commerce" }`. |

## Commit Made

- `fd9d79c4 Fix OrderItem refund relation`

## Warnings

- Prisma warns that `package.json#prisma` config is deprecated and should eventually move to a Prisma config file before Prisma 7.
- npm reports a newer major npm version is available; this does not block the build.

## Railway Temporary Deployment Prep - 2026-05-10

| Command | Result | Notes |
| --- | --- | --- |
| `npx prisma format` | pass | Schema formatted. |
| `npx prisma validate` | pass | Loaded `DATABASE_URL` from local `.env`; schema is valid. |
| `npx prisma generate` | pass | Prisma Client generated. |
| `npm install` | pass with warnings | Dependencies already up to date. Warnings: npm major update available, `eslint-visitor-keys` engine wants Node `^20.19.0 || ^22.13.0 || >=24`, current Node is `22.12.0`, and npm audit reports 2 moderate issues. |
| `npm run build` | pass | Next.js production build passed; 115 static pages generated. |
| `npm run lint` | pass | ESLint passed. |
| `npm run typecheck` | pass | TypeScript check passed. |
| `railway --version` | pass | Railway CLI `4.57.1` was installed and used from David's interactive PowerShell session. |
| `GET http://127.0.0.1:3001/api/health` | pass | Returned `{ "ok": true, "service": "footprintshub-commerce", "environment": "railway-temp-ready" }` from the current build. |
| `railway up --detach --service footprintshubcom` | pass | Local project uploaded to Railway service `footprintshubcom`. |
| `railway domain --service footprintshubcom` | pass | Created Railway-provided temporary domain `https://footprintshubcom-production-155d.up.railway.app`. |
| `GET https://footprintshubcom-production-155d.up.railway.app/api/health` | pass | Returned `ok=true`, `service=footprintshub-commerce`, and `environment=railway-temp-ready`. |

## Remaining Railway Warnings

- Railway deployment has been performed from David's authenticated PowerShell session.
- Neon `DATABASE_URL` has not been tested against a real Neon project in this pass.
- Cloudflare nameservers and custom domain were intentionally not changed.

## Affiliate Three-Structure Plan Builder - 2026-05-10

| Command | Result | Notes |
| --- | --- | --- |
| `npx prisma format` | pass | Schema formatted after adding Binary, Matrix, and Unilevel structure support. |
| `npx prisma validate` | pass | Prisma schema is valid. Prisma emitted the non-blocking `package.json#prisma` deprecation warning. |
| `npx prisma generate` | pass | Prisma Client generated successfully. |
| `npm test` | pass | 54 tests passed, including percentage/bps helpers and structure template tests. |
| `npm run lint` | pass | ESLint passed. |
| `npm run typecheck` | pass | TypeScript check passed after aligning new structure fields with affiliate types. |
| `npm run build` | pass | Next.js production build passed and generated 119 static pages. |

### Notes

- Unilevel is the functional launch payout engine.
- Binary and Matrix are configurable, persisted, previewable, and explicitly marked scaffolded until their placement/volume engines are completed and tested.
- Requested admin table row edit actions were added across products, categories, collections, inventory, Printful, fulfillment, shipping options, promotions, sales channels, regions, tax, and affiliates.

## Shopify-Like Product Editor - 2026-05-10

| Command | Result | Notes |
| --- | --- | --- |
| `npx prisma format` | pass | Product editor schema additions formatted. |
| `npx prisma validate` | pass | Prisma schema is valid. |
| `npx prisma generate` | pass | Prisma Client generated successfully. |
| `npm test` | pass | 58 tests passed, including product import, margin, and scheduled discount helpers. |
| `npm run lint` | pass | ESLint passed. |
| `npm run typecheck` | pass | TypeScript check passed. |
| `npm run build` | pass | Next.js production build passed and generated 125 static pages. |

### Notes

- `/admin/products/new` and `/admin/products/[id]` now use the reusable `ProductEditor`.
- Product persistence works when `DATABASE_URL` and the reviewed Prisma migration are applied.
- Direct Cloudflare R2 image upload was added in the follow-up pass; the editor also keeps image URL fallback support.

## Cloudflare R2 Product Media - 2026-05-10

| Command | Result | Notes |
| --- | --- | --- |
| `railway up --detach --service footprintshubcom` | blocked | Codex shell is not authenticated with Railway: `Unauthorized. Please login with railway login`. David's authenticated PowerShell can run the deploy command. |
| `npm install @aws-sdk/client-s3` | pass | Added the S3-compatible client used by Cloudflare R2. npm reported the existing 2 moderate audit issues and a non-blocking local Node engine warning. |
| `npx prisma format` | pass | No schema changes were required for R2. |
| `npx prisma validate` | pass | Prisma schema is valid. |
| `npx prisma generate` | pass | Prisma Client generated successfully. |
| `npm test` | pass | 63 tests passed, including R2 filename/key/upload validation helpers. |
| `npm run lint` | pass | ESLint passed. |
| `npm run typecheck` | pass | TypeScript check passed. |
| `npm run build` | pass | Next.js production build passed and generated 126 static pages. |
| Live `/api/admin/products/media/upload` check | issue | Railway returned 404 for this path after deploy, likely because it sits under the dynamic products route group. |
| Upload endpoint path update | fixed | Added `/api/admin/product-media/upload` and updated the editor/docs to use the non-conflicting route. |

### R2 Notes

- `/api/admin/product-media/upload` is available as the server-side product media upload endpoint.
- `/admin/products/new` and `/admin/products/[id]` can upload image files to R2 when Railway has the `CLOUDFLARE_R2_*` variables configured.
- SVG uploads are intentionally blocked.
- Product media URL fallback remains available.

## Admin Affiliate Control Pass - 2026-05-11

| Command | Result | Notes |
| --- | --- | --- |
| `npx prisma format` | pass | Formatted schema after settings model changes. |
| `npx prisma validate` | pass | Prisma schema is valid. Initial parallel run timed out, standalone rerun passed. |
| `npx prisma generate` | pass | Prisma Client generated. |
| `npm test` | pass | 63 tests passed. |
| `npm run lint` | pass | ESLint passed. |
| `npm run typecheck` | pass | TypeScript check passed after tightening JSON settings validation. |
| `npm run build` | pass | Next.js production build passed and generated 130 routes/pages. |

### Notes

- Added active affiliate plan API aliases.
- Repaired `/admin/affiliates/levels` to edit the active plan.
- Added missing `/admin/refunds/[id]` and `/admin/customers/[id]` routes.
- Added `ShopSetting` category/updater fields and `PlatformSetting`; Neon needs a reviewed migration before these DB changes are live.
