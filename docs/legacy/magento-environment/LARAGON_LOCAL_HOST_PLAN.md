# Laragon Local Host Plan

Local domain:

`http://footprintshub.test/`

Project root:

`C:\Users\saveo\OneDrive\Documents\GitHub\footprintshub.com`

Magento document root:

`C:\Users\saveo\OneDrive\Documents\GitHub\footprintshub.com\pub`

## Laragon Guidance

- Configure the virtual host document root to Magento `pub`, not the repository root.
- Enable rewrites.
- Restart Laragon services after virtual host changes.
- Keep `app/etc/env.php` local and uncommitted.

## Why `pub`

Magento should be served from `pub` so web requests cannot directly access application internals, Composer files, config templates, or other project-root files.

