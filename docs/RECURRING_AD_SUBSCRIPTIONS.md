# Recurring Ad Subscriptions

Recurring ad products use the existing recurring checkout mode.

Schema includes `AdSubscription` to connect a customer subscription to an ad placement and campaign.

Current status: recurring checkout support is available through product `paymentMode=recurring`; automated schedule extension per Stripe `invoice.paid` remains a next-phase workflow.
