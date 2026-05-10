# OpenCart Schema Mapping

## Added Tables

- `Brand`
- `ProductOption`
- `ProductOptionValue`
- `ProductReview`
- `Wishlist`
- `WishlistItem`
- `CompareList`
- `CompareItem`
- `GiftVoucher`
- `StoreCreditLedger`
- `LoyaltyPointLedger`
- `ReturnRequest`
- `DownloadAsset`
- `DownloadEntitlement`
- `InformationPage`
- `Banner`
- `Currency`
- `Country`
- `Zone`
- `GeoZone`
- `GeoZoneRegion`
- `TaxRate`
- `TaxRule`
- `WeightClass`
- `LengthClass`
- `AdminRole`
- `AdminUserRole`
- `OrderHistory`
- `CustomerGroup`

## Existing Tables Extended

- `Product`: optional `brandId`, relations to options, reviews, wishlists, compare items, and downloads.
- `Customer`: optional structured customer group and relations to wishlists, credit, loyalty, returns, reviews, downloads.
- `Order`: histories, returns, store credit, loyalty, download entitlements.
- `TaxClass`: now relates to `TaxRule`.

## Ledger Rules

Store credit and loyalty points are ledger-based. Do not store mutable balances without ledger history.

## Tenant Rules

All commerce objects that belong to a shop include `shopId`. Global localization objects such as `Currency`, `Country`, and `Zone` are shared reference data.
