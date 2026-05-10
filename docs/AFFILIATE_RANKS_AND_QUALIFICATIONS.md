# Affiliate Ranks and Qualifications

## Default Ranks

- Bronze: direct commission only.
- Silver: level 0 and level 1.
- Gold: levels 0 through 3.
- Platinum: levels 0 through 5.
- Founder Ambassador: levels 0 through 7.
- Creator Partner: levels 0 through 7.

## Qualification Inputs

- monthly qualified sales
- monthly qualified order count
- direct referred customers
- approved commission amount
- manual admin override
- shop-specific rules

## Snapshot Model

`AffiliateQualificationSnapshot` stores period metrics:

- `monthlySalesCents`
- `monthlyOrderCount`
- `directReferralCount`
- `qualifiedOrderCount`
- `approvedCommissionCents`
- `calculatedRankId`
- `calculatedTierId`
- `maxPaidLevels`

Snapshots can be calculated on demand during commission calculation and later by scheduled jobs.
