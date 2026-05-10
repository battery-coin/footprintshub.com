import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateLifetimeAttributionExpiry, shouldUseLifetimeAttribution } from "./attribution";
import { applyMaxCommissionPool } from "./commission-caps";
import { resolveQualifiedAncestors } from "./compression";
import { calculateLevelAmount, mapPlanLevelsToMultiLevelRules } from "./level-commission";
import { resolvePerformanceTier } from "./performance-tiers";
import { resolveAffiliatePlan } from "./plan-resolver";
import { calculateAffiliateQualification } from "./rank-qualification";
import { calculateRefundReversal } from "./refund-reversal";
import type {
  AffiliateCommissionDraft,
  AffiliatePlanConfig,
  AffiliateRankInput,
  AffiliateRecord,
  AffiliateQualificationSnapshotInput,
} from "./types";

const plan: AffiliatePlanConfig = {
  id: "plan_7",
  shopId: "shop_1",
  name: "7-Level Ambassador",
  planType: "seven_level",
  isDefault: true,
  currency: "USD",
  maxActiveLevels: 7,
  maxCommissionPoolBps: 2000,
  allowLifetimeAttribution: true,
  attributionModel: "coupon_priority",
  cookieDays: 30,
  holdDays: 14,
  autoApproveCommissions: false,
  blockOwnReferrals: true,
  blockSaleItems: false,
  allowStoreCreditPayout: true,
  allowCashPayout: false,
  levels: [
    level(0, 1000),
    level(1, 200),
    level(2, 150),
    level(3, 100),
    level(4, 75),
    level(5, 50),
    level(6, 25),
    level(7, 25),
  ],
};

describe("affiliate business model foundations", () => {
  it("resolves affiliate-specific plan before shop default", () => {
    const customPlan = { ...plan, id: "custom_plan", isDefault: false, planType: "hybrid" as const };
    const result = resolveAffiliatePlan([plan, customPlan], {
      shopId: "shop_1",
      affiliateActivePlanId: "custom_plan",
    });

    assert.equal(result.plan?.id, "custom_plan");
    assert.equal(result.source, "affiliate_override");
  });

  it("maps configured levels 1 through 7 to commission rules", () => {
    const rules = mapPlanLevelsToMultiLevelRules(plan);

    assert.equal(rules.length, 7);
    assert.equal(rules[0].levelDepth, 1);
    assert.equal(rules[6].levelDepth, 7);
    assert.equal(rules[1].percentageBps, 150);
  });

  it("calculates store-credit commission like percentage money", () => {
    const amount = calculateLevelAmount({ type: "store_credit", percentageBps: 1000, baseCents: 5000 });
    assert.equal(amount, 500);
  });

  it("enforces the max commission pool cap", () => {
    const capped = applyMaxCommissionPool({
      subtotalCents: 10000,
      maxPoolBps: 2000,
      commissions: [commission("direct", 1500, 0), commission("parent", 800, 1)],
    });

    assert.equal(capped.reduce((total, item) => total + item.amountCents, 0), 2000);
    assert.equal(capped[1].status, "capped");
  });

  it("compresses skipped level to next qualified ancestor when configured", () => {
    const levels = [
      { ...level(1, 200), requiresRankId: "rank_founder", compressionBehavior: "compress_to_next_qualified" as const },
      { ...level(2, 150), requiresRankId: "rank_founder", compressionBehavior: "compress_to_next_qualified" as const },
    ];
    const ancestors = [ancestor("parent", 1), ancestor("grandparent", 2)];

    const qualified = resolveQualifiedAncestors({
      ancestors,
      levels,
      affiliateRanks: { parent: "rank_bronze", grandparent: "rank_founder" },
    });

    assert.equal(qualified.length, 1);
    assert.equal(qualified[0].affiliate.id, "grandparent");
    assert.deepEqual(qualified[0].skippedAffiliateIds, ["parent"]);
  });

  it("calculates rank max paid levels from qualification metrics", () => {
    const ranks: AffiliateRankInput[] = [
      rank("bronze", "Bronze", 10, 0, 0),
      rank("founder", "Founder Ambassador", 50, 7, 100000),
    ];

    const result = calculateAffiliateQualification({
      ranks,
      metrics: metrics({ monthlySalesCents: 150000 }),
    });

    assert.equal(result.calculatedRankId, "founder");
    assert.equal(result.maxPaidLevels, 7);
  });

  it("resolves monthly sales performance tier", () => {
    const tier = resolvePerformanceTier({
      tiers: [
        {
          id: "tier_1",
          shopId: "shop_1",
          affiliatePlanId: "plan_7",
          name: "Starter",
          priority: 10,
          metric: "monthly_sales",
          minValue: 0,
          maxValue: 99999,
          directCommissionBps: 800,
          active: true,
        },
        {
          id: "tier_2",
          shopId: "shop_1",
          affiliatePlanId: "plan_7",
          name: "Builder",
          priority: 20,
          metric: "monthly_sales",
          minValue: 100000,
          directCommissionBps: 1000,
          active: true,
        },
      ],
      metrics: metrics({ monthlySalesCents: 125000 }),
    });

    assert.equal(tier?.id, "tier_2");
  });

  it("supports optional lifetime attribution expiry", () => {
    const startsAt = new Date("2026-01-01T00:00:00.000Z");
    const expiresAt = calculateLifetimeAttributionExpiry({ startsAt, lifetimeAttributionDays: 30 });

    assert.equal(expiresAt?.toISOString(), "2026-01-31T00:00:00.000Z");
    assert.equal(
      shouldUseLifetimeAttribution({
        enabled: true,
        attributionExpired: false,
        couponOverride: true,
        hasCouponAttribution: true,
      }),
      false,
    );
  });

  it("reverses commissions proportionally for partial refunds", () => {
    const reversals = calculateRefundReversal({
      commissions: [commission("direct", 1000, 0), commission("parent", 200, 1)],
      refundAmountCents: 5000,
      originalOrderTotalCents: 10000,
    });

    assert.equal(reversals[0].ledger.amountCents, -500);
    assert.equal(reversals[0].commission.status, "partially_reversed");
    assert.equal(reversals[1].ledger.amountCents, -100);
  });
});

function level(levelDepth: number, percentageBps: number) {
  return {
    id: `level_${levelDepth}`,
    shopId: "shop_1",
    affiliatePlanId: "plan_7",
    levelDepth,
    label: `Level ${levelDepth}`,
    enabled: true,
    commissionType: "percentage" as const,
    percentageBps,
    commissionBase: "product_subtotal" as const,
    compressionBehavior: "pay_zero" as const,
  };
}

function ancestor(id: string, depth: number) {
  return {
    depth,
    affiliate: {
      id,
      shopId: "shop_1",
      email: `${id}@example.com`,
      referralCode: id.toUpperCase(),
      status: "approved" as const,
    } satisfies AffiliateRecord,
  };
}

function commission(affiliateId: string, amountCents: number, levelDepth: number): AffiliateCommissionDraft {
  return {
    idempotencyKey: `commission:order_1:${affiliateId}:${levelDepth}`,
    shopId: "shop_1",
    affiliateId,
    orderId: "order_1",
    type: levelDepth === 0 ? "direct" : "multi_level",
    levelDepth,
    status: "pending",
    amountCents,
    currency: "USD",
    commissionBaseCents: 10000,
  };
}

function rank(id: string, name: string, priority: number, maxPaidLevels: number, monthlySalesRequiredCents: number) {
  return {
    id,
    shopId: "shop_1",
    name,
    priority,
    maxPaidLevels,
    monthlySalesRequiredCents,
    active: true,
  };
}

function metrics(
  overrides: Partial<AffiliateQualificationSnapshotInput> = {},
): AffiliateQualificationSnapshotInput {
  return {
    affiliateId: "aff_1",
    monthlySalesCents: 0,
    monthlyOrderCount: 0,
    directReferralCount: 0,
    qualifiedOrderCount: 0,
    approvedCommissionCents: 0,
    maxPaidLevels: 0,
    ...overrides,
  };
}
