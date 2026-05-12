# Railway Temporary Domain Deployment Steps

## Dashboard Path

1. Go to Railway.
2. Create a new project.
3. Choose deploy from GitHub.
4. Select `battery-coin/footprintshub.com`.
5. Select branch `railway-temp-neon-cloudflare-setup`.
6. Do not add a custom domain.
7. Let Railway create the temporary `up.railway.app` domain.
8. Open the service Variables tab.
9. Add the required variables from `docs/ENVIRONMENT_VARIABLES_RAILWAY_TEMP.md`.
10. Set:

```txt
NEXT_PUBLIC_SITE_URL=https://REPLACE_WITH_RAILWAY_TEMP_DOMAIN
DATABASE_URL=REPLACE_WITH_NEON_CONNECTION_STRING
```

For the current Railway temporary domain, use:

```txt
NEXT_PUBLIC_SITE_URL=https://footprintshubcom-production-155d.up.railway.app
```

Do not enter only `footprintshubcom-production-155d.up.railway.app`; protocol-less values caused a previous Turbopack prerender failure on `/affiliate/links`.

11. Redeploy.
12. Test these URLs:

```txt
https://REPLACE_WITH_RAILWAY_TEMP_DOMAIN
https://REPLACE_WITH_RAILWAY_TEMP_DOMAIN/api/health
https://REPLACE_WITH_RAILWAY_TEMP_DOMAIN/shop
https://REPLACE_WITH_RAILWAY_TEMP_DOMAIN/admin
https://REPLACE_WITH_RAILWAY_TEMP_DOMAIN/cart
https://REPLACE_WITH_RAILWAY_TEMP_DOMAIN/checkout
```

## Stop Point

Do not connect `footprintshub.com` or `www.footprintshub.com` until the Railway temporary URL works cleanly.
