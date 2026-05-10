# Affiliate System Architecture

FootprintsHub now treats affiliate commerce as a native multi-tenant feature of the Next.js store, not as a WordPress, WooCommerce, Magento, or PHP plugin dependency.

## Scope

- Flagship shop: `footprintshub.com`
- Future marketplace: `shop.herostudio.org`
- Future creator shops: `{creator}.herostudio.org`
- Program model: multi-tier affiliate and ambassador commissions on qualified purchases only

## Core Flow

1. A visitor arrives with `?ref=CODE` or `/r/CODE`.
2. Middleware stores convenience cookies for referral, session, and visitor IDs.
3. The server records `AffiliateClick` and `AffiliateAttribution` when a valid code is submitted.
4. Checkout metadata carries referral, visitor, and session identifiers.
5. Stripe webhook marks an order paid and calls `calculateCommissionsForOrder(order.id)` once order persistence is wired.
6. The commission engine resolves attribution, validates fraud controls, creates pending commissions, and writes wallet ledger entries.
7. Commissions remain pending until the hold period passes or an admin approves them.
8. Refunds and chargebacks create reversal ledger entries.

## Server Files

- `src/lib/affiliate/commission-engine.ts`: pure commission calculation and cap enforcement
- `src/lib/affiliate/order-commission.ts`: database-backed order commission workflow
- `src/lib/affiliate/attribution.ts`: referral URL and attribution-window helpers
- `src/lib/affiliate/db.ts`: click and attribution recording helpers
- `src/lib/affiliate/fraud.ts`: privacy-safe IP hashing and click heuristics
- `src/lib/affiliate/tree.ts`: parent assignment and ancestor lookup safety
- `src/lib/affiliate/wallet.ts`: ledger-derived balances

## Data Principles

- Every affiliate entity is scoped to `shopId`.
- Money is stored as integer cents.
- Percentages are stored as basis points.
- Wallet balances are ledger-derived.
- Payout details are modeled as encrypted snapshots.
- IP addresses should be hashed with `AFFILIATE_IP_HASH_SECRET`; raw IPs should not be stored.
- Commission generation must be idempotent for Stripe webhook retries.

## Compliance Framing

The system is a multi-tier affiliate and ambassador program. It is not a recruiting-income program. Commissions are paid only on qualified purchases of real products, memberships, digital goods, creator shop products, campaign merchandise, or approved commercial transactions.

FTC business guidance warns that earnings and lifestyle claims must be truthful, substantiated, and non-misleading. See the FTC's guidance: https://www.ftc.gov/business-guidance/resources/business-guidance-concerning-multi-level-marketing
