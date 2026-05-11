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
- `CLOUDFLARE_R2_ACCOUNT_ID`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_BUCKET`
- `CLOUDFLARE_R2_PUBLIC_URL`
- `CLOUDFLARE_R2_ENDPOINT`
- `CLOUDFLARE_R2_MAX_UPLOAD_MB`
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
- Configure Cloudflare R2 before using product image uploads in admin.
- Configure Cloudflare DNS, SSL, WAF, and caching in front of Railway.
- Use wildcard DNS later for Hero Studio creator subdomains.
