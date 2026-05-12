# Mixed Payment Checkout Flow

Modes:

- `fiat_only`: normal Stripe checkout.
- `token_only`: setup-required until token provider is enabled.
- `mixed_ratio`: calculates USD portion and token portion.

Current safe MVP behavior:

- Owner can configure mixed payment policies.
- Checkout blocks mixed/token checkout unless `ENABLE_TOKEN_PAYMENT_PROVIDER=true`.
- Stripe charges only the fiat portion when token provider is enabled.
- Orders are not fully paid until the payment composition is complete.

Fulfillment, Printful, digital delivery, and affiliate commissions must wait for full payment completion.
