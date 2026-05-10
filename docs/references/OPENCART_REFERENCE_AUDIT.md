# OpenCart Reference Audit

## Source Inspected

- Repository: `https://github.com/opencart/opencart`
- Local path: `C:\Users\saveo\OneDrive\Documents\GitHub\opencart`
- Branch: `master`
- Version constant found: `4.2.0.0`
- Status: read-only reference. No OpenCart PHP code was copied into FootprintsHub.

## Repository Structure

- `upload/catalog`: storefront controllers, models, views, languages, startup flows, checkout, account, product, information, API, and mail areas.
- `upload/admin`: admin controllers, models, views, languages, startup authorization/permission flows, catalog/customer/sale/marketing/localization/extension/report areas.
- `upload/system`: registry, loader, controller/model/action/event engine, config, helpers, cache/session/mail/db/image/template libraries.
- `upload/extension`: extension namespace for built-in or installable OpenCart extensions.
- `upload/install`: installer and schema/bootstrap flow.
- `config-dist.php` / `admin/config-dist.php`: separated storefront/admin config.

## Storefront Features Found

- Product category, product detail, manufacturer/brand, search, specials, compare, reviews, related products, uploads.
- Cart, checkout, confirm, payment address/method, shipping address/method, register, success/failure.
- Account dashboard, login, register, forgot password, address book, wishlist, order history, returns, reward, transactions, downloads, subscriptions, newsletter, affiliate tracking.
- Information pages, contact, sitemap, GDPR.
- Startup layers for setting, session, customer, currency, language, tax, SEO URL, marketing, theme, extension, event.

## Admin Features Found

- Catalog: product, category, option, attribute, filter, manufacturer, download, review, subscription plan, information.
- Sale: orders, returns, subscriptions.
- Customer: customers, groups, approvals, custom fields, GDPR.
- Marketing: coupons, affiliate, marketing tracking, contact/newsletter.
- Design: banners, layouts, SEO URL/regex, templates, translation.
- Localization: countries, zones, geo zones, currencies, languages, tax rates/classes, weight/length classes, stock/order/return/subscription statuses.
- Users: users, user groups, API users, profile.
- Extensions: payment, shipping, total, module, report, feed, fraud, analytics, captcha, theme, language, marketplace.
- Reports: sales/product/customer-style reporting tasks, online customers, statistics.

## System Features Found

- Event/hook engine.
- Registry and loader pattern.
- Separate libraries for cart, tax, currency, customer, user, session, cache, mail, image, request/response, URL, logging.
- DB adapters include MySQLi, PDO, and PostgreSQL.
- Config-driven startup and extension loading.

## Relevant To FootprintsHub

- Brands/manufacturers.
- Product options beyond variants.
- Product reviews/moderation.
- Wishlist and compare.
- Gift vouchers, store credit, reward points.
- Download entitlements.
- Return/RMA workflow.
- Information pages and banners.
- Localization foundations.
- Admin role permissions.
- Extension/module concept translated into TypeScript plugin interfaces.
- Ordered totals pipeline inspired by OpenCart order totals.

## Already Covered By Magento Gap Work

- Core products, variants, categories, collections, cart, checkout, Stripe, orders, refunds, shipments, inventory ledger, discounts, tax/shipping placeholders, admin products/orders, tenant resolver, affiliate program, legal pages.

## Uniquely Useful From OpenCart

- Simple manufacturer/brand concept.
- Product option/value model separate from full variants.
- Wishlist/compare lightweight UX.
- Voucher/reward/store-credit separation.
- Return reasons/actions/statuses as first-class commerce workflows.
- Admin user group permission model.
- Order-total extension pipeline concept.
- Information pages and design/banner CMS pieces.
