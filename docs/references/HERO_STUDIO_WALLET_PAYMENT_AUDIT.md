# Hero Studio Wallet and Payment Audit

Inspected repo:

- `C:\Users\saveo\OneDrive\Documents\GitHub\hero-reel-studio`

Typo path checked:

- `C:\Users\saveo\opendrive\documents\github\hero-reel-studio` was not present.

## Packages Found

- `viem` is installed and used server-side for wallet signature verification.
- No `wagmi`, `@coinbase/wallet-sdk`, or Reown AppKit package was found in `package.json`.
- Stripe and Coinbase Business checkout implementations were not found as production checkout rails in the inspected wallet files.

## Files Reviewed

- `package.json`
- `src/pages/WalletPage.tsx`
- `src/components/wallet/WalletSettingsPanel.tsx`
- `src/components/wallet/WalletPaymentPanel.tsx`
- `src/lib/services/walletAccount.service.ts`
- `src/lib/services/cryptoPayment.service.ts`
- `src/lib/wallets/wallet.config.ts`
- `src/lib/wallets/wallet.providers.ts`
- `src/lib/wallets/wallet.types.ts`
- `server/index.mjs` wallet nonce, verify, wallet list, disconnect, and preview crypto payment routes

## Useful Patterns

- Wallet ownership is verified through nonce + signed message.
- The signature message says it proves wallet ownership only and does not authorize token transfers.
- Nonces expire and are marked used after verification.
- `viem.verifyMessage` is used for EVM wallet signatures.
- Wallet payment copy is preview-first and explicitly disabled until backend activation and compliance review.

## Patterns Rejected

- Hero Studio preview crypto payment intents do not prove payment and should not mark FootprintsHub orders paid.
- Raw Vite client env patterns were not copied into Next.js server routes.
- The large single-file server implementation was not copied; FootprintsHub uses small Next.js route handlers and Prisma models.

## Recommendation Applied

FootprintsHub now uses Coinbase Business Checkout as the P0 payment rail and keeps wallet connection as an optional identity layer. Wallet connection never marks orders paid.
