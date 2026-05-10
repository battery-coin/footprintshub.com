# Lifetime Customer Attribution

Lifetime attribution links a customer to an affiliate after a qualifying purchase.

## Behavior

- Can be enabled per `AffiliatePlan`.
- Can last forever or expire after `lifetimeAttributionDays`.
- Future purchases can credit the same affiliate.
- Coupon priority can override lifetime attribution when configured.
- Admin manual override can replace or revoke assignment.

## Privacy

Affiliates should not see private customer information. Dashboards should show aggregate counts, order references, and commission statuses only.

## Database

`LifetimeCustomerAttribution` stores:

- shop
- customer
- affiliate
- optional source order
- startsAt
- expiresAt
- status
