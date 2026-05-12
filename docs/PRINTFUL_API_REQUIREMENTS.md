# Printful API Requirements

## Required Setup

- `PRINTFUL_API_KEY`: server-only private/OAuth token.
- `PRINTFUL_STORE_ID`: required when the token is account-level.
- `PRINTFUL_API_BASE_URL`: defaults to `https://api.printful.com`.
- `PRINTFUL_CONFIRM_ORDERS`: keep `false` until test orders are verified.
- `PRINTFUL_DEFAULT_SHIPPING_METHOD`: defaults to `STANDARD`.
- `PRINTFUL_WEBHOOK_SECRET`: optional shared secret for the local webhook route.

## API Notes

- Printful uses REST endpoints under `https://api.printful.com`.
- Orders can be created with `POST /orders`.
- `confirm=true` can submit the new order for fulfillment immediately.
- Draft orders can be confirmed later with `POST /orders/{id}/confirm`.
- Account-level tokens should include `X-PF-Store-Id`.
- Sync products use store/sync product and sync variant identifiers.
- Order statuses include draft, inreview, pending, failed, inprocess, onhold, partial, fulfilled, canceled, and archived.

## Manual Printful Setup

1. Create or connect a Manual order/API store in Printful.
2. Generate a private token with order and sync product scopes.
3. Add `PRINTFUL_API_KEY` and, if needed, `PRINTFUL_STORE_ID` to Railway.
4. Map at least one FootprintsHub product and variant to a Printful variant or sync variant.
5. Run a paid Stripe test order with `PRINTFUL_CONFIRM_ORDERS=false`.
6. Confirm the draft in Printful manually.
7. Only set `PRINTFUL_CONFIRM_ORDERS=true` after billing, shipping, and support handling are tested.

## Risks

- Missing mapping blocks fulfillment submission.
- Missing shipping address blocks fulfillment submission.
- Live confirm can charge the Printful account.
- Printful shipping rates are not yet live-calculated in checkout.
