# Route Map And 404 Audit

## Public Routes

- `/`
- `/shop`
- `/products`
- `/products/[slug]`
- `/collections`
- `/collections/[slug]`
- `/categories/[slug]`
- `/brands/[slug]`
- `/cart`
- `/checkout`
- `/checkout/success`
- `/checkout/cancel`
- `/affiliate`
- `/affiliate/apply`
- `/affiliate/dashboard`
- `/affiliate/links`
- `/affiliate/commissions`
- `/affiliate/payouts`
- `/affiliate/team`
- `/affiliate/wallet`
- `/affiliate/coupons`
- `/affiliate/resources`
- `/contact`
- `/support`
- `/faq`
- `/r/[code]`
- `/legal/[slug]`

## Admin Routes

- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]`
- `/admin/categories`
- `/admin/collections`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/refunds`
- `/admin/returns`
- `/admin/customers`
- `/admin/inventory`
- `/admin/discounts`
- `/admin/affiliates`
- `/admin/affiliates/[id]`
- `/admin/affiliates/rules`
- `/admin/affiliates/payouts`
- `/admin/printful`
- `/admin/settings`
- `/admin/settings/payments`
- `/admin/settings/shipping`
- `/admin/settings/legal`
- `/admin/audit-logs`
- `/admin/events`
- `/admin/security`

## API Routes

- `/api/health`
- `/api/products`
- `/api/cart`
- `/api/checkout/create-session`
- `/api/webhooks/stripe`
- `/api/admin/products`
- `/api/admin/orders`
- `/api/admin/refunds`
- `/api/admin/affiliates`
- `/api/affiliate/apply`
- `/api/affiliate/click`
- `/api/affiliate/track`
- `/api/printful/webhook`
- `/api/store/*`
- `/api/tenant/resolve`

## Broken-Link Cleanup

Customer-facing route files were checked for bad placeholder language, hash CTAs, JavaScript void links, and local-only URLs. Missing public and admin pages were added instead of allowing 404s. Dynamic product and legal pages use the custom not-found page when data is absent.

