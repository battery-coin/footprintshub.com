# FootprintsHub Commerce

Custom Next.js ecommerce application for FootprintsHub and the future Hero Studio creator shop engine.

This branch pivots away from Magento and builds a lighter open-source commerce stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- Neon Postgres
- Stripe Checkout
- Native affiliate and ambassador commissions
- Railway hosting
- Cloudflare DNS, SSL, WAF, and future wildcard shop routing

## Current Scope

FootprintsHub is the flagship standalone shop at `footprintshub.com`.

Hero Studio commerce comes later through shared shop IDs, product cards, checkout redirects, webhooks, and digital unlock events. Magento is not embedded in Hero Studio.

## Development

```powershell
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment

Copy `.env.example` to `.env.local` and fill in local values. Never commit `.env`, Stripe secrets, Neon credentials, or production secrets.

## Key Scripts

```powershell
npm run dev
npm run build
npm run lint
npm run typecheck
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Safety

The app never trusts client-side prices at checkout. Checkout routes recalculate line items from the server catalog/database before creating a Stripe Checkout Session.

Affiliate commissions are calculated server-side after paid orders. The program is framed as a multi-tier affiliate and ambassador system tied only to qualified purchases, not recruiting-only compensation.
