# Composer Audit

Audit date: 2026-05-08

Composer version: 2.9.4

PHP used by Composer: 8.3.30

PHP binary: `D:\laragon\bin\php\php-8.3.30-Win32-vs16-x64\php.exe`

## Diagnose Result

`composer install` completed successfully, but `composer diagnose` still reports environment cleanup items.

Passing items:

- Composer runs from PATH.
- PHP platform settings are OK.
- Git settings are OK.
- Disk free space is OK.
- HTTP connectivity to Packagist is OK.
- `zip` extension is now present.
- `ftp` extension is now present.

Remaining items:

- Missing Composer pubkeys for tag and dev verification.
- Composer 2.9.4 is installed while a newer Composer release may be available.
- HTTPS checks in `composer diagnose` still report curl error 60 in this shell.
- Composer's audit check reported a local cache permission problem under `C:\Users\saveo\AppData\Local\Composer`.

Observed recurring error:

```text
SSL certificate problem: unable to get local issuer certificate
```

## CA Configuration

A Windows certificate-store bundle was generated and configured for PHP:

`D:\laragon\etc\ssl\windows-ca-bundle.pem`

The following PHP settings were applied:

- `curl.cainfo="D:\laragon\etc\ssl\windows-ca-bundle.pem"`
- `openssl.cafile="D:\laragon\etc\ssl\windows-ca-bundle.pem"`

Backup created before the CA edit:

- `D:\laragon\bin\php\php-8.3.30-Win32-vs16-x64\php.ini.bak-windows-ca`

Composer global config currently still reports a cafile under Git for Windows:

```text
D:\Program Files\Git\mingw64\etc\ssl\certs\ca-bundle.crt
```

Do not write machine-specific `cafile` settings into this repository's `composer.json`.

## Install Attempt

After enabling `ext-ftp` and making local CA adjustments, Composer installation was completed from the Magento root in this repository:

```powershell
composer install --no-dev --prefer-dist --no-progress --no-interaction
```

Result: complete.

`vendor/` exists locally and remains ignored. Do not commit it unless the deployment policy explicitly changes.

Composer reported abandoned package notices. These are inherited from the current Magento dependency set and should be reviewed during later dependency maintenance, not changed during initial store setup.

## Auth Status

No project `auth.json` exists in this repository.

Do not commit `auth.json`.

Magento Marketplace credentials may be required for Composer-based Magento package installation. If needed, configure them manually outside Git.

## Recommended Follow-Ups

1. Run `composer self-update --update-keys` if Composer asks for verification keys.
2. Repair Composer's global CA/cafile configuration outside the repository.
3. Clear or repair permissions on `C:\Users\saveo\AppData\Local\Composer` if audit/cache reads fail.
4. Review Composer version updates outside this Magento setup branch.
5. Keep `auth.json` outside Git.
