# Product Types Testing Checklist

- Create physical product.
- Create service product and verify shipping/inventory are hidden by default.
- Create digital download product and verify secure download settings appear.
- Create subscription product and verify recurring billing settings appear.
- Create NFT-linked product and verify claim/provenance/legal fields appear.
- One-time checkout uses Stripe payment mode.
- Subscription checkout uses Stripe subscription mode.
- Mixed one-time plus recurring cart is blocked.
- Digital-only cart does not require shipping.
- Paid digital order creates download entitlement when asset ID is configured.
- Download token blocks expired/revoked/exhausted access.
- Paid service order creates service order.
- Paid NFT-linked order creates NFT entitlement when mapping exists.
- `npx prisma validate` passes.
- `npx prisma generate` passes.
- `npm run build` passes.
- `npm run lint` passes if configured.
- `npm run typecheck` passes if configured.
