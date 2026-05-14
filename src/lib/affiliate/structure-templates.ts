import type {
  AffiliateStructureType,
  BinaryPayoutBasis,
  BinarySpilloverMode,
  CommissionBase,
  CommissionType,
  MatrixLevelCommissionMode,
  MatrixSpilloverMode,
} from "./types";
import { formatBpsAsPercent } from "@/lib/money/percentage-bps";

export type StructureLevelTemplate = {
  levelDepth: number;
  label: string;
  enabled: boolean;
  commissionType: CommissionType;
  percentageBps?: number;
  fixedCents?: number;
  commissionBase: CommissionBase;
  maxPerOrderCents?: number;
  maxPerMonthCents?: number;
  sortOrder: number;
};

export type BinaryStructureConfig = {
  leftLabel: string;
  rightLabel: string;
  payoutBasis: BinaryPayoutBasis;
  pairRatioLeft: number;
  pairRatioRight: number;
  pairCommissionType: CommissionType;
  pairCommissionBps?: number;
  pairFixedCents?: number;
  spilloverMode: BinarySpilloverMode;
  carryForwardVolume: boolean;
  flushAfterPayout: boolean;
  maxPairsPerPeriod?: number;
};

export type MatrixStructureConfig = {
  width: number;
  depth: number;
  spilloverMode: MatrixSpilloverMode;
  completionBonusEnabled: boolean;
  completionBonusCents?: number;
  levelCommissionMode: MatrixLevelCommissionMode;
};

export type UnilevelStructureConfig = {
  unlimitedFrontline: boolean;
  maxDepth: number;
  compressionBehavior: "pay_zero" | "skip_ineligible" | "compress_to_next_qualified";
};

export type AffiliateStructureTemplate = {
  key: string;
  name: string;
  structureType: AffiliateStructureType;
  description: string;
  bestUseCase: string;
  complexity: "Low" | "Medium" | "High";
  riskLevel: "low" | "medium" | "high";
  engineStatus: "functional" | "configurable";
  defaultConfig: BinaryStructureConfig | MatrixStructureConfig | UnilevelStructureConfig;
  defaultLevels: StructureLevelTemplate[];
};

export const unilevelDefaultLevels: StructureLevelTemplate[] = [
  { levelDepth: 0, label: "Direct Affiliate", enabled: true, commissionType: "percentage", percentageBps: 1000, commissionBase: "product_subtotal", sortOrder: 0 },
  { levelDepth: 1, label: "Parent Ambassador", enabled: true, commissionType: "percentage", percentageBps: 200, commissionBase: "product_subtotal", sortOrder: 1 },
  { levelDepth: 2, label: "Grandparent Ambassador", enabled: true, commissionType: "percentage", percentageBps: 150, commissionBase: "product_subtotal", sortOrder: 2 },
  { levelDepth: 3, label: "Third-Level Ambassador", enabled: true, commissionType: "percentage", percentageBps: 100, commissionBase: "product_subtotal", sortOrder: 3 },
  { levelDepth: 4, label: "Fourth-Level Ambassador", enabled: true, commissionType: "percentage", percentageBps: 75, commissionBase: "product_subtotal", sortOrder: 4 },
  { levelDepth: 5, label: "Fifth-Level Ambassador", enabled: true, commissionType: "percentage", percentageBps: 50, commissionBase: "product_subtotal", sortOrder: 5 },
  { levelDepth: 6, label: "Sixth-Level Ambassador", enabled: true, commissionType: "percentage", percentageBps: 25, commissionBase: "product_subtotal", sortOrder: 6 },
  { levelDepth: 7, label: "Seventh-Level Ambassador", enabled: true, commissionType: "percentage", percentageBps: 25, commissionBase: "product_subtotal", sortOrder: 7 },
];

export const matrixDefaultLevels: StructureLevelTemplate[] = [
  { levelDepth: 1, label: "Matrix Level 1", enabled: true, commissionType: "percentage", percentageBps: 500, commissionBase: "matrix_level_volume", sortOrder: 1 },
  { levelDepth: 2, label: "Matrix Level 2", enabled: true, commissionType: "percentage", percentageBps: 300, commissionBase: "matrix_level_volume", sortOrder: 2 },
  { levelDepth: 3, label: "Matrix Level 3", enabled: true, commissionType: "percentage", percentageBps: 200, commissionBase: "matrix_level_volume", sortOrder: 3 },
  { levelDepth: 4, label: "Matrix Level 4", enabled: true, commissionType: "percentage", percentageBps: 100, commissionBase: "matrix_level_volume", sortOrder: 4 },
  { levelDepth: 5, label: "Matrix Level 5", enabled: true, commissionType: "percentage", percentageBps: 75, commissionBase: "matrix_level_volume", sortOrder: 5 },
  { levelDepth: 6, label: "Matrix Level 6", enabled: true, commissionType: "percentage", percentageBps: 50, commissionBase: "matrix_level_volume", sortOrder: 6 },
  { levelDepth: 7, label: "Matrix Level 7", enabled: true, commissionType: "percentage", percentageBps: 25, commissionBase: "matrix_level_volume", sortOrder: 7 },
];

export const binaryDefaultLevels: StructureLevelTemplate[] = [
  { levelDepth: 0, label: "Direct Sponsor Commission", enabled: true, commissionType: "percentage", percentageBps: 1000, commissionBase: "product_subtotal", sortOrder: 0 },
  { levelDepth: 1, label: "Weaker Leg Volume", enabled: true, commissionType: "percentage", percentageBps: 1000, commissionBase: "weaker_leg_volume", sortOrder: 1 },
  { levelDepth: 2, label: "Pair Match", enabled: true, commissionType: "fixed", fixedCents: 500, commissionBase: "leg_volume", sortOrder: 2 },
];

export const affiliateStructureTemplates: AffiliateStructureTemplate[] = [
  {
    key: "binary-balanced-teams",
    name: "Binary Structure",
    structureType: "binary",
    description: "Two-team structure with configurable left and right team labels, weaker-leg volume, and pair settings.",
    bestUseCase: "Owners who need a left/right team view and want volume-balancing controls.",
    complexity: "High",
    riskLevel: "high",
    engineStatus: "configurable",
    defaultConfig: {
      leftLabel: "Left Team",
      rightLabel: "Right Team",
      payoutBasis: "weaker_leg_volume",
      pairRatioLeft: 1,
      pairRatioRight: 1,
      pairCommissionType: "percentage",
      pairCommissionBps: 1000,
      spilloverMode: "weaker_leg",
      carryForwardVolume: true,
      flushAfterPayout: false,
    },
    defaultLevels: binaryDefaultLevels,
  },
  {
    key: "matrix-3x7",
    name: "Matrix Structure",
    structureType: "matrix",
    description: "Fixed width by depth structure with configurable level labels, level percentages, and spillover mode.",
    bestUseCase: "Owners who need controlled grid placement, spillover settings, and structured level payouts.",
    complexity: "Medium",
    riskLevel: "medium",
    engineStatus: "configurable",
    defaultConfig: {
      width: 3,
      depth: 7,
      spilloverMode: "breadth_first",
      completionBonusEnabled: false,
      levelCommissionMode: "per_level_percentage",
    },
    defaultLevels: matrixDefaultLevels,
  },
  {
    key: "unilevel-7-level",
    name: "Unilevel Structure",
    structureType: "unilevel",
    description: "Unlimited frontline structure with capped level-based purchase commissions up to seven levels.",
    bestUseCase: "Recommended launch plan because it is transparent, auditable, and already supported by the commission engine.",
    complexity: "Low",
    riskLevel: "low",
    engineStatus: "functional",
    defaultConfig: {
      unlimitedFrontline: true,
      maxDepth: 7,
      compressionBehavior: "pay_zero",
    },
    defaultLevels: unilevelDefaultLevels,
  },
];

export function getAffiliateStructureTemplate(structureType: AffiliateStructureType) {
  return affiliateStructureTemplates.find((template) => template.structureType === structureType);
}

export function getAffiliateStructureTemplateByKey(key: string) {
  return affiliateStructureTemplates.find((template) => template.key === key);
}

export function calculateTemplateExample(template: AffiliateStructureTemplate, subtotalCents = 10_000) {
  const levelRows = template.defaultLevels
    .filter((level) => level.enabled)
    .map((level) => {
      const baseCents =
        level.commissionBase === "direct_commission"
          ? Math.floor(subtotalCents * 0.1)
          : level.commissionBase === "weaker_leg_volume" || level.commissionBase === "leg_volume"
            ? Math.floor(subtotalCents * 0.5)
            : subtotalCents;
      const amountCents = level.percentageBps ? Math.floor((baseCents * level.percentageBps) / 10000) : (level.fixedCents ?? 0);

      return {
        label: level.label,
        levelDepth: level.levelDepth,
        rate: level.percentageBps ? formatBpsAsPercent(level.percentageBps) : `$${((level.fixedCents ?? 0) / 100).toFixed(2)}`,
        amountCents,
      };
    });

  return {
    subtotalCents,
    maxPoolCents: Math.floor(subtotalCents * 0.2),
    totalCents: levelRows.reduce((sum, row) => sum + row.amountCents, 0),
    levelRows,
  };
}

export function getStructureEngineNotice(structureType: AffiliateStructureType) {
  if (structureType === "unilevel") {
    return "Unilevel purchase commissions are supported by the current closure-table commission engine.";
  }

  return `${structureType === "binary" ? "Binary" : "Matrix"} configuration is active for saved settings and preview. Payout execution requires final owner activation after placement and volume rules are reviewed.`;
}
