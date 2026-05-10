# Railway Deployment Readiness

## Health

`/api/health` returns:

```json
{ "ok": true, "service": "footprintshub-commerce" }
```

## Required Railway Variables

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `PRINTFUL_API_KEY`
- `PRINTFUL_STORE_ID`
- `PRINTFUL_API_BASE_URL`
- `PRINTFUL_WEBHOOK_SECRET`
- `COINBASE_BUSINESS_API_KEY`
- `COINBASE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_ENABLE_CRYPTO_CHECKOUT`
- `NEXT_PUBLIC_ENABLE_AFFILIATE_PROGRAM`
- `NEXT_PUBLIC_ENABLE_PRINTFUL`
- `AFFILIATE_IP_HASH_SECRET`
- `COMMERCE_INTERNAL_API_TOKEN`

## Build

Use the repository scripts:

```bash
npm install
npm run prisma:generate
npm run build
npm run start
```

## Notes

- Do not commit `.env` or production credentials.
- Configure Neon before enabling persistent writes.
- Configure Stripe webhook endpoint to Railway production URL.
- Configure Cloudflare DNS, SSL, WAF, and caching in front of Railway.
- Use wildcard DNS later for Hero Studio creator subdomains.

