# Magento Install Blockers

Audit date: 2026-05-08

Magento is not installed yet.

## Current Blockers

- Composer HTTPS requests fail with `SSL certificate problem: unable to get local issuer certificate`.
- `composer install --no-interaction` timed out before dependency installation completed.
- Composer also reported permission errors writing package ZIPs under `vendor/composer`.
- Local base URL and Laragon virtual host still need to be configured.
- `php bin/magento --version` does not run until `vendor/autoload.php` exists.

## Cleared Items

- PHP 8.3.30 is available.
- Required PHP extensions are loaded.
- Composer 2.9.4 is available.
- MySQL 8.4.3 is available.
- Local database `footprintshub_magento` exists.
- Local database user `footprintshub` exists.
- OpenSearch is running at `http://localhost:9200`.
- `.gitignore` excludes Magento secrets and generated directories.
- Magento source foundation exists in this repository.
