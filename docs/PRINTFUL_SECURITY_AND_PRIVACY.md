# Printful Security And Privacy

- `PRINTFUL_API_KEY` is server-only and never prefixed with `NEXT_PUBLIC_`.
- Product mapping and retry APIs require `canManagePrintful`.
- Stripe webhook signature verification happens before paid-order completion.
- Printful submission runs only from server workflows after payment is verified.
- Request/response snapshots avoid payment card data.
- Customer shipping addresses are sent to Printful only for Printful-eligible items.
- Retry uses `printful:order:{orderId}` idempotency.
- Webhook route supports a private shared secret via `PRINTFUL_WEBHOOK_SECRET`.

Known remaining hardening:

- Add provider-specific webhook signature verification if Printful exposes a signed header for the configured app.
- Add rate limiting around admin retry endpoints.
- Add alerting for repeated fulfillment failures.
