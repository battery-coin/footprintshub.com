# Printful Audit And Upgrade

## Added In This Pass

- `src/lib/printful/printful-service.ts`
- `/admin/printful`
- `/api/printful/webhook`
- `PrintfulOrder` Prisma model
- Printful env vars in `.env.example`
- `/legal/printful-fulfillment`

## Safety Rules

- `PRINTFUL_API_KEY` is server-only.
- Paid orders should be submitted to Printful only after verified payment.
- Retries must use idempotency keys tied to order IDs.
- Unmapped products stay in manual fulfillment review.
- If Printful credentials are missing, the storefront still works and admin shows setup required state.

## Remaining Work

- Map product variants to Printful sync variant IDs.
- Submit paid physical/Printful orders from `completePaidOrder`.
- Store Printful request and response IDs.
- Add admin retry after failure.
- Validate webhook events with gateway/header controls.

