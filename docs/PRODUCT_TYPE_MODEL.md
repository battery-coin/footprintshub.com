# Product Type Model

FootprintsHub now models products by what the customer buys, how payment is collected, and how fulfillment happens.

## Product type

Supported product types include physical, digital download, digital unlock, service, subscription, membership, NFT-linked collectible, NFT-linked physical, bundle, preorder, blind box, booster pack, print-on-demand, event access, appointment, and supporter bundle.

## Payment mode

- `one_time`: standard Stripe Checkout payment.
- `recurring`: Stripe Checkout subscription mode.
- `one_time_or_recurring`: editor-supported, checkout requires a selected recurring/one-time path in a future pass.
- `free`: scaffolded; free checkout is blocked until entitlement-only checkout is enabled.
- `external`: blocked at checkout with a support message.

## Delivery mode

Delivery modes include shipped, download, access grant, scheduled service, subscription access, NFT claim, hybrid, and none.

## Dynamic editor rule

The product editor changes by product type. Services hide inventory/shipping by default, digital downloads show secure file settings, subscriptions show recurring billing settings, and NFT-linked products show claim/provenance/legal fields without investment language.
