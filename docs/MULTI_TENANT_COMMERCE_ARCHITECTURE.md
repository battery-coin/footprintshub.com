# Multi-Tenant Commerce Architecture

## Tenant Examples

- `footprintshub.com`: flagship FootprintsHub store
- `www.footprintshub.com`: flagship alias
- `shop.herostudio.org`: Hero Studio marketplace
- `creatorname.herostudio.org`: creator/fan-club shop
- `matrixdecoded.herostudio.org`: franchise shop
- `footprints.herostudio.org`: franchise shop

## Resolution Strategy

Request host resolution should check:

1. Exact `ShopDomain.hostname`
2. Root flagship domains
3. System subdomain mapping
4. Creator subdomain mapping
5. Localhost/dev fallback to flagship shop

The existing resolver remains at `src/lib/tenant/resolveTenant.ts`; a compatibility alias exists at `src/lib/tenant/resolve-tenant.ts`.

## Database Strategy

Use one shared Neon database with strict `shopId` scoping on products, carts, orders, discounts, affiliate programs, payouts, inventory, shipping, tax, and audit logs.

Platform owner views may query across shops. Shop owner views must filter by owned `shopId`.

## Cloudflare Plan

- Point `footprintshub.com` and `www.footprintshub.com` to Railway.
- Add `shop.herostudio.org` to Railway when Hero Studio commerce is ready.
- Add wildcard `*.herostudio.org` in Cloudflare if Railway plan supports wildcard/custom domain routing.
- If Railway custom-domain limits become a blocker, use a Cloudflare Worker as the front router and forward to Railway with the original host header.

## Shop Isolation Rules

- Public catalog reads resolve shop from host.
- Cart creation stores `shopId`.
- Checkout validates all products belong to the same shop.
- Orders, payments, shipments, refunds, commissions, and inventory ledgers must use the order's `shopId`.
- Admin writes require both role authorization and shop ownership.
- Affiliate programs are shop-specific.
- Discount codes are shop-specific.

## Creator Shop Onboarding

1. Create `Shop`.
2. Create `ShopDomain` for `{creator}.herostudio.org`.
3. Configure catalog defaults.
4. Configure shipping/tax placeholders.
5. Enable or disable affiliate program.
6. Add creator products.
7. Connect Hero Studio creator ID.
8. Publish shop link to Hero Studio profile.

## OpenCart-Derived Tenant Objects

The OpenCart review adds these shop-scoped objects to the tenant model:

- brands
- product options
- reviews
- wishlists and compare lists
- gift vouchers
- store credit ledgers
- loyalty point ledgers
- return requests
- download assets and entitlements
- information pages
- banners
- geo zones, tax rates, weight classes, length classes
- admin roles and assignments

Global localization objects such as countries, zones, and currencies can be shared reference data.
