# Product Types Schema

## Added or extended

- `ProductType`: added digital download, subscription, NFT, NFT-linked physical, print-on-demand, event access, and appointment.
- `ProductPaymentMode`: one-time, recurring, one-time-or-recurring, free, external.
- `ProductDeliveryMode`: shipped, download, access grant, service scheduled, subscription access, NFT claim, hybrid, none.
- `Product`: payment mode, delivery mode, scheduling/download/wallet requirements, subscription/NFT eligibility, terms requirement, and access duration.
- `ProductVariant`: Stripe one-time/recurring price IDs, recurring interval, trial days, and links to digital/service/NFT templates.
- `DownloadAsset`: description, storage key, file size, MIME type, checksum, and access type.
- `DownloadEntitlement`: token, first/last download timestamps, revocation, and access logs.
- `ServiceProduct`, `ServiceOrder`.
- `SubscriptionPlan`, `CustomerSubscription`, `SubscriptionEntitlement`.
- `NFTProduct`, `NFTEntitlement`.
- `ProductBundleItem`.
- `Payment`: Stripe mode, subscription ID, and customer ID.
- `OrderItem`: product type, fulfillment type, payment mode snapshots, and entitlement reference IDs.

## Migration note

No production migration was run in this pass. Generate and apply a reviewed Prisma migration before deploying schema-dependent features to Neon.
