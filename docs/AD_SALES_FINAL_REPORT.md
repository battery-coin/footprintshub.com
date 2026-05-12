# Ad Sales Final Report

## Summary

Added ad sales as a first-class FootprintsHub product/business line.

## Added

- Ad product types, delivery modes, fulfillment modes, and commission scopes.
- Ad schema for placements, product configs, campaigns, creatives, schedules, metrics, clicks, impressions, sponsored placements, policy acceptance, and ad subscriptions.
- Public ad routes: `/ads`, `/ads/buy`, `/advertise`, `/advertise/packages`, `/advertise/packages/[slug]`, `/advertise/success`, `/advertise/policy`, `/advertise/faq`, and `/sponsors/advertise`.
- Advertiser campaign and creative submission routes.
- Admin ads control panel routes.
- Campaign creation from paid ad order items.
- AdSlot display component and click tracking redirect.
- Advertising legal pages and docs.

## Scaffolded

- Impression beacon aggregation.
- Automated recurring ad schedule extension after invoice renewal.
- Advanced placement conflict calendar.
- Conversion tracking.
- Advanced CSV/API ad package field mapping.

## Verification

- `npx prisma format`: passed.
- `npx prisma validate`: passed.
- `npx prisma generate`: passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm test`: passed, 69 tests.

## Remaining setup

- Create and apply reviewed Prisma migration before using the ad tables in Neon.
- Add real placement inventory and seed packages in production data.
- Add authenticated advertiser campaign lookup.
- Add impression beacon aggregation and recurring invoice-based schedule extension.
