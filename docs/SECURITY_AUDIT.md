# Security Audit

Audit date: 2026-05-09

## npm Audit

Command:

```powershell
npm audit --omit=dev
```

Result:

- 2 moderate production advisories reported.
- Advisory path: `next` depends on `postcss <8.5.10`.
- npm suggests `npm audit fix --force`, but that proposes a breaking downgrade to `next@9.3.3`.

Decision:

- Do not run `npm audit fix --force`.
- Stay on current stable Next.js for now.
- Re-check when a stable Next release includes the patched PostCSS dependency.

## Secret Handling

Do not commit:

- `.env`
- `.env.local`
- Stripe secret keys
- Stripe webhook secrets
- Neon database passwords
- production admin secrets
- private keys

## Checkout Safety

Client cart prices are display-only. Checkout routes re-read product IDs and recalculate line item prices server-side before creating Stripe Checkout Sessions.
