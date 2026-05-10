# Magento Custom Module Plan

## Purpose

Custom modules should be added only when Magento configuration, marketplace extensions, or clean integration services are insufficient.

## Candidate Modules

- Hero Studio product feed bridge
- Signed webhook dispatcher
- Customer/order ownership verification
- Digital unlock entitlement bridge
- Limited drop and creator drop metadata
- Future Battery Coin utility checkout bridge

## Module Rules

- Keep modules scoped and independently testable.
- Avoid placing Hero Studio application logic inside Magento.
- Avoid committing secrets or environment-specific configuration.
- Prefer service contracts, events, and APIs over direct cross-system coupling.

