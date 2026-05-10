# Checkout Flow

Stripe Checkout remains the active payment flow.

## Added Validation Concepts

- guest checkout
- future customer account checkout
- billing address
- shipping address
- same-as-shipping flag
- shipping method selection
- order comment
- terms acceptance
- newsletter opt-in
- gift voucher/store credit/loyalty redemption
- digital-only checkout skips shipping
- physical checkout requires shipping
- preorder acknowledgement
- randomized item odds acknowledgement

## Implementation

- `src/lib/checkout/checkout-validation.ts`
- `src/lib/checkout/checkout-service.ts`

## Production Rules

- Server must recalculate prices.
- Server must validate inventory.
- Server must validate Stripe metadata.
- Stripe webhook remains the trusted paid-order trigger.
