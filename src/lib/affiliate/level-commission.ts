import type {
  AffiliatePlanConfig,
  AffiliatePlanLevelInput,
  AffiliateProgramConfig,
  CommissionType,
  MultiLevelCommissionRuleInput,
} from "./types";

export const sevenLevelAmbassadorTemplate = [
  { depth: 0, label: "Direct referring affiliate", percentageBps: 1000 },
  { depth: 1, label: "Parent ambassador", percentageBps: 200 },
  { depth: 2, label: "Grandparent ambassador", percentageBps: 150 },
  { depth: 3, label: "Third-level ambassador", percentageBps: 100 },
  { depth: 4, label: "Fourth-level ambassador", percentageBps: 75 },
  { depth: 5, label: "Fifth-level ambassador", percentageBps: 50 },
  { depth: 6, label: "Sixth-level ambassador", percentageBps: 25 },
  { depth: 7, label: "Seventh-level ambassador", percentageBps: 25 },
];

export function getDirectPlanLevel(plan: AffiliatePlanConfig) {
  return plan.levels.find((level) => level.levelDepth === 0 && level.enabled);
}

export function mapPlanToProgramConfig({
  plan,
  fallbackProgram,
}: {
  plan: AffiliatePlanConfig;
  fallbackProgram: AffiliateProgramConfig;
}): AffiliateProgramConfig {
  const directLevel = getDirectPlanLevel(plan);

  return {
    ...fallbackProgram,
    id: plan.id,
    attributionModel: plan.attributionModel,
    cookieDays: plan.cookieDays,
    allowMultiLevel: plan.maxActiveLevels > 0,
    maxLevels: clampLevel(plan.maxActiveLevels),
    maxCommissionPoolBps: plan.maxCommissionPoolBps ?? fallbackProgram.maxCommissionPoolBps,
    defaultCommissionType: directLevel?.commissionType ?? fallbackProgram.defaultCommissionType,
    defaultCommissionValue: directLevel
      ? getDefaultCommissionValue(directLevel.commissionType, directLevel)
      : fallbackProgram.defaultCommissionValue,
    commissionBase: directLevel?.commissionBase ?? fallbackProgram.commissionBase,
    autoApproveCommissions: plan.autoApproveCommissions,
    holdDays: plan.holdDays,
    blockOwnReferrals: plan.blockOwnReferrals,
    blockSaleItems: plan.blockSaleItems,
  };
}

export function mapPlanLevelsToMultiLevelRules(plan: AffiliatePlanConfig): MultiLevelCommissionRuleInput[] {
  return plan.levels
    .filter((level) => level.enabled && level.levelDepth > 0 && level.levelDepth <= clampLevel(plan.maxActiveLevels))
    .map((level) => ({
      id: level.id,
      planLevelId: level.id,
      shopId: level.shopId,
      levelDepth: level.levelDepth,
      type: level.commissionType,
      percentageBps: level.percentageBps,
      fixedCents: level.fixedCents,
      commissionBase: level.commissionBase,
      maxPerOrderCents: level.maxPerOrderCents,
      maxPerMonthCents: level.maxPerMonthCents,
      active: true,
    }));
}

export function calculateLevelAmount({
  type,
  percentageBps,
  fixedCents,
  baseCents,
}: {
  type: CommissionType;
  percentageBps?: number;
  fixedCents?: number;
  baseCents: number;
}) {
  const percentageAmount = percentageBps ? Math.floor((baseCents * percentageBps) / 10000) : 0;

  if (type === "fixed") {
    return fixedCents ?? 0;
  }

  if (type === "percentage" || type === "store_credit") {
    return percentageAmount;
  }

  return percentageAmount + (fixedCents ?? 0);
}

function getDefaultCommissionValue(type: CommissionType, level: AffiliatePlanLevelInput) {
  return type === "fixed" ? level.fixedCents ?? 0 : level.percentageBps ?? 0;
}

function clampLevel(level: number) {
  return Math.max(0, Math.min(7, Math.floor(level)));
}
