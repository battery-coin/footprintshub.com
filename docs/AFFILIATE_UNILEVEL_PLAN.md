# Affiliate Unilevel Plan

Date: 2026-05-10

## Purpose

The Unilevel structure is the launch-ready affiliate structure. It supports unlimited frontline referrals and up to seven configurable commission levels.

## Functional Behavior

- Direct affiliate commission is Level 0.
- Ancestor commissions are calculated from `AffiliateTreeClosure`.
- Owner-defined `AffiliatePlanLevel` labels and percentages are used.
- Percentages are stored as basis points.
- Commissions are generated only after verified paid orders.
- Refunds and reversals remain handled by the existing commission/refund flow.

## Default Levels

- Level 0 Direct Affiliate: 10%
- Level 1 Parent Ambassador: 2%
- Level 2 Grandparent Ambassador: 1.5%
- Level 3 Ambassador: 1%
- Level 4 Ambassador: 0.75%
- Level 5 Ambassador: 0.5%
- Level 6 Ambassador: 0.25%
- Level 7 Ambassador: 0.25%

## Compliance Guardrail

Unilevel commissions are qualified purchase commissions. No commission is paid for recruitment alone.
