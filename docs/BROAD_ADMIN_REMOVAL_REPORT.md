# Broad Admin Removal Report

Completed in this pass:

- Added specific `AppRole` values for product, catalog, order, refund, finance, payout, affiliate, ads, sponsor, Printful, fulfillment, inventory, tax, subscription, digital asset, NFT, customer, support, moderation, security, analyst, shop owner, creator, affiliate, customer, fan, and suspended users.
- Replaced admin shell visibility with permission-filtered links.
- Replaced selected sensitive admin API checks with `requireRequestPermission`.
- Added owner-only role APIs.
- Added audit logs for role assignment/revocation, product changes, price changes, refund review actions, affiliate plan changes, security setting changes, and denied access attempts.

Compatibility note:

- The legacy `isAdmin` function remains for existing call sites, but it now means `canViewAdmin`.
- `ADMIN_EMAILS` fallback maps to narrow operational roles, not owner.
