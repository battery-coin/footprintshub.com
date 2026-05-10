# Railway, Neon, Cloudflare Deployment

## Railway

Create a Railway service from the GitHub repository.

Build command:

```text
npm run build
```

Start command:

```text
npm run start
```

Health route:

```text
/api/health
```

Expected response:

```json
{ "ok": true, "service": "footprintshub-commerce" }
```

## Neon

1. Create a Neon Postgres project.
2. Create a production database.
3. Add the pooled connection string to Railway as `DATABASE_URL`.
4. Run Prisma migrations from a trusted local or CI environment.
5. Run the seed command once for the flagship shop.

## Stripe

Required Railway variables:

```text
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=https://footprintshub.com
```

Webhook endpoint:

```text
https://footprintshub.com/api/webhooks/stripe
```

## Cloudflare

For FootprintsHub:

```text
footprintshub.com -> Railway target
www.footprintshub.com -> Railway target
```

Recommended:

- Proxied DNS where compatible with Railway domain verification
- Full SSL
- WAF managed rules
- Bot protection
- Cache static assets
- Bypass cache for API and checkout routes

Future wildcard:

```text
*.herostudio.org -> Railway target
```

If Railway domain limits block wildcard routing, use Cloudflare Workers as the host router.

## SiteGround

Use SiteGround only for:

- Email hosting
- Legacy PHP fallback pages
- Static emergency page
- DNS fallback if needed
