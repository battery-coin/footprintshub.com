# Affiliate Business Model Testing Checklist

## Plan Resolution

- Shop default plan resolves.
- Creator shop override resolves.
- Campaign override resolves.
- Affiliate-specific override resolves.

## Commission Models

- Flat direct commission.
- Product-specific commission.
- Category/collection commission.
- Campaign commission.
- Rank-based commission.
- Performance-tier commission.
- Lifetime attribution commission.
- Coupon attribution commission.
- Hybrid commission.

## 7-Level Rules

- Level 0 direct.
- Level 1 parent.
- Level 2 grandparent.
- Levels 3 through 7.
- Max active levels respected.
- Disabled level ignored.
- Rank requirement enforced.
- `pay_zero` compression.
- `skip_ineligible` compression.
- `compress_to_next_qualified` compression.
- Max commission pool cap.

## Refunds

- Full refund reverses all commissions.
- Partial refund reverses proportional commissions.
- Already-paid commission creates negative adjustment.

## Fraud

- Own referral blocked.
- Self-purchase blocked.
- Sale item blocked.
- Product exclusion.
- Monthly cap.

## Idempotency

- Duplicate Stripe webhook does not duplicate commissions.
- Duplicate future Coinbase webhook does not duplicate commissions.
- Duplicate refund webhook does not duplicate reversals.

## Wallet

- Pending ledger entry created.
- Approved ledger entry created.
- Payout debit created.
- Ledger balance matches commission records.

## Commands

```powershell
npm run prisma:generate
npm run typecheck
npm test
npm run build
```
