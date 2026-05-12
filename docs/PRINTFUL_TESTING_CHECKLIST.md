# Printful Testing Checklist

- [ ] Missing `PRINTFUL_API_KEY` fails safely.
- [ ] Product mapping validation catches missing variant ID.
- [ ] Digital-only order does not submit to Printful.
- [ ] Manual/internal item does not submit to Printful.
- [ ] Printful-only order submits after verified Stripe paid webhook.
- [ ] Mixed order sends only Printful items.
- [ ] Duplicate Stripe webhook does not create duplicate Printful orders.
- [ ] Printful API failure marks fulfillment failed/requires attention.
- [ ] Admin retry does not duplicate if provider order exists.
- [ ] Shipping address is required for Printful products.
- [ ] Malformed shipping address blocks submission.
- [ ] Printful status refresh updates internal status.
- [ ] No Printful key appears in client bundle.
- [ ] `npx prisma validate` passes.
- [ ] `npm run build` passes.
- [ ] `npm run lint` passes if available.
- [ ] `npm run typecheck` passes if available.
