# Gitignore Audit

Audit date: 2026-05-08

## Status

The repository `.gitignore` is Magento-safe for the current phase.

Covered:

- `vendor/`
- `var/`
- `generated/`
- generated `pub/static/*`, with `.htaccess` exception
- generated/user `pub/media/*`, with `.htaccess` exception
- `app/etc/env.php`
- `app/etc/config.php`
- `auth.json`
- `.env`
- local/production env variants
- SQL dumps
- logs
- archives
- `node_modules/`
- OS metadata
- PHPUnit cache

## Deployment Decision

`app/etc/config.php` can be committed in some Magento deployment workflows. For this first pass, it remains ignored until deployment strategy is finalized.

