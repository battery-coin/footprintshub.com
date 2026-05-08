# PHP Extension Audit

Audit date: 2026-05-08

PHP binary: `D:\laragon\bin\php\php-8.3.30-Win32-vs16-x64\php.exe`

PHP version: 8.3.30

Loaded php.ini: `D:\laragon\bin\php\php-8.3.30-Win32-vs16-x64\php.ini`

Backups created before editing:

- `D:\laragon\bin\php\php-8.3.30-Win32-vs16-x64\php.ini.bak`
- `D:\laragon\bin\php\php-8.3.30-Win32-vs16-x64\php.ini.bak-ca`

## Summary

Magento-required PHP extensions are now loaded from the CLI.

The following existing `php.ini` extension lines were uncommented after confirming the DLLs existed:

- `extension=soap`
- `extension=sockets`
- `extension=zip`

Composer still has a separate HTTPS CA validation blocker documented in `COMPOSER_AUDIT.md`.

## Extension Matrix

| Extension | Installed | Status | Action needed |
| --- | --- | --- | --- |
| bcmath | yes | required | none |
| ctype | yes | required | none |
| curl | yes | required | none |
| dom | yes | required | none |
| fileinfo | yes | required | none |
| gd | yes | required | none |
| hash | yes | required | none |
| iconv | yes | required | none |
| intl | yes | required | none |
| json | yes | required | none |
| libxml | yes | required | none |
| mbstring | yes | required | none |
| openssl | yes | required | none |
| pcre | yes | required | none |
| pdo_mysql | yes | required | none |
| simplexml | yes | required | none |
| soap | yes | required | enabled in php.ini |
| sockets | yes | recommended/required for integrations | enabled in php.ini |
| sodium | yes | required | none |
| spl | yes | required | none |
| tokenizer | yes | required | none |
| xsl | yes | required | none |
| zip | yes | required | enabled in php.ini |
| zlib | yes | required | none |

