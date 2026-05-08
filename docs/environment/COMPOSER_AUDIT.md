# Composer Audit

Audit date: 2026-05-08

Composer version: 2.9.4

PHP used by Composer: 8.3.30

PHP binary: `D:\laragon\bin\php\php-8.3.30-Win32-vs16-x64\php.exe`

## Diagnose Result

`composer diagnose` does not fully pass.

Passing items:

- Composer runs from PATH.
- PHP platform settings are OK.
- Git settings are OK.
- Disk free space is OK.
- HTTP connectivity to Packagist is OK.
- `zip` extension is now present.

Blocking items:

- Missing Composer pubkeys for tag and dev verification.
- Composer version check fails because HTTPS requests fail with curl error 60.
- Composer audit fails because HTTPS requests to Packagist fail with curl error 60.
- GitHub API rate-limit check fails because HTTPS requests fail with curl error 60.

Observed error:

```text
SSL certificate problem: unable to get local issuer certificate
```

## CA Configuration Attempted

Laragon CA bundle exists:

`D:\laragon\etc\ssl\cacert.pem`

The following settings were applied:

- `curl.cainfo="D:\laragon\etc\ssl\cacert.pem"`
- `openssl.cafile="D:\laragon\etc\ssl\cacert.pem"`
- Composer global `cafile` set to `D:\laragon\etc\ssl\cacert.pem`

Composer HTTPS still fails, so Magento Composer install is blocked until the Windows/Laragon CA trust issue is repaired.

## Auth Status

No project `auth.json` exists in this repository.

Do not commit `auth.json`.

Magento Marketplace credentials may be required for Composer-based Magento package installation. If needed, configure them manually outside Git.

## Recommended Manual Fixes

1. Update or replace `D:\laragon\etc\ssl\cacert.pem` with a current CA bundle.
2. Re-run `composer diagnose`.
3. Run `composer self-update --update-keys` if Composer asks for verification keys.
4. Keep `auth.json` outside Git.

