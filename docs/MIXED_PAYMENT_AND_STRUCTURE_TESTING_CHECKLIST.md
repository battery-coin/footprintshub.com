# Mixed Payment And Structure Testing Checklist

- Binary “Use This Structure” creates a plan and redirects to Binary settings.
- Matrix “Use This Structure” creates a plan and redirects to Matrix settings.
- Unilevel “Use This Structure” creates a plan and redirects to level settings.
- Binary labels/settings save and reload when database is configured.
- Matrix width/depth/settings save and reload when database is configured.
- Unilevel labels/percentages save as basis points.
- `/admin/settings/payments/mixed` renders.
- 50% USD / 50% Battery Coin saves.
- Invalid 60% / 60% is blocked.
- `/admin/settings/tokens` renders.
- Token asset saves without private keys or seed phrases.
- Checkout blocks mixed/token policies when token provider is not enabled.
- Stripe fiat-only checkout still works.
- Order completion waits for full payment composition.
- Affiliate commission waits for full payment completion.

Run:

- `npx prisma format`
- `npx prisma validate`
- `npx prisma generate`
- `npm run build`
- `npm run lint`
- `npm run typecheck`

Latest local results:

- `npx prisma format`: passed
- `npx prisma validate`: passed
- `npx prisma generate`: passed
- `npm run test`: passed, 63 tests
- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run build`: passed
