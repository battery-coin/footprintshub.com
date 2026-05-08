# MySQL Audit

Audit date: 2026-05-08

MySQL binary: `D:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe`

MySQL version: 8.4.3

## Connection

Root connection succeeded with:

```powershell
mysql -u root -e "SELECT VERSION();"
```

Reported server version: 8.4.3

## Local Development Database

Created or confirmed:

- Database: `footprintshub_magento`
- Character set: `utf8mb4`
- Collation: `utf8mb4_unicode_ci`
- Local development user: `footprintshub` at `localhost`

The local development user was granted privileges on `footprintshub_magento`.

The user connection was tested successfully.

## Secret Handling

The local development password is only for local setup and must not be reused in staging or production.

Do not commit real database credentials to `.env`, `app/etc/env.php`, docs, scripts, or deployment config.

