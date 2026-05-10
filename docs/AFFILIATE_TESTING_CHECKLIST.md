# Affiliate Testing Checklist

## Automated Tests

Run:

```powershell
npm run test
npm run typecheck
npm run lint
npm run build
```

Required commission scenarios:

- Direct percentage commission
- Direct fixed commission
- Product override
- Category override
- Affiliate-specific override
- Multi-level depth 1
- Multi-level depth 2
- Max level cap
- Own-referral block
- Sale item block
- Refund reversal
- Duplicate webhook idempotency
- Monthly cap
- Payout request below minimum rejected
- Wallet ledger balances match commission totals

## Manual Smoke Checks

- `/affiliate/apply` loads.
- `/affiliate/dashboard` loads.
- `/affiliate/links` shows referral link tools.
- `/affiliate/team` uses referral-network language, not recruiting-income language.
- `/admin/affiliates` loads.
- `/admin/affiliates/settings` shows 7-level configuration concepts.
- `/legal/affiliate-terms` loads.
- `/legal/affiliate-disclosure` loads.
- `/legal/ambassador-program-rules` loads.
- `/r/FOUNDER` redirects and stores referral cookies.
- `POST /api/affiliate/click` rejects invalid payloads.
- `POST /api/affiliate/payouts/request` rejects requests below the minimum.
- Stripe webhook verifies signatures and calls commission calculation only after a persisted paid order exists.
