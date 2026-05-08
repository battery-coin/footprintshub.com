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

## Next Installation Steps

1. Confirm baseline commit exists on `main`.
2. Confirm the GitHub remote is reachable.
3. Confirm local PHP, Composer, database, and OpenSearch versions.
4. Decide Composer install versus source import from the `battery-coin/magento2` fork.
5. Install Magento without committing `app/etc/env.php`, `auth.json`, database dumps, generated files, or secrets.
6. Review `git status` before any Magento foundation commit.

