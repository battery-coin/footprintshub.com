# FootprintsHub Permission Matrix

Owner-only:

- `canManageRoles`
- `canManageFunds`
- `canChangePayoutDestination`

Sensitive separated permissions:

- Products/pricing: `canManageProducts`, `canManagePricing`
- Orders/refunds: `canViewOrders`, `canManageOrders`, `canManageRefunds`
- Finance/payouts: `canViewFunds`, `canApprovePayouts`, `canApproveAffiliatePayouts`
- Affiliates: `canManageAffiliatePlans`, `canManageAffiliateApplications`, `canViewAffiliateReports`
- Printful/fulfillment/inventory: `canManagePrintful`, `canManageFulfillment`, `canManageInventory`
- Tax/security/audits: `canManageTax`, `canManageSecurity`, `canViewAuditLogs`

Suspended users receive no member/admin permissions.

Generic admin is not a permission. Existing `isAdmin` compatibility now resolves only to `canViewAdmin`.
