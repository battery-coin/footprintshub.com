# Testing Checklist

## Build

- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test`

## Storefront

- Homepage loads
- Product list loads
- Product detail loads
- Collection pages load
- Legal pages load
- Product cards show price, type, franchise, and add-to-cart

## Cart

- Add to cart works
- Cart count updates
- Drawer opens
- Increase quantity works
- Decrease quantity works
- Remove item works
- Clear cart works
- Subtotal is correct
- Guest cart persists in browser storage

## Checkout

- Empty/invalid checkout route rejects request
- Checkout route recalculates product prices server-side
- Checkout route returns clear error when Stripe is not configured
- Stripe Checkout Session is created when Stripe env vars are valid
- Success and cancel pages load
- Stripe webhook rejects missing/invalid signatures

## Admin

- `/admin` loads
- `/admin/products` loads
- `/admin/products/new` loads
- `/admin/products/[id]` loads
- `/admin/orders` loads
- `/admin/shops` loads
- `/admin/discounts` loads
- Set `ADMIN_SECRET` before exposing admin routes publicly

## Tenant Routing

- `localhost:3000` maps to flagship shop
- `footprintshub.com` maps to flagship shop
- `www.footprintshub.com` maps to flagship shop
- `shop.herostudio.org` maps to platform shop
- `creatorname.herostudio.org` maps to creator shop

## Security

- `.env` is ignored
- Stripe secrets are not exposed to frontend
- Neon password is not committed
- Client-side prices are never trusted at checkout
- Blind box and booster pack odds are published before selling randomized products
