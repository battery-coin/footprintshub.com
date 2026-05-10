# Hero Studio Integration Readiness

## Standalone First

FootprintsHub remains the flagship store at `footprintshub.com`. It owns the initial catalog, cart, checkout, legal, admin, affiliate, and fulfillment flows.

## Future Hero Studio Model

- `shop.herostudio.org` maps to a Hero Studio marketplace shop.
- `creatorname.herostudio.org` maps to a creator or fan-club shop through `ShopDomain`.
- Each shop can own products, settings, promotions, affiliate program, payout policy, and fulfillment rules.

## Cross-Domain Commerce

- Product embeds can point from Hero Studio pages to FootprintsHub or the future commerce API.
- Affiliate links can preserve `?ref=CODE` across domains through attribution records.
- Checkout redirects should carry shop, cart, attribution, and order metadata.
- Purchase events can later notify Hero Studio through internal webhooks.

## Events To Integrate Later

- `order.paid`
- `membership.purchased`
- `digital_unlock.granted`
- `affiliate.commission_created`
- `creator_product.sold`
- `fan_tier_updated`
- `campaign_supporter_purchased`

## Cloudflare And Railway

Cloudflare should own wildcard DNS, SSL, WAF, and cache rules. If Railway custom-domain limits block wildcard routing, a Cloudflare Worker can resolve hostnames and route to the correct Railway service.

