# Magento Reference Audit

Audit date: 2026-05-10

## Repositories Inspected

Magento source:

- Local path: `C:\Users\saveo\OneDrive\Documents\GitHub\magento2`
- Branch: `2.4-develop`
- Latest inspected commit: `6038f0db3b6`
- Composer package name: `magento/magento2ce`

Magento security package:

- Local path: `C:\Users\saveo\OneDrive\Documents\GitHub\magento-security-package`
- Branch: `develop`
- Latest inspected commit: `ed686017`

## Magento Source Areas Reviewed

- `app/code/Magento/Catalog`
- `app/code/Magento/ConfigurableProduct`
- `app/code/Magento/Bundle`
- `app/code/Magento/GroupedProduct`
- `app/code/Magento/Downloadable`
- `app/code/Magento/Quote`
- `app/code/Magento/Checkout`
- `app/code/Magento/Sales`
- `app/code/Magento/Customer`
- `app/code/Magento/SalesRule`
- `app/code/Magento/CatalogRule`
- `app/code/Magento/CatalogInventory`
- `app/code/Magento/SalesInventory`
- `app/code/Magento/Shipping`
- `app/code/Magento/Tax`
- `app/code/Magento/Payment`
- `app/code/Magento/Webapi`
- `app/code/Magento/GraphQl`
- `app/code/Magento/Security`
- `app/code/Magento/Csp`
- `app/code/Magento/User`

Magento has hundreds of module config files across `module.xml`, `di.xml`, `webapi.xml`, `acl.xml`, `events.xml`, `db_schema.xml`, GraphQL schemas, plugins, observers, controllers, UI components, and setup patches.

## Major Ecommerce Features Discovered

- Product entity model with product types, attributes, media, category assignment, URL rewrites, search, visibility, and status.
- Product type specialization for simple, configurable, bundle, grouped, virtual, and downloadable products.
- Quote/cart model separated from orders.
- Cart totals pipeline for subtotal, discounts, shipping, tax, and grand total.
- Guest and authenticated carts with separate API surfaces.
- Checkout agreement support, shipping information, payment information, and order placement APIs.
- Sales order lifecycle with order items, invoices, shipments, credit memos, comments, and status history.
- Sales sequence logic for order numbers.
- Customer accounts, customer addresses, password reset security, customer groups, and customer data sections.
- Sales rules and catalog rules for cart discounts, coupons, date windows, customer groups, and product/category conditions.
- Inventory modules for stock status, stock deductions, and sales inventory integration.
- Shipping method abstraction, rate collection, tracking, and shipment records.
- Tax classes, rates, rules, and order tax aggregation.
- Payment method abstraction, payment gateway commands, payment info, and offline payment support.
- REST, SOAP, and GraphQL API definitions.
- ACL-driven admin permissions.
- Events, observers, plugins, dependency injection, and module-level extensibility.

## Admin Features Discovered

- ACL resources for module-level admin permissions.
- Product, customer, order, configuration, payment, shipping, tax, and security admin areas.
- System configuration stored by scope.
- Admin user security settings and session controls.
- Admin action extensibility through observers and plugins.

## Security Features Discovered In Magento Core

- Admin session controls and admin account sharing rules.
- Password reset request limits and time windows.
- CSP module with configurable storefront/admin modes, report URIs, whitelists, nonce/hash policies, and subresource integrity support.
- Web API resource authorization for anonymous, self, and admin resources.
- GraphQL session disabling and request validation/backpressure concepts.
- Payment gateway abstraction that avoids storing raw card data in core order tables.

## Security Package Features Discovered

- TwoFactorAuth module with Google TOTP, Duo, Authy, and U2F/WebAuthn-style providers.
- Admin predispatch observer that gates admin access through 2FA flows.
- Admin user 2FA configuration storage and encrypted secret migration patches.
- CLI commands for TFA provider listing, reset, and Google secret management.
- ReCaptcha modules for admin, checkout, customer, contact, newsletter, PayPal, review, send friend, store pickup, wishlist, webapi REST, webapi GraphQL, and webapi UI.
- Securitytxt module for `/.well-known/security.txt` and optional signature output.
- ACL, admin routes, frontend routes, webapi routes, DI preferences, plugins, observers, setup patches, and integration/unit tests.

## Database Concepts Relevant To FootprintsHub

- Keep cart separate from order.
- Keep order item snapshots so product edits do not rewrite historical orders.
- Use ledgers for sensitive money/inventory changes.
- Use webhook event storage for idempotency.
- Use scoped settings instead of hardcoding shop behavior.
- Use explicit status fields on products, carts, orders, payments, refunds, shipments, and webhooks.
- Model admin audit logs for privileged changes.
- Model product categories, collections, relations, and media separately.

## Features Reimplemented In React/Postgres

- Product catalog schema and merchandising scaffolds.
- Category and collection foundations.
- Product media and related product foundations.
- Guest cart validation and totals service.
- Discount rule/code foundations.
- Stripe Checkout session creation with server-side price calculation.
- Order, order item, payment, refund, shipment, address, and webhook event schemas.
- Inventory ledger and paid-order stock deduction service.
- Shipping and tax estimate services.
- Admin pages for products, categories, collections, orders, inventory, discounts, shipping, tax, security, customers, shops, and affiliates.
- Affiliate/ambassador program from the prior pass.
- Security headers, webhook signatures, Zod validation, admin audit log service, and hashed IP helper.

## Features Deferred

- Full product attribute UI and configurable product option builder.
- Full account authentication and password reset.
- Full customer order history portal.
- Full shipping carrier rate integrations.
- Stripe Tax or third-party tax provider.
- Invoice and credit memo documents.
- Email notification template engine.
- Advanced GraphQL API.
- Role-based admin UI enforcement.
- ReCaptcha provider integration.
- Real 2FA provider integration.
- File integrity/malware scanner.
