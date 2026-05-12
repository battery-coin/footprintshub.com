# Ad Schema

Added models:

- `AdPlacement`
- `AdProductConfig`
- `AdCampaign`
- `AdCreative`
- `AdScheduleSlot`
- `AdMetric`
- `AdClick`
- `AdImpression`
- `SponsoredPlacement`
- `AdPolicyAcceptance`
- `AdSubscription`

`OrderItem` now has nullable `adCampaignId`.

Commission scopes now include `ad_placement`, `sponsorship`, `campaign_boost`, and `recurring_ad_subscription`.

No production migration was applied in this pass.
