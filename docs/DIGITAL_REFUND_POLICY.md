# Digital Refund Policy

Digital products require stricter refund handling because access may already have been delivered.

## Default

Digital refunds require manual review. The refund workflow marks affected download entitlements with refund review metadata instead of automatically revoking access.

## Recommended Policy Options

- `no_refund`: digital purchases are final after access is granted.
- `manual_review`: support reviews the order, download history, and customer reason.
- `revoke_on_refund`: access is revoked after refund is confirmed.
- `keep_access`: refund is issued while leaving access active.

## Current Status

This pass implements the manual-review marker. Automatic digital access revocation remains a policy-specific future step.
