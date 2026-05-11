# Admin Settings Model

Date: 2026-05-11

## Purpose

Some admin controls are configuration, not first-class commerce entities. The settings model provides safe persistence for those values without creating duplicate models for every small setting.

## Models

`ShopSetting`

- shop-scoped
- keyed by `shopId + key`
- stores JSON values
- includes a category for grouped admin pages
- stores optional updater user ID

`PlatformSetting`

- platform-wide
- keyed by `key`
- stores JSON values
- includes a category for grouping
- stores optional updater user ID

## Helper

Implemented in `src/lib/settings/settings-service.ts`:

- `getShopSetting(shopId, key)`
- `setShopSetting({ shopId, key, value, category })`
- `getPlatformSetting(key)`
- `setPlatformSetting({ key, value, category })`
- `getSettingsByCategory(shopId, category)`

## API

`/api/admin/settings`

- `GET`: list settings by category
- `PUT`: upsert one shop setting
- protected by the existing `ADMIN_SECRET` guard
- validates writes with Zod

## Secret Rule

Secrets must not be stored in this model unless encryption is added. Store only presence flags or non-secret settings. Stripe, Printful, Cloudflare, Railway, Neon, Coinbase, and email secrets stay in environment variables.
