# Environment Variables

## Public Browser Variables

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_ENABLE_CRYPTO_CHECKOUT`
- `NEXT_PUBLIC_ENABLE_AFFILIATE_PROGRAM`
- `NEXT_PUBLIC_ENABLE_PRINTFUL`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_COINBASE_WALLET_APP_NAME`
- `NEXT_PUBLIC_COINBASE_WALLET_APP_LOGO_URL`
- `NEXT_PUBLIC_DEFAULT_CHAIN_ID`
- `NEXT_PUBLIC_ENABLE_WALLET_CONNECT`
- `NEXT_PUBLIC_FLAGSHIP_SHOP_DOMAIN`
- `NEXT_PUBLIC_HERO_STUDIO_SHOP_DOMAIN`

## Server-Only Variables

- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ADMIN_SECRET`
- `PLATFORM_OWNER_EMAIL`
- `ADMIN_EMAILS`
- `PRINTFUL_API_KEY`
- `PRINTFUL_STORE_ID`
- `PRINTFUL_API_BASE_URL`
- `PRINTFUL_CONFIRM_ORDERS`
- `PRINTFUL_DEFAULT_SHIPPING_METHOD`
- `PRINTFUL_WEBHOOK_SECRET`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `AFFILIATE_IP_HASH_SECRET`
- `COMMERCE_INTERNAL_API_TOKEN`
- `COINBASE_BUSINESS_API_KEY`
- `COINBASE_BUSINESS_API_SECRET`
- `COINBASE_WEBHOOK_SECRET`
- `COINBASE_API_BASE_URL`
- `COINBASE_CHECKOUT_SUCCESS_URL`
- `COINBASE_CHECKOUT_CANCEL_URL`
- `COINBASE_CHECKOUT_ENABLED`

Never commit `.env`, production credentials, private keys, wallet seeds, Railway tokens, Cloudflare tokens, Stripe secrets, or Printful tokens.

Never expose Coinbase Business credentials in `NEXT_PUBLIC_` variables.

## Railway Printful Setup

1. Add `PRINTFUL_API_KEY`.
2. Add `PRINTFUL_STORE_ID` if using an account-level token.
3. Keep `PRINTFUL_CONFIRM_ORDERS=false` until a draft order is verified.
4. Set `PRINTFUL_DEFAULT_SHIPPING_METHOD=STANDARD` unless a tested method is chosen.
5. Redeploy Railway.

## Railway Coinbase Setup

1. Add `COINBASE_BUSINESS_API_KEY`.
2. Add `COINBASE_BUSINESS_API_SECRET` as a server-only secret.
3. Add `COINBASE_WEBHOOK_SECRET`.
4. Set `COINBASE_API_BASE_URL=https://business.coinbase.com`.
5. Set `COINBASE_CHECKOUT_ENABLED=true` only after webhook configuration is ready.
6. Keep return URLs on the public Railway or production domain.
7. Configure the Coinbase webhook endpoint as `/api/webhooks/coinbase`.
