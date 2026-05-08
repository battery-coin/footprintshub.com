# Magento Source Strategy

Audit date: 2026-05-08

## Current Repository State

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

Magento source was not copied into this repository during this pass.

Reasons:

- Composer HTTPS is blocked.
- OpenSearch is not running.
- Magento source import is large and should be done as a separate reviewed commit.
- The fork contains directories such as `vendor`, `generated`, and `var` that should not be copied blindly.

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

