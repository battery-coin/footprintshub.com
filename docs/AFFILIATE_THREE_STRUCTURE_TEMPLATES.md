# Affiliate Three-Structure Templates

Date: 2026-05-10

Templates live in `src/lib/affiliate/structure-templates.ts`.

## Binary Structure

Two-team structure with owner-editable Left Team and Right Team labels. The default calculation preview is based on weaker-leg volume with pair-matching settings available.

Default settings:

- Payout basis: weaker-leg volume
- Spillover mode: weaker leg
- Pair ratio: 1:1
- Pair commission: 10%
- Carry-forward volume: enabled
- Real payout engine status: scaffolded

## Matrix Structure

Fixed width by depth structure, such as 3 x 7. The owner can edit width, depth, spillover mode, completion bonus, and level percentages.

Default settings:

- Width: 3
- Depth: 7
- Spillover mode: breadth first
- Level commission mode: per-level percentage
- Real payout engine status: scaffolded

## Unilevel Structure

Unlimited frontline structure with level-based commissions up to seven levels. This is the recommended launch default because it is transparent and uses the existing closure-table ancestor path.

Default levels:

- Level 0 Direct Affiliate: 10%
- Level 1 Parent Ambassador: 2%
- Level 2 Grandparent Ambassador: 1.5%
- Level 3 Ambassador: 1%
- Level 4 Ambassador: 0.75%
- Level 5 Ambassador: 0.5%
- Level 6 Ambassador: 0.25%
- Level 7 Ambassador: 0.25%

Real payout engine status: functional.
