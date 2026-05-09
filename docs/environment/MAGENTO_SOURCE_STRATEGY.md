# Magento Source Strategy

Audit date: 2026-05-08

## Previous Repository State

State A: this repository currently contains baseline docs only and no Magento source.

Missing in `footprintshub.com`:

- `composer.json`
- `composer.lock`
- `app/`
- `bin/`
- `pub/`
- `setup/`
- `vendor/`

## Preferred Strategy

Use Composer-based Magento Open Source installation when HTTPS Composer connectivity and credentials are ready.

Composer is currently blocked by CA validation failures, so the Composer install cannot be safely completed yet.

## Alternative Strategy

Use the Battery Coin Magento fork as a source reference:

https://github.com/battery-coin/magento2

Local path:

`C:\Users\saveo\OneDrive\Documents\GitHub\magento2`

Observed:

- Branch: `2.4-develop`
- `composer.json`: present
- `app/`: present
- `bin/`: present
- `pub/`: present
- `setup/`: present
- PHP requirement: `~8.3.0 || ~8.4.0 || ~8.5.0`

## Import Decision

Magento source foundation was copied into this repository on branch `magento-local-readiness`.

Copied from:

`C:\Users\saveo\OneDrive\Documents\GitHub\magento2`

Included:

- `app/`
- `bin/`
- `dev/`
- `lib/`
- `phpserver/`
- `pub/`
- `setup/`
- Magento root metadata and sample config files
- `composer.json`
- `composer.lock`

Excluded or ignored:

- `.git`
- `vendor/`
- `generated/`
- `var/`
- `app/etc/env.php`
- `auth.json`
- `.env`

Magento test fixture `.sql` and `.zip` files under `dev/` remain ignored by the repository dump/archive rules.

Composer dependency installation has not completed.

## Copy Exclusions If Source Import Is Chosen

- `.git`
- `vendor/`
- `generated/`
- `var/`
- generated `pub/static/*`, except `.htaccess`
- generated/user `pub/media/*`, except `.htaccess`
- `app/etc/env.php`
- `auth.json`
- `.env`
- database dumps
- private keys

## Rollback Method

Use a dedicated branch and review `git status` before committing. If the import is wrong, delete only uncommitted imported files from the branch or reset the branch before push. Do not force-push over shared work.
