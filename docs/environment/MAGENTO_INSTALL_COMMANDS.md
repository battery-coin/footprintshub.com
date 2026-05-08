# Magento Install Commands

These commands are templates for local development only.

Do not commit real credentials. Do not commit `app/etc/env.php`.

## Validate Source

Run after Magento source exists in this repository:

```powershell
composer validate
composer install
php bin/magento --version
```

## Local Install Template

Run only after PHP extensions pass, MySQL database exists, OpenSearch responds at `localhost:9200`, and the Laragon virtual host points to `pub`.

```powershell
php bin/magento setup:install `
  --base-url=http://footprintshub.test/ `
  --db-host=localhost `
  --db-name=footprintshub_magento `
  --db-user=footprintshub `
  --db-password=local_dev_password_change_me `
  --admin-firstname=David `
  --admin-lastname=Kam `
  --admin-email=admin@example.com `
  --admin-user=admin `
  --admin-password=ChangeThisPassword123! `
  --language=en_US `
  --currency=USD `
  --timezone=America/Los_Angeles `
  --use-rewrites=1 `
  --search-engine=opensearch `
  --opensearch-host=localhost `
  --opensearch-port=9200
```

## Post-Install Checks

```powershell
php bin/magento cache:flush
php bin/magento indexer:reindex
php bin/magento module:status
```

