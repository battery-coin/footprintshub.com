# Printful Product Mapping

Admins map products in the product editor and review them at:

- `/admin/printful`
- `/admin/printful/products`
- `/admin/products/[id]/printful`

Required for live fulfillment:

- Product is marked `fulfillmentType=printful` or `printfulEnabled=true`.
- Product has a Printful product, sync product, or template ID.
- Each variant submitted to Printful has a `printfulVariantId` or `printfulSyncVariantId`.
- Product requires shipping.

Unmapped or partially mapped products remain in fulfillment review and are not silently submitted.
