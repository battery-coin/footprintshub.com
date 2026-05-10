# Admin Permissions Model

OpenCart admin user groups inspired this permission scaffold.

## Models

- `AdminRole`
- `AdminUserRole`

## Permission Keys

- `products.read`
- `products.write`
- `orders.read`
- `orders.write`
- `refunds.write`
- `affiliates.read`
- `affiliates.write`
- `payouts.approve`
- `settings.write`
- `users.manage`
- `reports.read`
- `shops.manage`
- `platform.manage`

## Implementation

- `src/lib/auth/permissions.ts`

## Roles

- platform owner
- shop owner
- shop staff
- fulfillment staff
- affiliate manager
- customer support
- read-only analyst

Authentication is still a separate integration task. Keep the current admin gate until Auth.js, Clerk, Supabase Auth, or another provider is chosen.
