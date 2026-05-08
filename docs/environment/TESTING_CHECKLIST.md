# Testing Checklist

## Environment

- `php -v`
- `composer --version`
- `mysql --version`
- `php -m`
- `composer diagnose`
- `docker --version`
- `docker compose version`
- `curl http://localhost:9200` or `Invoke-WebRequest http://localhost:9200 -UseBasicParsing`

## Magento

- `composer validate`
- `composer install`
- `php bin/magento --version`
- `php bin/magento setup:install`
- `php bin/magento cache:flush`
- `php bin/magento indexer:reindex`
- `php bin/magento module:status`
- frontend loads
- admin loads
- product page loads
- cart loads
- checkout loads

## Git

- `git status`
- `app/etc/env.php` ignored
- `auth.json` ignored
- `.env` ignored
- no database dumps
- no secrets

## Security

- admin URL is not `/admin` in production
- 2FA planned/enabled
- HTTPS planned
- secure cookies planned
- Cloudflare WAF planned
- backups planned
- OpenSearch secured in production
- CSP reviewed
- file permissions documented

