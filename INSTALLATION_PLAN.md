# Installation Plan

## Local Setup

1. Install Node.js LTS.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add a Neon Postgres `DATABASE_URL` when ready.
5. Run `npm run prisma:generate`.
6. Run `npm run prisma:migrate`.
7. Run `npm run prisma:seed`.
8. Run `npm run dev`.

The storefront can run with seed fallback data before Neon is connected. Checkout requires Stripe secrets.

## Database

Use Neon Postgres for hosted development and production.

Every product, cart, order, discount, digital unlock, and payout belongs to a `Shop` so the app can evolve into Hero Studio creator shops.

## Payments

Stripe Checkout is the first payment implementation. Battery Coin checkout is a future module and must not use investment, ROI, yield, or profit language.
