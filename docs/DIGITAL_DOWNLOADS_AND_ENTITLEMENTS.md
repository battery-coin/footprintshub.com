# Digital Downloads And Entitlements

Digital downloads use `DownloadAsset`, `DownloadEntitlement`, and `DownloadAccessLog`.

## Flow

1. Customer buys a digital download product.
2. Stripe confirms payment.
3. Order completion creates a download entitlement when the order item references a digital asset.
4. The customer uses `/download/[token]`.
5. The endpoint checks token, status, expiration, revocation, and remaining downloads.
6. Successful or blocked attempts are logged.

## Storage

Cloudflare R2 or another protected storage provider should store private files. Public direct file URLs are acceptable only for testing or non-private assets.
