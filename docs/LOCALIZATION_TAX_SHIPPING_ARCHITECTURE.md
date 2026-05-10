# Localization, Tax, and Shipping Architecture

## OpenCart-Inspired Foundations

- `Currency`
- `Country`
- `Zone`
- `GeoZone`
- `GeoZoneRegion`
- `TaxClass`
- `TaxRate`
- `TaxRule`
- `WeightClass`
- `LengthClass`
- `ShippingMethod`

## MVP Defaults

- Currency: USD.
- Country: United States.
- Shipping: flat rate.
- Tax: placeholder until configured with legal/tax guidance.
- Units: pounds/inches or ounces/inches depending product fulfillment strategy.

## Warning

Tax calculation is not production-ready until nexus, product taxability, regional rates, Stripe Tax or provider strategy, and reporting obligations are configured.
