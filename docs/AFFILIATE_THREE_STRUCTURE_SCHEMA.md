# Affiliate Three-Structure Schema

Date: 2026-05-10

## Summary

The Prisma schema now supports three owner-selectable affiliate structures while preserving the existing business-model plan layer.

## New Or Extended Concepts

- `AffiliateStructureType`: `binary`, `matrix`, `unilevel`
- `AffiliatePlan.structureType`: active structure selector for the plan
- `AffiliateProgram.activePlanId`: active owner-selected plan
- `AffiliatePlanLevel.structureType`: structure-aware editable level rows
- `AffiliatePlanLevel.label`: owner-editable display label
- `AffiliatePlanLevel.percentageBps`: owner-editable percentage stored as basis points
- `AffiliateCommission.structureType`: commission provenance by structure
- `AffiliateCommission.legSide`: Binary left/right attribution metadata
- `AffiliateCommission.matrixPositionId`: Matrix position attribution metadata
- `AffiliateCommission.volumeCents`: volume basis for Binary/Matrix calculations

## New Configuration Models

- `BinaryPlanConfig`
- `BinaryLegVolume`
- `MatrixPlanConfig`
- `MatrixPosition`
- `UnilevelPlanConfig`
- `AffiliateStructureTemplate`

## Commission Bases Added

- `leg_volume`
- `weaker_leg_volume`
- `matrix_level_volume`

## Extra Commission Scopes Added

- `ad_product`
- `service`
- `subscription`
- `digital`
- `nft`

## Migration Note

No production migration was run in this implementation pass. Prisma format, validate, and generate are used locally to verify schema correctness. Apply migrations to Neon only after reviewing the generated migration and confirming it is safe for the target database.
