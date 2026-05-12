# Ad Checkout Flow

Ad products use the same cart and checkout as other products.

1. Customer adds an ad package to cart.
2. Checkout uses Stripe payment mode for one-time ads or subscription mode for recurring ad packages.
3. Ad products do not require shipping.
4. Paid order completion creates an `AdCampaign`.
5. Campaign stays `pending_creative` or `pending_review`.
6. Advertiser submits creative.
7. Admin approves, rejects, pauses, schedules, or completes the campaign.
8. Affiliate commissions can apply only to qualified ad purchases if enabled.
