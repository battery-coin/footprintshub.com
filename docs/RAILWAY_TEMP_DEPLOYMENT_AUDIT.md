# Railway Temporary Deployment Audit

## Project

- Path: `C:\Users\saveo\OneDrive\Documents\GitHub\footprintshub.com`
- Branch: `railway-temp-neon-cloudflare-setup`
- Remote: `https://github.com/battery-coin/footprintshub.com.git`

## Stack Detected

- Framework: Next.js App Router `16.2.6`
- UI: React `19.2.6`, Tailwind CSS
- Language: TypeScript
- ORM: Prisma `6.19.3`
- Database target: Neon Postgres through `DATABASE_URL`
- Package manager: npm

## Commands

- Build: `npm run build`
- Start: `npm run start`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Prisma format: `npx prisma format`
- Prisma validate: `npx prisma validate`
- Prisma generate: `npx prisma generate`
- Seed: `npm run prisma:seed`

## Railway Status

- `railway.json` exists.
- Start command is `npm run start`.
- Healthcheck path is `/api/health`.
- Health route does not require database access.
- App uses normal Next.js start behavior and should respect Railway `PORT`.
- No custom server was found.

## Health Route

`/api/health` now returns:

```json
{
  "ok": true,
  "service": "footprintshub-commerce",
  "environment": "railway-temp-ready"
}
```

## Required Environment Variables

Railway must include `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_SECRET`, `COMMERCE_INTERNAL_API_TOKEN`, and `AFFILIATE_IP_HASH_SECRET` before production-like testing. Stripe, Printful, Coinbase, and email provider variables can remain disabled or blank for the first temporary-domain deployment.

## Local URL Search

Production-impacting fallback in `src/lib/url.ts` was changed from a local URL to `https://footprintshub.com`. Localhost references remain only in docs, tests, and tenant resolver logic where they are intentional.

## Current Blockers

- Neon project and `DATABASE_URL` must be created manually.
- Railway project is not deployed yet.
- Cloudflare is not active yet and should not be switched until the Railway temporary URL passes tests.
- Railway CLI is not installed locally.

