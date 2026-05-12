# Ad Product Model

Ad packages are normal products with ad-specific `ProductType`, non-shipping delivery, and optional recurring payment.

Supported ad product types:

- `ad_placement`
- `sponsorship`
- `campaign_boost`
- `creator_promotion`
- `fan_club_promotion`
- `newsletter_ad`
- `homepage_feature`
- `banner_ad`
- `video_ad`
- `event_sponsorship`
- `classified_ad`
- `featured_listing`
- `social_promotion_package`

Ad products should use `requiresShipping=false`, `deliveryMode=ad_review_and_schedule` or a related ad delivery mode, and `fulfillmentType=ad_delivery`, `sponsorship_delivery`, or `promotion_delivery`.
