# Installation Plan

## Current Rule

Do not install Magento until the repository baseline has been committed and pushed.

## Preferred Source Strategy

Use a Composer-based Magento Open Source installation when practical. This keeps third-party dependencies reproducible and avoids copying generated or local-only files.

## Local Prerequisites To Confirm

- PHP version compatible with the selected Magento release
- Composer
- MySQL or MariaDB
- OpenSearch
- Redis, if used for cache/session support
- Web server or local PHP development server strategy
- Magento Marketplace credentials, if Composer authentication is required

## Magento Fork Reference

Preferred source fork:

https://github.com/battery-coin/magento2

Preferred local source path:

`C:\Users\saveo\OneDrive\Documents\GitHub\magento2`

## Source Check

Checked on 2026-05-08:

- The Magento fork was cloned locally to `C:\Users\saveo\OneDrive\Documents\GitHub\magento2`.
- The cloned branch is `2.4-develop`.
- The fork includes a Magento project `composer.json`.
- The Magento project requires PHP `~8.3.0 || ~8.4.0 || ~8.5.0`.
- The local machine does not currently expose `php`, `composer`, `mysql`, or `opensearch` on PATH.

## Foundation Import Decision

Magento source has not yet been copied into this repository.

Reason: Composer installation is preferred, and the required PHP/Composer/database/search toolchain is not currently available from this shell. The source fork also contains large Magento trees and should not be copied blindly before confirming the exact install/deployment strategy.

## Next Installation Steps

1. Confirm baseline commit exists on `main`.
2. Confirm the GitHub remote is reachable.
3. Confirm local PHP, Composer, database, and OpenSearch versions.
4. Decide Composer install versus source import from the `battery-coin/magento2` fork.
5. Install Magento without committing `app/etc/env.php`, `auth.json`, database dumps, generated files, or secrets.
6. Review `git status` before any Magento foundation commit.
