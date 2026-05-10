import type { Affiliate, AffiliateProgram, CommissionRule, MultiLevelCommissionRule, Prisma } from "@prisma/client";
import { hasDatabaseUrl, getPrisma } from "@/lib/db/prisma";
import { calculateCommissionsForOrderInput } from "./commission-engine";
import type {
  AffiliateAncestor,
  AffiliateProgramConfig,
  AffiliateRecord,
  CommissionRuleInput,
  MultiLevelCommissionRuleInput,
  OrderForCommission,
} from "./types";

type OrderWithProducts = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

export async function calculateCommissionsForOrder(orderId: string) {
  if (!hasDatabaseUrl()) {
    return { created: false, reason: "DATABASE_URL is not configured." };
  }

  const prisma = getPrisma();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return { created: false, reason: "Order not found." };
  }

  const existing = await prisma.affiliateCommission.findFirst({ where: { orderId } });
  if (existing) {
    return { created: false, reason: "Commissions already calculated for this order.", idempotent: true };
  }

  const program = await prisma.affiliateProgram.findFirst({
    where: { shopId: order.shopId, status: "active" },
  });

  if (!program) {
    return { created: false, reason: "Affiliate program is not active for this shop." };
  }

  const directAffiliate = await resolveAttributedAffiliate(order);

  if (!directAffiliate) {
    return { created: false, reason: "No attributed affiliate found for order." };
  }

  const [ancestors, commissionRules, multiLevelRules] = await Promise.all([
    prisma.affiliateTreeClosure.findMany({
      where: {
        shopId: order.shopId,
        descendantAffiliateId: directAffiliate.id,
        depth: { gt: 0, lte: Math.min(program.maxLevels, 7) },
      },
      include: { ancestor: true },
      orderBy: { depth: "asc" },
    }),
    prisma.commissionRule.findMany({
      where: {
        shopId: order.shopId,
        affiliateProgramId: program.id,
        active: true,
      },
    }),
    prisma.multiLevelCommissionRule.findMany({
      where: {
        shopId: order.shopId,
        affiliateProgramId: program.id,
        active: true,
      },
    }),
  ]);

  const calculation = calculateCommissionsForOrderInput({
    order: mapOrder(order),
    program: mapProgram(program),
    directAffiliate: mapAffiliate(directAffiliate),
    ancestors: ancestors.map((ancestor): AffiliateAncestor => ({
      depth: ancestor.depth,
      affiliate: mapAffiliate(ancestor.ancestor),
    })),
    commissionRules: commissionRules.map(mapCommissionRule),
    multiLevelRules: multiLevelRules.map(mapMultiLevelRule),
  });

  if (!calculation.commissions.length) {
    return { created: false, reason: calculation.rejectedReasons.join("; ") || "No commission created." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.affiliateCommission.createMany({
      data: calculation.commissions.map((commission) => ({
        shopId: commission.shopId,
        affiliateId: commission.affiliateId,
        orderId: commission.orderId,
        orderItemId: commission.orderItemId,
        sourceAffiliateId: commission.sourceAffiliateId,
        type: commission.type,
        levelDepth: commission.levelDepth,
        status: commission.status,
        amountCents: commission.amountCents,
        currency: commission.currency,
        commissionBaseCents: commission.commissionBaseCents,
        ruleId: commission.ruleId,
        multiLevelRuleId: commission.multiLevelRuleId,
        reason: commission.reason,
        idempotencyKey: commission.idempotencyKey,
        availableAt: new Date(Date.now() + program.holdDays * 24 * 60 * 60 * 1000),
      })),
      skipDuplicates: true,
    });

    await tx.affiliateWalletLedger.createMany({
      data: calculation.walletLedgers.map((ledger) => ({
        shopId: ledger.shopId,
        affiliateId: ledger.affiliateId,
        type: ledger.type,
        amountCents: ledger.amountCents,
        currency: ledger.currency,
        balanceType: ledger.balanceType,
        note: ledger.note,
      })),
    });

    await tx.affiliateAuditLog.create({
      data: {
        shopId: order.shopId,
        affiliateId: directAffiliate.id,
        action: "calculate_commissions",
        entityType: "Order",
        entityId: order.id,
        after: {
          commissionCount: calculation.commissions.length,
          totalCents: calculation.commissions.reduce((total, item) => total + item.amountCents, 0),
        },
      },
    });
  });

  return { created: true, commissionCount: calculation.commissions.length };
}

async function resolveAttributedAffiliate(order: { shopId: string; metadata: unknown }) {
  const prisma = getPrisma();
  const metadata = order.metadata && typeof order.metadata === "object" ? (order.metadata as Record<string, unknown>) : {};
  const affiliateId = typeof metadata.affiliateId === "string" ? metadata.affiliateId : undefined;
  const referralCode = typeof metadata.referralCode === "string" ? metadata.referralCode : undefined;
  const sessionId = typeof metadata.sessionId === "string" ? metadata.sessionId : undefined;
  const visitorId = typeof metadata.visitorId === "string" ? metadata.visitorId : undefined;

  if (affiliateId) {
    return prisma.affiliate.findFirst({ where: { id: affiliateId, shopId: order.shopId, status: "approved" } });
  }

  if (referralCode) {
    return prisma.affiliate.findFirst({ where: { referralCode, shopId: order.shopId, status: "approved" } });
  }

  if (sessionId || visitorId) {
    const attribution = await prisma.affiliateAttribution.findFirst({
      where: {
        shopId: order.shopId,
        expiresAt: { gt: new Date() },
        OR: [{ sessionId: sessionId ?? "" }, { visitorId: visitorId ?? "" }],
      },
      orderBy: { updatedAt: "desc" },
      include: { affiliate: true },
    });

    return attribution?.affiliate ?? null;
  }

  return null;
}

function mapOrder(order: OrderWithProducts): OrderForCommission {
  return {
    id: order.id,
    shopId: order.shopId,
    orderNumber: order.orderNumber,
    customerId: order.customerId ?? undefined,
    customerEmail: order.customerEmail ?? undefined,
    subtotalCents: order.subtotalCents,
    totalCents: order.totalCents,
    currency: order.currency,
    status: order.status,
    paymentStatus: order.paymentStatus,
    items: order.items.map((item) => {
      const metadata = toRecord(item.metadata);
      return {
        id: item.id,
        productId: item.productId,
        categoryIds: Array.isArray(metadata.categoryIds) ? metadata.categoryIds : undefined,
        collectionIds: Array.isArray(metadata.collectionIds) ? metadata.collectionIds : undefined,
        campaignId: typeof metadata.campaignId === "string" ? metadata.campaignId : undefined,
        productType: item.product.productType,
        subtotalCents: item.totalCents,
        isSaleItem: Boolean(item.product.compareAtPriceCents && item.product.compareAtPriceCents > item.product.priceCents),
      };
    }),
  };
}

function mapProgram(program: AffiliateProgram): AffiliateProgramConfig {
  return {
    id: program.id,
    shopId: program.shopId,
    attributionModel: program.attributionModel,
    cookieDays: program.cookieDays,
    allowMultiLevel: program.allowMultiLevel,
    maxLevels: program.maxLevels,
    maxCommissionPoolBps: program.maxCommissionPoolBps,
    defaultCommissionType: program.defaultCommissionType,
    defaultCommissionValue: program.defaultCommissionValue,
    commissionBase: program.commissionBase,
    autoApproveCommissions: program.autoApproveCommissions,
    holdDays: program.holdDays,
    blockOwnReferrals: program.blockOwnReferrals,
    blockSaleItems: program.blockSaleItems,
    minPayoutCents: program.minPayoutCents,
    maxPayoutCents: program.maxPayoutCents ?? undefined,
    withdrawalFeeCents: program.withdrawalFeeCents,
  };
}

function mapAffiliate(affiliate: Affiliate): AffiliateRecord {
  return {
    id: affiliate.id,
    shopId: affiliate.shopId,
    email: affiliate.email,
    customerId: affiliate.customerId ?? undefined,
    referralCode: affiliate.referralCode,
    status: affiliate.status,
    parentAffiliateId: affiliate.parentAffiliateId ?? undefined,
    rankId: affiliate.rankId ?? undefined,
  };
}

function mapCommissionRule(rule: CommissionRule): CommissionRuleInput {
  return {
    id: rule.id,
    shopId: rule.shopId,
    scope: rule.scope,
    affiliateId: rule.affiliateId ?? undefined,
    productId: rule.productId ?? undefined,
    categoryId: rule.categoryId ?? undefined,
    collectionId: rule.collectionId ?? undefined,
    campaignId: rule.campaignId ?? undefined,
    type: rule.type,
    percentageBps: rule.percentageBps ?? undefined,
    fixedCents: rule.fixedCents ?? undefined,
    priority: rule.priority,
    active: rule.active,
  };
}

function mapMultiLevelRule(rule: MultiLevelCommissionRule): MultiLevelCommissionRuleInput {
  return {
    id: rule.id,
    shopId: rule.shopId,
    levelDepth: rule.levelDepth,
    type: rule.type,
    percentageBps: rule.percentageBps ?? undefined,
    fixedCents: rule.fixedCents ?? undefined,
    commissionBase: rule.commissionBase,
    maxPerOrderCents: rule.maxPerOrderCents ?? undefined,
    maxPerMonthCents: rule.maxPerMonthCents ?? undefined,
    active: rule.active,
  };
}

function toRecord(value: Prisma.JsonValue | null): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
