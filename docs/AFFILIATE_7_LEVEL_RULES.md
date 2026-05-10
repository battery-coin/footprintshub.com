# Affiliate 7-Level Rules

This is a multi-tier affiliate and ambassador commission system, not a recruiting-income program.

## Level Definitions

- Level 0: direct referring affiliate.
- Level 1: parent ambassador.
- Level 2: grandparent ambassador.
- Level 3: third ancestor.
- Level 4: fourth ancestor.
- Level 5: fifth ancestor.
- Level 6: sixth ancestor.
- Level 7: seventh ancestor.

## Default Rates

- Level 0: 10%
- Level 1: 2%
- Level 2: 1.5%
- Level 3: 1%
- Level 4: 0.75%
- Level 5: 0.5%
- Level 6: 0.25%
- Level 7: 0.25%

## Controls

- Maximum active depth: 1 through 7.
- Default max commission pool: 20% of qualified product subtotal.
- All commissions start pending.
- Hold period defaults to 14 days in `AffiliatePlan`.
- Refunds and chargebacks reverse affected direct and ancestor commissions.
- Self-referrals are blocked by default.
- Mandatory purchases, starter kits, pay-to-join fees, inventory loading, and recruiting-only compensation are not enabled.

## Admin Configuration

Each `AffiliatePlanLevel` can configure:

- enabled/disabled
- commission type
- percentage bps
- fixed cents
- commission base
- max per order
- max per month
- required rank
- compression behavior
