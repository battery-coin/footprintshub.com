# Mixed Payment Policy

The owner can configure global payment composition at:

- `/admin/settings/payments/mixed`

Supported presets:

- 100% USD / 0% token
- 75% USD / 25% token
- 50% USD / 50% token
- 25% USD / 75% token
- 0% USD / 100% token
- custom values

If token portion is greater than zero and `ENABLE_TOKEN_PAYMENT_PROVIDER` is not `true`, checkout returns a setup-required response and does not create a live Stripe checkout session.

No investment language is used. Token payment is framed as a utility token payment portion.
