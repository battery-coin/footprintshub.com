import type { AffiliatePlanConfig, AffiliatePlanType } from "./types";

export type PlanResolutionContext = {
  shopId: string;
  affiliateActivePlanId?: string;
  campaignPlanId?: string;
  creatorShopPlanId?: string;
  preferredPlanType?: AffiliatePlanType;
};

export type PlanResolutionResult = {
  plan?: AffiliatePlanConfig;
  source: "affiliate_override" | "campaign_override" | "creator_shop_override" | "plan_type" | "shop_default" | "none";
  reason: string;
};

export function resolveAffiliatePlan(
  plans: AffiliatePlanConfig[],
  context: PlanResolutionContext,
): PlanResolutionResult {
  const activePlans = plans.filter((plan) => plan.shopId === context.shopId);

  const affiliatePlan = findById(activePlans, context.affiliateActivePlanId);
  if (affiliatePlan) {
    return {
      plan: affiliatePlan,
      source: "affiliate_override",
      reason: "Affiliate-specific active plan selected.",
    };
  }

  const campaignPlan = findById(activePlans, context.campaignPlanId);
  if (campaignPlan) {
    return {
      plan: campaignPlan,
      source: "campaign_override",
      reason: "Campaign-specific plan selected.",
    };
  }

  const creatorShopPlan = findById(activePlans, context.creatorShopPlanId);
  if (creatorShopPlan) {
    return {
      plan: creatorShopPlan,
      source: "creator_shop_override",
      reason: "Creator shop plan selected.",
    };
  }

  if (context.preferredPlanType) {
    const typedPlan = activePlans.find((plan) => plan.planType === context.preferredPlanType);
    if (typedPlan) {
      return {
        plan: typedPlan,
        source: "plan_type",
        reason: "Preferred business model plan selected.",
      };
    }
  }

  const defaultPlan = activePlans.find((plan) => plan.isDefault) ?? activePlans[0];
  if (defaultPlan) {
    return {
      plan: defaultPlan,
      source: "shop_default",
      reason: "Shop default affiliate plan selected.",
    };
  }

  return { source: "none", reason: "No active affiliate plan is available for this shop." };
}

function findById(plans: AffiliatePlanConfig[], id?: string) {
  return id ? plans.find((plan) => plan.id === id) : undefined;
}
