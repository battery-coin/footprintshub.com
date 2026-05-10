# Magento Pivot Notes

Pivot date: 2026-05-09

The repository previously contained a Magento Open Source foundation imported from `battery-coin/magento2` on the `magento-local-readiness` branch.

Magento was abandoned for this project because the setup was too heavy for the FootprintsHub and future Hero Studio commerce direction.

## Magento Files Found

Tracked Magento application files included:

- `app/`
- `bin/`
- `dev/`
- `lib/`
- `phpserver/`
- `pub/`
- `setup/`
- `composer.json`
- `composer.lock`
- Magento root samples and metadata files

Ignored local Magento runtime files also existed, including:

- `vendor/`
- `var/`
- `generated/`
- `app/etc/env.php`
- `app/etc/config.php`
- `pub/static` generated files
- `pub/media` generated files
- `magento2-2.4-develop.zip`

## Pivot Decision

The `pivot-to-react-commerce` branch replaces the tracked Magento application foundation with a custom Next.js, React, TypeScript, Postgres, and Stripe commerce application.

Local ignored Magento runtime files are not committed and should not be carried into production. They can be deleted manually after confirming no local Magento fallback is needed.

## Git Safety

This pivot happens on a branch and does not merge automatically into `main`.

Do not commit:

- `.env`
- Stripe keys
- Neon database passwords
- `auth.json`
- Magento `app/etc/env.php`
- database dumps
- private keys
