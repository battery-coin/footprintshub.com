import type { Prisma } from "@prisma/client";
import { hasDatabaseUrl, getPrisma } from "@/lib/db/prisma";
import {
  affiliateStructureTemplates,
  calculateTemplateExample,
  getAffiliateStructureTemplate,
  getAffiliateStructureTemplateByKey,
  getStructureEngineNotice,
  type AffiliateStructureTemplate,
  type StructureLevelTemplate,
} from "./structure-templates";
import type { AffiliateStructureType } from "./types";

export type AdminAffiliatePlanView = {
  id: string;
  shopId: string;
  name: string;
  description?: string | null;
  status: "draft" | "active" | "archived";
  structureType: AffiliateStructureType;
  planType: string;
  isDefault: boolean;
  maxActiveLevels: number;
  maxCommissionPoolBps?: number | null;
  holdDays: number;
  cookieDays: number;
  engineStatus: "functional" | "scaffolded";
  levels: StructureLevelTemplate[];
  template: AffiliateStructureTemplate;
};

export function getFallbackPlan(structureType: AffiliateStructureType = "unilevel", id = "footprintshub-7-level"): AdminAffiliatePlanView {
  const template = getAffiliateStructureTemplate(structureType) ?? affiliateStructureTemplates[2];

  return {
    id,
    shopId: "seed_shop_footprintshub",
    name: structureType === "unilevel" ? "FootprintsHub Unilevel Ambassador Plan" : `${template.name} Draft`,
    description: template.description,
    status: structureType === "unilevel" ? "active" : "draft",
    structureType,
    planType: structureType === "unilevel" ? "seven_level" : "hybrid",
    isDefault: structureType === "unilevel",
    maxActiveLevels: structureType === "binary" ? 2 : 7,
    maxCommissionPoolBps: 2000,
    holdDays: 14,
    cookieDays: 30,
    engineStatus: template.engineStatus,
    levels: template.defaultLevels,
    template,
  };
}

export async function listAdminAffiliatePlans(): Promise<AdminAffiliatePlanView[]> {
  if (!hasDatabaseUrl()) {
    return affiliateStructureTemplates.map((template) => getFallbackPlan(template.structureType, `${template.structureType}-template`));
  }

  try {
    const plans = await getPrisma().affiliatePlan.findMany({
      include: { levels: { orderBy: [{ sortOrder: "asc" }, { levelDepth: "asc" }] } },
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
      take: 50,
    });

    if (!plans.length) {
      return [getFallbackPlan()];
    }

    return plans.map(mapPlan);
  } catch {
    return [getFallbackPlan()];
  }
}

export async function getAdminAffiliatePlan(id: string): Promise<AdminAffiliatePlanView | null> {
  if (!hasDatabaseUrl()) {
    if (id.includes("binary")) return getFallbackPlan("binary", id);
    if (id.includes("matrix")) return getFallbackPlan("matrix", id);
    return getFallbackPlan("unilevel", id);
  }

  try {
    const plan = await getPrisma().affiliatePlan.findUnique({
      where: { id },
      include: { levels: { orderBy: [{ sortOrder: "asc" }, { levelDepth: "asc" }] } },
    });

    return plan ? mapPlan(plan) : null;
  } catch {
    return getFallbackPlan("unilevel", id);
  }
}

export async function createPlanFromTemplate(templateKey: string) {
  const template = getAffiliateStructureTemplateByKey(templateKey);

  if (!template) {
    return { ok: false as const, status: 404, error: "Structure template not found." };
  }

  if (!hasDatabaseUrl()) {
    return {
      ok: true as const,
      stored: false,
      planId: `${template.structureType}-draft`,
      redirectTo: getPlanSetupPath(`${template.structureType}-draft`, template.structureType),
      message: "DATABASE_URL is not configured, so the template was previewed without persistence.",
    };
  }

  const prisma = getPrisma();
  const shop = await prisma.shop.findFirst({ where: { status: "active" }, orderBy: { createdAt: "asc" } });

  if (!shop) {
    return { ok: false as const, status: 409, error: "Create or seed a shop before creating affiliate plans." };
  }

  const program =
    (await prisma.affiliateProgram.findFirst({ where: { shopId: shop.id }, orderBy: { createdAt: "asc" } })) ??
    (await prisma.affiliateProgram.create({
      data: {
        shopId: shop.id,
        name: "FootprintsHub Ambassador Program",
        status: "active",
        defaultPlanType: template.structureType,
      },
    }));

  const plan = await prisma.$transaction(async (tx) => {
    const created = await tx.affiliatePlan.create({
      data: {
        shopId: shop.id,
        affiliateProgramId: program.id,
        name: template.name,
        description: `${template.description} ${getStructureEngineNotice(template.structureType)}`,
        status: "draft",
        planType: template.structureType === "unilevel" ? "seven_level" : "hybrid",
        structureType: template.structureType,
        isDefault: false,
        maxActiveLevels: template.structureType === "binary" ? 2 : 7,
        maxCommissionPoolBps: 2000,
        levels: {
          create: template.defaultLevels.map((level) => ({
            shopId: shop.id,
            levelDepth: level.levelDepth,
            label: level.label,
            enabled: level.enabled,
            structureType: template.structureType,
            commissionType: level.commissionType,
            percentageBps: level.percentageBps,
            fixedCents: level.fixedCents,
            commissionBase: level.commissionBase,
            maxPerOrderCents: level.maxPerOrderCents,
            maxPerMonthCents: level.maxPerMonthCents,
            sortOrder: level.sortOrder,
          })),
        },
      },
    });

    await createStructureConfig({ tx, planId: created.id, shopId: shop.id, template });

    await tx.affiliateAuditLog.create({
      data: {
        shopId: shop.id,
        action: "affiliate_plan_created_from_template",
        entityType: "AffiliatePlan",
        entityId: created.id,
        after: { templateKey, structureType: template.structureType },
      },
    });

    return created;
  });

  return { ok: true as const, stored: true, planId: plan.id, redirectTo: getPlanSetupPath(plan.id, template.structureType) };
}

export function getPlanSetupPath(planId: string, structureType: AffiliateStructureType) {
  if (structureType === "binary") return `/admin/affiliates/plans/${planId}/binary`;
  if (structureType === "matrix") return `/admin/affiliates/plans/${planId}/matrix`;
  return `/admin/affiliates/plans/${planId}/levels`;
}

export async function updatePlanLevels(planId: string, levels: StructureLevelTemplate[]) {
  if (!hasDatabaseUrl()) {
    return { ok: true as const, stored: false };
  }

  const prisma = getPrisma();
  const plan = await prisma.affiliatePlan.findUnique({ where: { id: planId } });

  if (!plan) {
    return { ok: false as const, status: 404, error: "Affiliate plan not found." };
  }

  await prisma.$transaction(
    levels.map((level) =>
      prisma.affiliatePlanLevel.upsert({
        where: { affiliatePlanId_levelDepth: { affiliatePlanId: plan.id, levelDepth: level.levelDepth } },
        update: {
          label: level.label,
          enabled: level.enabled,
          structureType: plan.structureType,
          commissionType: level.commissionType,
          percentageBps: level.percentageBps,
          fixedCents: level.fixedCents,
          commissionBase: level.commissionBase,
          maxPerOrderCents: level.maxPerOrderCents,
          maxPerMonthCents: level.maxPerMonthCents,
          sortOrder: level.sortOrder,
        },
        create: {
          shopId: plan.shopId,
          affiliatePlanId: plan.id,
          levelDepth: level.levelDepth,
          label: level.label,
          enabled: level.enabled,
          structureType: plan.structureType,
          commissionType: level.commissionType,
          percentageBps: level.percentageBps,
          fixedCents: level.fixedCents,
          commissionBase: level.commissionBase,
          maxPerOrderCents: level.maxPerOrderCents,
          maxPerMonthCents: level.maxPerMonthCents,
          sortOrder: level.sortOrder,
        },
      }),
    ),
  );

  await prisma.affiliateAuditLog.create({
    data: {
      shopId: plan.shopId,
      action: "affiliate_plan_levels_updated",
      entityType: "AffiliatePlan",
      entityId: plan.id,
      after: { levelCount: levels.length },
    },
  });

  return { ok: true as const, stored: true };
}

export async function activatePlan(planId: string) {
  if (!hasDatabaseUrl()) {
    return { ok: true as const, stored: false };
  }

  const prisma = getPrisma();
  const plan = await prisma.affiliatePlan.findUnique({ where: { id: planId } });

  if (!plan) {
    return { ok: false as const, status: 404, error: "Affiliate plan not found." };
  }

  await prisma.$transaction([
    prisma.affiliatePlan.updateMany({
      where: { shopId: plan.shopId, id: { not: plan.id }, status: "active" },
      data: { status: "draft", isDefault: false },
    }),
    prisma.affiliatePlan.update({
      where: { id: plan.id },
      data: { status: "active", isDefault: true },
    }),
    prisma.affiliateProgram.updateMany({
      where: { shopId: plan.shopId },
      data: { activePlanId: plan.id, defaultPlanType: plan.structureType },
    }),
  ]);

  return { ok: true as const, stored: true };
}

export async function duplicatePlan(planId: string) {
  const source = await getAdminAffiliatePlan(planId);

  if (!source) {
    return { ok: false as const, status: 404, error: "Affiliate plan not found." };
  }

  if (!hasDatabaseUrl()) {
    return { ok: true as const, stored: false, planId: `${source.id}-copy` };
  }

  const prisma = getPrisma();
  const sourcePlan = await prisma.affiliatePlan.findUnique({
    where: { id: planId },
    include: {
      levels: { orderBy: [{ sortOrder: "asc" }, { levelDepth: "asc" }] },
      binaryConfig: true,
      matrixConfig: true,
      unilevelConfig: true,
    },
  });

  if (!sourcePlan) {
    return { ok: false as const, status: 404, error: "Affiliate plan not found." };
  }

  const created = await prisma.$transaction(async (tx) => {
    const createdPlan = await tx.affiliatePlan.create({
      data: {
        shopId: sourcePlan.shopId,
        affiliateProgramId: sourcePlan.affiliateProgramId,
        name: `${sourcePlan.name} Copy`,
        description: sourcePlan.description,
        status: "draft",
        planType: sourcePlan.planType,
        structureType: sourcePlan.structureType,
        isDefault: false,
        currency: sourcePlan.currency,
        maxActiveLevels: sourcePlan.maxActiveLevels,
        maxCommissionPoolBps: sourcePlan.maxCommissionPoolBps,
        maxCommissionPoolCents: sourcePlan.maxCommissionPoolCents,
        allowLifetimeAttribution: sourcePlan.allowLifetimeAttribution,
        lifetimeAttributionDays: sourcePlan.lifetimeAttributionDays,
        attributionModel: sourcePlan.attributionModel,
        cookieDays: sourcePlan.cookieDays,
        holdDays: sourcePlan.holdDays,
        autoApproveCommissions: sourcePlan.autoApproveCommissions,
        blockOwnReferrals: sourcePlan.blockOwnReferrals,
        blockSaleItems: sourcePlan.blockSaleItems,
        allowStoreCreditPayout: sourcePlan.allowStoreCreditPayout,
        allowCashPayout: sourcePlan.allowCashPayout,
      },
    });

    if (sourcePlan.levels.length) {
      await tx.affiliatePlanLevel.createMany({
        data: sourcePlan.levels.map((level) => ({
          shopId: sourcePlan.shopId,
          affiliatePlanId: createdPlan.id,
          levelDepth: level.levelDepth,
          label: level.label,
          enabled: level.enabled,
          structureType: level.structureType,
          commissionType: level.commissionType,
          percentageBps: level.percentageBps,
          fixedCents: level.fixedCents,
          commissionBase: level.commissionBase,
          maxPerOrderCents: level.maxPerOrderCents,
          maxPerMonthCents: level.maxPerMonthCents,
          requiresRankId: level.requiresRankId,
          sortOrder: level.sortOrder,
          compressionBehavior: level.compressionBehavior,
        })),
      });
    }

    if (sourcePlan.binaryConfig) {
      await tx.binaryPlanConfig.create({
        data: {
          shopId: sourcePlan.shopId,
          affiliatePlanId: createdPlan.id,
          leftLabel: sourcePlan.binaryConfig.leftLabel,
          rightLabel: sourcePlan.binaryConfig.rightLabel,
          payoutBasis: sourcePlan.binaryConfig.payoutBasis,
          pairRatioLeft: sourcePlan.binaryConfig.pairRatioLeft,
          pairRatioRight: sourcePlan.binaryConfig.pairRatioRight,
          pairCommissionType: sourcePlan.binaryConfig.pairCommissionType,
          pairCommissionBps: sourcePlan.binaryConfig.pairCommissionBps,
          pairFixedCents: sourcePlan.binaryConfig.pairFixedCents,
          spilloverMode: sourcePlan.binaryConfig.spilloverMode,
          carryForwardVolume: sourcePlan.binaryConfig.carryForwardVolume,
          flushAfterPayout: sourcePlan.binaryConfig.flushAfterPayout,
          maxPairsPerPeriod: sourcePlan.binaryConfig.maxPairsPerPeriod,
        },
      });
    }

    if (sourcePlan.matrixConfig) {
      await tx.matrixPlanConfig.create({
        data: {
          shopId: sourcePlan.shopId,
          affiliatePlanId: createdPlan.id,
          width: sourcePlan.matrixConfig.width,
          depth: sourcePlan.matrixConfig.depth,
          spilloverMode: sourcePlan.matrixConfig.spilloverMode,
          completionBonusEnabled: sourcePlan.matrixConfig.completionBonusEnabled,
          completionBonusCents: sourcePlan.matrixConfig.completionBonusCents,
          levelCommissionMode: sourcePlan.matrixConfig.levelCommissionMode,
        },
      });
    }

    if (sourcePlan.unilevelConfig) {
      await tx.unilevelPlanConfig.create({
        data: {
          shopId: sourcePlan.shopId,
          affiliatePlanId: createdPlan.id,
          unlimitedFrontline: sourcePlan.unilevelConfig.unlimitedFrontline,
          maxDepth: sourcePlan.unilevelConfig.maxDepth,
          compressionBehavior: sourcePlan.unilevelConfig.compressionBehavior,
        },
      });
    }

    return createdPlan;
  });

  return { ok: true as const, stored: true, planId: created.id };
}

export async function updateStructureConfig(planId: string, structureType: AffiliateStructureType, payload: Record<string, unknown>) {
  if (!hasDatabaseUrl()) {
    return { ok: true as const, stored: false };
  }

  const prisma = getPrisma();
  const plan = await prisma.affiliatePlan.findUnique({ where: { id: planId } });

  if (!plan) {
    return { ok: false as const, status: 404, error: "Affiliate plan not found." };
  }

  if (structureType === "binary") {
    await prisma.binaryPlanConfig.upsert({
      where: { affiliatePlanId: plan.id },
      update: normalizeBinaryConfig(payload),
      create: { shopId: plan.shopId, affiliatePlanId: plan.id, ...normalizeBinaryConfig(payload) },
    });
  }

  if (structureType === "matrix") {
    await prisma.matrixPlanConfig.upsert({
      where: { affiliatePlanId: plan.id },
      update: normalizeMatrixConfig(payload),
      create: { shopId: plan.shopId, affiliatePlanId: plan.id, ...normalizeMatrixConfig(payload) },
    });
  }

  if (structureType === "unilevel") {
    await prisma.unilevelPlanConfig.upsert({
      where: { affiliatePlanId: plan.id },
      update: normalizeUnilevelConfig(payload),
      create: { shopId: plan.shopId, affiliatePlanId: plan.id, ...normalizeUnilevelConfig(payload) },
    });
  }

  return { ok: true as const, stored: true };
}

export function previewPlan(plan: AdminAffiliatePlanView, subtotalCents = 10_000) {
  return calculateTemplateExample({ ...plan.template, defaultLevels: plan.levels }, subtotalCents);
}

async function createStructureConfig({
  tx,
  planId,
  shopId,
  template,
}: {
  tx?: Prisma.TransactionClient;
  planId: string;
  shopId: string;
  template: AffiliateStructureTemplate;
}) {
  const prisma = tx ?? getPrisma();

  if (template.structureType === "binary") {
    const config = template.defaultConfig as Prisma.BinaryPlanConfigUncheckedCreateInput;
    await prisma.binaryPlanConfig.create({ data: { ...config, shopId, affiliatePlanId: planId } });
  }

  if (template.structureType === "matrix") {
    const config = template.defaultConfig as Prisma.MatrixPlanConfigUncheckedCreateInput;
    await prisma.matrixPlanConfig.create({ data: { ...config, shopId, affiliatePlanId: planId } });
  }

  if (template.structureType === "unilevel") {
    const config = template.defaultConfig as Prisma.UnilevelPlanConfigUncheckedCreateInput;
    await prisma.unilevelPlanConfig.create({ data: { ...config, shopId, affiliatePlanId: planId } });
  }
}

function mapPlan(plan: Prisma.AffiliatePlanGetPayload<{ include: { levels: true } }>): AdminAffiliatePlanView {
  const structureType = plan.structureType;
  const template = getAffiliateStructureTemplate(structureType) ?? getAffiliateStructureTemplate("unilevel")!;
  const levels = plan.levels.length
    ? plan.levels.map((level) => ({
        levelDepth: level.levelDepth,
        label: level.label,
        enabled: level.enabled,
        commissionType: level.commissionType,
        percentageBps: level.percentageBps ?? undefined,
        fixedCents: level.fixedCents ?? undefined,
        commissionBase: level.commissionBase,
        maxPerOrderCents: level.maxPerOrderCents ?? undefined,
        maxPerMonthCents: level.maxPerMonthCents ?? undefined,
        sortOrder: level.sortOrder,
      }))
    : template.defaultLevels;

  return {
    id: plan.id,
    shopId: plan.shopId,
    name: plan.name,
    description: plan.description,
    status: plan.status,
    structureType,
    planType: plan.planType,
    isDefault: plan.isDefault,
    maxActiveLevels: plan.maxActiveLevels,
    maxCommissionPoolBps: plan.maxCommissionPoolBps,
    holdDays: plan.holdDays,
    cookieDays: plan.cookieDays,
    engineStatus: template.engineStatus,
    levels,
    template,
  };
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function int(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.floor(parsed) : fallback;
}

function bool(value: unknown) {
  return value === true || value === "true" || value === "on";
}

function normalizeBinaryConfig(payload: Record<string, unknown>) {
  return {
    leftLabel: text(payload.leftLabel, "Left Team"),
    rightLabel: text(payload.rightLabel, "Right Team"),
    payoutBasis: text(payload.payoutBasis, "weaker_leg_volume") as Prisma.BinaryPlanConfigCreateInput["payoutBasis"],
    pairRatioLeft: int(payload.pairRatioLeft, 1),
    pairRatioRight: int(payload.pairRatioRight, 1),
    pairCommissionType: "percentage" as const,
    pairCommissionBps: int(payload.pairCommissionBps, 1000),
    spilloverMode: text(payload.spilloverMode, "weaker_leg") as Prisma.BinaryPlanConfigCreateInput["spilloverMode"],
    carryForwardVolume: bool(payload.carryForwardVolume),
    flushAfterPayout: bool(payload.flushAfterPayout),
  };
}

function normalizeMatrixConfig(payload: Record<string, unknown>) {
  return {
    width: Math.max(1, Math.min(10, int(payload.width, 3))),
    depth: Math.max(1, Math.min(10, int(payload.depth, 7))),
    spilloverMode: text(payload.spilloverMode, "breadth_first") as Prisma.MatrixPlanConfigCreateInput["spilloverMode"],
    completionBonusEnabled: bool(payload.completionBonusEnabled),
    completionBonusCents: int(payload.completionBonusCents, 0),
    levelCommissionMode: text(payload.levelCommissionMode, "per_level_percentage") as Prisma.MatrixPlanConfigCreateInput["levelCommissionMode"],
  };
}

function normalizeUnilevelConfig(payload: Record<string, unknown>) {
  return {
    unlimitedFrontline: bool(payload.unlimitedFrontline),
    maxDepth: Math.max(1, Math.min(7, int(payload.maxDepth, 7))),
    compressionBehavior: text(payload.compressionBehavior, "pay_zero") as Prisma.UnilevelPlanConfigCreateInput["compressionBehavior"],
  };
}
