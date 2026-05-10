# Security Checklist

## Repository

- `app/etc/env.php` ignored
- `auth.json` ignored
- production `.env` files ignored
- database dumps ignored
- private keys ignored
- generated Magento runtime directories ignored

## Magento

- Admin path must not use the default in production
- Two-factor authentication required for admin users
- HTTPS required in staging and production
- File permissions reviewed before deployment
- Composer dependencies audited before release
- Security package audited before enablement

## Integrations

- Webhooks signed and timestamped
- API keys scoped to least privilege
- Secrets stored outside Git
- Checkout redirects validated
- Customer/order ownership checks logged and rate limited

