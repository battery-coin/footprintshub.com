# Ad Display System

Added:

- `AdSlot`
- `SponsoredBadge`
- `/ads/click/[campaignId]`
- `getLiveAdsForPlacement`
- `recordAdClick`

`AdSlot` renders approved/scheduled/live campaigns during their date window and falls back when no ads are available.

Click tracking records `AdClick`, increments daily `AdMetric`, and redirects to the approved target URL.

Impression aggregation is scaffolded for a future beacon or server-render counter.
