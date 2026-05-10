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
| `railway --version` | not installed | Railway CLI is not present locally; dashboard deployment is documented as primary. |
| `GET http://127.0.0.1:3001/api/health` | pass | Returned `{ "ok": true, "service": "footprintshub-commerce", "environment": "railway-temp-ready" }` from the current build. |

## Remaining Railway Warnings

- Railway deployment has not been performed from this machine.
- Neon `DATABASE_URL` has not been tested against a real Neon project in this pass.
- Cloudflare nameservers and custom domain were intentionally not changed.
