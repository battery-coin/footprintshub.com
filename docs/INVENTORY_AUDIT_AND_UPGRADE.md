# Inventory Audit And Upgrade

## Current Status

The schema includes product inventory fields, inventory ledger, inventory item, inventory level, reservation, stock location, fulfillment, and shipment foundations.

## MVP Policy

- Do not deduct stock before verified payment.
- Use reservations during checkout when enabled.
- Deduct inventory exactly once on paid order.
- Release reservations on cancellation or expiration.
- Skip stock for digital products unless they are limited-edition digital products.
- Treat Printful products as mapped fulfillment products that may not use local stock quantity.

## Fixes In This Pass

- Admin dashboard now surfaces low-inventory products.
- Refund review documents restock/no-restock policy.
- Printful setup page clarifies unmapped product handling.

## Remaining Work

Connect inventory reservation and deduction workflows to live paid-order events with test coverage for duplicate webhooks.

