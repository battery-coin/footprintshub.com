# Mixed Fiat Token Payment Schema

Added Prisma support for utility token payment policy configuration:

- `PaymentCompositionMode`
- `PaymentPolicyStatus`
- `PaymentPolicyAppliesTo`
- `PaymentRoundingMode`
- `OrderPaymentCompositionStatus`
- `TokenPaymentIntentStatus`
- `PaymentPart`
- `TokenPaymentAsset`
- `PaymentPolicy`
- `ProductPaymentPolicy`
- `SubscriptionPaymentPolicy`
- `OrderPaymentComposition`
- `TokenPaymentIntent`

Payment percentages are stored in basis points:

- `10000` = 100%
- `5000` = 50%
- `3000` = 30%

Mixed ratio policies require `fiatPercentageBps + tokenPercentageBps = 10000`.

Battery Coin/token payments are modeled only as utility/payment access.
