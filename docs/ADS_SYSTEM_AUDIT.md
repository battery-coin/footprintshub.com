# Ads System Audit

## Current support

- Products already support non-shipping product types, payment modes, delivery modes, variants, pricing, media, and affiliate eligibility.
- Cart and checkout already support server-side pricing and Stripe Checkout.
- Subscription mode exists for recurring product carts, with mixed one-time/recurring carts blocked.
- Product-type order completion exists and now supports extension points for ad campaigns.
- Admin RBAC already includes `canManageAds` and `canApproveAdCreatives`.

## Gaps before this pass

- No ad product types.
- No ad placement, campaign, creative, schedule, click, impression, or metric models.
- No `/ads`, `/ads/buy`, `/advertise`, or sponsorship purchase pages.
- No advertiser creative submission flow.
- No admin ads control panel.
- No ad display slot or click tracking route.
- No ad policy/legal pages.

## Actions taken

Implemented ad product types, schema, public ad catalog, campaign creation from paid ad order items, admin ads pages, creative submission, click tracking, AdSlot rendering, and legal/security/reporting docs.
