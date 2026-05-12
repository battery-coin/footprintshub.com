# Printful Multi-Tenant Strategy

## FootprintsHub Now

- Use one platform Printful account/store for the flagship shop.
- Store routing uses `PRINTFUL_STORE_ID`.
- Shop fields allow future per-shop enablement and mode selection.

## Hero Studio Later

- `shop.herostudio.org` can use the platform Printful account first.
- Creator subdomains can use platform fulfillment until encrypted credential storage and support workflows exist.
- Creator-owned Printful API keys should not be accepted until encryption, audit, revocation, and owner approval controls are implemented.

## Shop Fields

- `printfulEnabled`
- `printfulStoreId`
- `printfulMode`
- `printfulDefaultConfirmOrders`
