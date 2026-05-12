# Printful Refund And Return Policy

Printful fulfillment affects refund handling because production and shipping may be irreversible after a certain point.

## Local Behavior

If an order has Printful records in progressed states such as submitted, accepted, in production, fulfilled, shipped, or delivered, the refund workflow marks the order metadata with `printfulRefundReviewRequired`.

## Policy

- Not submitted: refund can proceed normally and no Printful cancellation is needed.
- Submitted but not in production: admin should attempt cancellation if Printful supports it for the current order state.
- In production or shipped: admin review is required before refunding.
- Defective or damaged item: admin may issue refund or replacement according to support policy.

## Current Status

The system flags Printful review during refund side effects. Automated Printful cancellation is not claimed live in this pass.
