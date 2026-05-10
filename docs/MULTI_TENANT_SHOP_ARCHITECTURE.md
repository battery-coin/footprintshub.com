# Multi-Tenant Shop Architecture

FootprintsHub starts as the flagship shop, but the schema and host resolver are multi-tenant from day one.

## Shop Domains

- `footprintshub.com` -> flagship FootprintsHub shop
- `www.footprintshub.com` -> flagship FootprintsHub shop
- `shop.herostudio.org` -> platform shop
- `creatorname.herostudio.org` -> creator shop

## Tenant Resolution

Implemented in:

`src/lib/tenant/resolveTenant.ts`

The resolver:

- reads the host header
- normalizes local development hosts
- maps FootprintsHub domains to the flagship shop
- maps `shop.herostudio.org` to the platform shop
- maps `{creator}.herostudio.org` to a creator shop slug
- returns `null` when no shop should resolve

## Database Rule

Every commerce object belongs to a shop:

- Product
- ProductVariant
- Cart
- CartItem
- Order
- OrderItem
- DiscountCode
- DigitalUnlock
- CreatorPayout

This keeps creator shops isolated while allowing shared platform administration later.

## Cloudflare Plan

Future wildcard DNS:

```text
*.herostudio.org -> Railway target
```

If Railway wildcard domains are limited on the active plan, use a Cloudflare Worker as a front router:

1. Receive wildcard request at Cloudflare.
2. Resolve hostname.
3. Proxy to Railway app with the original host forwarded.
4. Let the app resolve the shop from the forwarded host.

## Local Development

Localhost maps to the flagship shop by default.

Wildcard subdomain testing can be added later with hosts file aliases or a local DNS tool.
