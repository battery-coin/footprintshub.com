# Affiliate Compression Rules

Compression controls what happens when an ancestor is not qualified for a paid level.

## pay_zero

The unqualified level earns zero and no one receives the skipped commission.

Default and lowest risk.

## skip_ineligible

The unqualified affiliate is skipped, but deeper ancestors are still evaluated at their original depth.

Useful when qualification controls should not block the rest of the network.

## compress_to_next_qualified

The skipped level can move to the next qualified ancestor.

This must be capped, audited, and clearly disclosed because it changes who receives the skipped amount.

## Current Default

FootprintsHub uses `pay_zero` by default for cleaner accounting and lower compliance risk.
