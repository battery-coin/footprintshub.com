# Magento Install Status

Audit date: 2026-05-08

Magento has been installed locally for development.

## Completed

- Composer HTTPS requests were fixed by configuring a Windows certificate-store bundle.
- `composer install --no-dev --prefer-dist --no-progress --no-interaction` completed.
- `php bin/magento --version` runs and reports `Magento CLI dev-main`.
- OpenSearch responds at `http://localhost:9200`.
- MySQL database `footprintshub_magento` exists.
- Local Magento setup installation completed successfully.
- `php bin/magento cache:flush` completed.
- `php bin/magento indexer:reindex` completed.
- `php bin/magento module:status` completed.

## Resolved Install Issues

- Composer CA validation failed until PHP and Composer were pointed at `D:\laragon\etc\ssl\windows-ca-bundle.pem`.
- Magento setup initially failed on MySQL trigger creation until local MySQL `log_bin_trust_function_creators` was enabled.
- Magento setup initially failed while registering themes because PHP GD rejected Windows drive-letter image paths. The Magento framework image adapter was patched to allow local Windows absolute paths such as `C:\...`.

## Remaining Local Work

- Configure Laragon so `http://footprintshub.test/` serves this repository's `pub` directory.
- Verify storefront and admin pages in a browser.
- Keep `app/etc/env.php`, `app/etc/config.php`, `vendor/`, `var/`, `generated/`, `pub/static` generated files, and `pub/media` generated files out of Git.
- Do not reuse local development credentials in staging or production.
