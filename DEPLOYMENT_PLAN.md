# Deployment Plan

## First-Pass Strategy

Keep deployment planning separate from Magento installation until the local foundation is stable.

## Environments

- Local development
- Staging
- Production

## Secrets Policy

Do not commit:

- `app/etc/env.php`
- `auth.json`
- production `.env` files
- private keys
- database dumps
- payment provider secrets
- webhook signing secrets

## Deployment Questions

- Hosting target for Magento runtime
- Database provider and backup policy
- OpenSearch hosting
- Redis/cache hosting
- CDN/media storage approach
- Domain and SSL management
- CI/CD build and deploy process
- Magento configuration management policy, including whether `app/etc/config.php` should eventually be committed

