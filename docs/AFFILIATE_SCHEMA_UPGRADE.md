# Affiliate Schema Upgrade

## Added Models

- `AffiliatePlan`: shop compensation plan with business model type, active depth, caps, attribution, hold period, payout policy, and fraud defaults.
- `AffiliatePlanLevel`: level 0 through level 7 rules with rate, base, caps, rank requirement, and compression behavior.
- `AffiliatePerformanceTier`: monthly sales/order/commission tiers that can modify direct rate and paid depth.
- `AffiliateQualificationSnapshot`: period snapshot used for rank and tier qualification.
- `LifetimeCustomerAttribution`: optional customer-to-affiliate assignment for future purchases.

## Extended Models

- `Affiliate`: now supports `performanceTierId` and `activePlanId`.
- `CommissionRule`: now supports plan, business model type, creator shop, rank, performance tier, coupon, lifetime, and manual scopes.
- `AffiliateCommission`: now records plan, plan level, rank, performance tier, business model type, cap flag, and compression flag.
- `AffiliateRank`: now supports `maxPaidLevels`, direct commission bonus, monthly sales requirement, direct referral requirement, and qualified order requirement.
- `AffiliateAttribution`: now supports customer/order references and lifetime attribution type.

## Design Rules

- Cents are used for all money.
- Basis points are used for percentages.
- Shop scoping is required for every affiliate object.
- Ledger entries are required for wallet movement.
- Commissions are idempotent by order, affiliate, level, and rule.
- Refunds and chargebacks must create reversing ledger entries instead of mutating history.
