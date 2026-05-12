# Railway Affiliate Links URL Fix

Date: 2026-05-11

## Root Cause

Railway previously failed while prerendering `/affiliate/links` because URL construction used a base value without protocol:

```txt
footprintshubcom-production-155d.up.railway.app
```

`new URL("/", base)` requires a valid absolute URL base, such as:

```txt
https://footprintshubcom-production-155d.up.railway.app
```

## Files Changed

- `src/lib/url/site-url.ts`
- `src/lib/url.ts`
- `src/app/affiliate/links/page.tsx`
- `src/lib/affiliate/attribution.ts`
- `src/lib/affiliate/demo-data.ts`
- `src/app/products/[slug]/page.tsx`
- `.env.example`
- `docs/ENVIRONMENT_VARIABLES_RAILWAY_TEMP.md`
- `docs/RAILWAY_TEMP_DOMAIN_DEPLOYMENT_STEPS.md`

## New URL Helper

Added `src/lib/url/site-url.ts` with:

- `normalizeBaseUrl(input)`
- `getSiteUrl()`
- `buildAbsoluteUrl(path)`
- `buildReferralUrl(referralCode, path)`

`normalizeBaseUrl` trims input, adds `https://` when missing, removes trailing path/slash by returning `origin`, validates with `new URL`, and falls back to `https://footprintshub.com`.

## Affiliate Links Fix

`/affiliate/links` now uses `buildReferralUrl(demoAffiliate.referralCode, path)` and does not manually construct URL bases.

## Other URL Fixes

Product detail share URLs now use `buildAbsoluteUrl`.

Existing checkout code already imports `getSiteUrl`; that function now normalizes protocol-less Railway values through the shared helper.

## Build Test Results

- `npx prisma validate`: passed
- `npx prisma generate`: passed
- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run build`: passed
- bad env build with `NEXT_PUBLIC_SITE_URL=footprintshubcom-production-155d.up.railway.app`: passed
- correct env build with `NEXT_PUBLIC_SITE_URL=https://footprintshubcom-production-155d.up.railway.app`: passed

## Railway Env Correction

Set Railway:

```txt
NEXT_PUBLIC_SITE_URL=https://footprintshubcom-production-155d.up.railway.app
```

Do not use the protocol-less domain.

## Next Railway Steps

Redeploy Railway after pushing this branch, then test:

- `/api/health`
- `/affiliate/links`
- `/shop`
- `/admin`
