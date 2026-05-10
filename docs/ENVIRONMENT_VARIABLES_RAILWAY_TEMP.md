# Environment Variables For Railway Temporary Domain

## Local `.env`

Local `.env` exists and should stay uncommitted. It must contain local or staging-safe values for:

- `NEXT_PUBLIC_SITE_URL`
- `DATABASE_URL`
- `ADMIN_SECRET`
- `COMMERCE_INTERNAL_API_TOKEN`
- `AFFILIATE_IP_HASH_SECRET`

For local development:

```txt
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Do not print or commit the actual secret values.

## Railway Variables

After Railway creates the temporary URL, set:

```txt
NEXT_PUBLIC_SITE_URL=https://REPLACE_WITH_RAILWAY_TEMP_DOMAIN
DATABASE_URL=REPLACE_WITH_NEON_CONNECTION_STRING
ADMIN_SECRET=REPLACE_WITH_RANDOM_SECRET
COMMERCE_INTERNAL_API_TOKEN=REPLACE_WITH_RANDOM_SECRET
AFFILIATE_IP_HASH_SECRET=REPLACE_WITH_RANDOM_SECRET
AFFILIATE_COOKIE_DAYS=30
AFFILIATE_TERMS_VERSION=2026-05
AFFILIATE_DEFAULT_MAX_LEVELS=7
EMAIL_PROVIDER=none
DEFAULT_SHIPPING_FLAT_RATE_CENTS=799
DEFAULT_FREE_SHIPPING_THRESHOLD_CENTS=10000
DEFAULT_TAX_BPS=0
ENABLE_STRIPE_TAX=false
WEBHOOK_IDEMPOTENCY_REQUIRED=true
NEXT_PUBLIC_ENABLE_CRYPTO_CHECKOUT=false
NEXT_PUBLIC_ENABLE_AFFILIATE_PROGRAM=true
NEXT_PUBLIC_ENABLE_PRINTFUL=false
NEXT_PUBLIC_FLAGSHIP_SHOP_DOMAIN=footprintshub.com
NEXT_PUBLIC_HERO_STUDIO_SHOP_DOMAIN=shop.herostudio.org
```

## Optional Disabled Services

Keep these blank or test-only until the provider is configured:

```txt
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
PRINTFUL_API_KEY=
PRINTFUL_STORE_ID=
PRINTFUL_API_BASE_URL=https://api.printful.com
PRINTFUL_WEBHOOK_SECRET=
COINBASE_BUSINESS_API_KEY=
COINBASE_WEBHOOK_SECRET=
RESEND_API_KEY=
SENDGRID_API_KEY=
SMTP_URL=
```

## Secret Rules

- Never commit `.env`.
- Never prefix server secrets with `NEXT_PUBLIC_`.
- `DATABASE_URL`, Stripe secrets, Printful keys, Coinbase keys, email keys, Railway tokens, Cloudflare tokens, and private keys must stay server-side.

