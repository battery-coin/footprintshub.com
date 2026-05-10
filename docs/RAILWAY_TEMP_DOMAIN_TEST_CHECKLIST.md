# Railway Temporary Domain Test Checklist

## Basic

- [ ] Railway deployment succeeds.
- [ ] Temporary domain loads.
- [ ] `/api/health` returns `railway-temp-ready`.
- [ ] Homepage has no 500.
- [ ] `/shop` works.
- [ ] A seeded `/products/[slug]` page works.
- [ ] `/cart` works.
- [ ] `/checkout` works or shows setup-required Stripe state.
- [ ] `/admin` works.
- [ ] `/legal/terms` works.
- [ ] `/legal/privacy` works.
- [ ] `/legal/refunds` works.
- [ ] `/affiliate/apply` works.
- [ ] `/support` works.
- [ ] `/contact` works.
- [ ] `/faq` works.

## Database

- [ ] App connects to Neon.
- [ ] Prisma migrations are applied.
- [ ] Products load from database or graceful fallback appears.
- [ ] Railway logs do not show `DATABASE_URL` errors.

## Security

- [ ] `.env` is not committed.
- [ ] Secrets are not printed in logs.
- [ ] Admin route is gated by `ADMIN_SECRET` or protected by future auth.
- [ ] Stripe placeholder values do not allow real checkout.

## Deployment

- [ ] Build command passes.
- [ ] Start command works.
- [ ] Healthcheck passes.
- [ ] Logs are clean enough for temporary-domain testing.

