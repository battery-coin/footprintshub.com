# Deployment Plan

Primary deployment target: Railway.

Primary database: Neon Postgres.

Primary DNS/security edge: Cloudflare.

## Railway

- Build command: `npm run build`
- Start command: `npm run start`
- Health check: `/api/health`
- Required env vars are documented in `.env.example`.

## Neon

- Create a Neon project.
- Copy the pooled production connection string into Railway as `DATABASE_URL`.
- Run Prisma migrations from a trusted environment.

## Cloudflare

- Point `footprintshub.com` and `www.footprintshub.com` to Railway.
- Enable SSL, WAF, bot protection, and caching rules.
- Future wildcard: `*.herostudio.org` for creator shops.

## SiteGround

Use SiteGround only for email, legacy PHP, static fallback pages, or emergency redirects if needed.
