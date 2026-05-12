# Product Types Audit

## Current state before this pass

- Product editor existed at `src/components/admin/products/ProductEditor.tsx`.
- Product create/edit APIs validated through `src/lib/products/product-validation.ts` and persisted through `src/lib/products/product-service.ts`.
- Existing product types covered physical, digital, bundle, membership, preorder, blind box, booster pack, digital unlock, service, and supporter bundle.
- Checkout used Stripe Checkout payment mode only.
- Digital download storage existed as `DownloadAsset` and `DownloadEntitlement`, but lacked token download access logs and product-editor guidance.
- Service orders, subscription plans, customer subscriptions, NFT-linked products, NFT entitlements, and bundle component records were missing.

## Gaps found

- No product-level `paymentMode` or `deliveryMode`.
- Product editor did not dynamically adapt fields by product type.
- Subscription checkout mode was not resolved before Stripe session creation.
- Mixed one-time and recurring carts were not blocked with a clear message.
- NFT-linked product language and legal guardrails were not present in the editor.
- Secure download endpoint and access logging were missing.
- Account/admin pages for services, subscriptions, digital assets, and NFT-linked collectibles were missing.
