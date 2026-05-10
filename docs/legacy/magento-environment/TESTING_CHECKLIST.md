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
- `composer install` - completed locally
- `php bin/magento --version` - completed locally
- `php bin/magento setup:install` - completed locally
- `php bin/magento cache:flush` - completed locally
- `php bin/magento indexer:reindex` - completed locally
- `php bin/magento module:status` - completed locally
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
