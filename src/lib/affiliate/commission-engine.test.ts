import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateCommissionsForOrderInput,
  calculateDirectCommission,
  createRefundReversalLedgers,
  resolveBestCommissionRule,
  validatePayoutRequest,
} from "./commission-engine";
import { calculateWalletBalances } from "./wallet";
import type {
  AffiliateProgramConfig,
  AffiliateRecord,
  CommissionRuleInput,
  MultiLevelCommissionRuleInput,
  OrderForCommission,
  WalletLedgerDraft,
} from "./types";

const program: AffiliateProgramConfig = {
  id: "program_1",
  shopId: "shop_1",
  attributionModel: "last_touch",
  cookieDays: 30,
  allowMultiLevel: true,
  maxLevels: 7,
  maxCommissionPoolBps: 2000,
  defaultCommissionType: "percentage",
  defaultCommissionValue: 1000,
  commissionBase: "product_subtotal",
  autoApproveCommissions: false,
  holdDays: 30,
  blockOwnReferrals: true,
  blockSaleItems: false,
  minPayoutCents: 5000,
  withdrawalFeeCents: 250,
};

const affiliate: AffiliateRecord = {
  id: "aff_1",
  shopId: "shop_1",
  email: "partner@example.com",
  referralCode: "PARTNER",
  status: "approved",
};

const order: OrderForCommission = {
  id: "order_1",
  shopId: "shop_1",
  customerEmail: "buyer@example.com",
  subtotalCents: 10000,
  totalCents: 10000,
  currency: "USD",
  status: "paid",
  paymentStatus: "paid",
  items: [
    {
      id: "item_1",
      productId: "prod_1",
      categoryIds: ["cat_1"],
      collectionIds: ["col_1"],
      subtotalCents: 10000,
    },
  ],
};

describe("affiliate commission engine", () => {
  it("calculates direct percentage commission", () => {
    const result = calculateCommissionsForOrderInput({ order, program, directAffiliate: affiliate });

    assert.equal(result.commissions[0].amountCents, 1000);
    assert.equal(result.commissions[0].type, "direct");
  });

  it("calculates direct fixed commission", () => {
    const direct = calculateDirectCommission(
      order,
      affiliate,
      { ...program, defaultCommissionType: "fixed", defaultCommissionValue: 750 },
      [],
    );

    assert.equal(direct.amountCents, 750);
  });

  it("uses product override before shop default", () => {
    const rules: CommissionRuleInput[] = [
      rule({ id: "global", scope: "global", percentageBps: 500 }),
      rule({ id: "product", scope: "product", productId: "prod_1", percentageBps: 2000 }),
    ];

    const best = resolveBestCommissionRule(rules, affiliate.id, order.items[0]);
    assert.equal(best?.id, "product");

    const direct = calculateDirectCommission(order, affiliate, program, rules);
    assert.equal(direct.amountCents, 2000);
  });

  it("uses category override before campaign/global rules", () => {
    const rules: CommissionRuleInput[] = [
      rule({ id: "campaign", scope: "campaign", campaignId: "campaign_1", percentageBps: 900 }),
      rule({ id: "category", scope: "category", categoryId: "cat_1", percentageBps: 1500 }),
    ];

    const direct = calculateDirectCommission(order, affiliate, program, rules);
    assert.equal(direct.amountCents, 1500);
  });

  it("uses affiliate-specific product override first", () => {
    const rules: CommissionRuleInput[] = [
      rule({ id: "product", scope: "product", productId: "prod_1", percentageBps: 1000 }),
      rule({
        id: "affiliate_product",
        scope: "affiliate_product",
        affiliateId: affiliate.id,
        productId: "prod_1",
        percentageBps: 2500,
      }),
    ];

    const direct = calculateDirectCommission(order, affiliate, program, rules);
    assert.equal(direct.amountCents, 2500);
  });

  it("calculates multi-level depth 1", () => {
    const result = calculateCommissionsForOrderInput({
      order,
      program,
      directAffiliate: affiliate,
      ancestors: [ancestor("parent", 1)],
      multiLevelRules: [levelRule(1, 300)],
    });

    assert.equal(result.commissions.find((commission) => commission.levelDepth === 1)?.amountCents, 30);
  });

  it("calculates multi-level depth 2", () => {
    const result = calculateCommissionsForOrderInput({
      order,
      program,
      directAffiliate: affiliate,
      ancestors: [ancestor("parent", 1), ancestor("grandparent", 2)],
      multiLevelRules: [levelRule(1, 300), levelRule(2, 200)],
    });

    assert.equal(result.commissions.find((commission) => commission.levelDepth === 2)?.amountCents, 20);
  });

  it("enforces max level cap", () => {
    const result = calculateCommissionsForOrderInput({
      order,
      program: { ...program, maxLevels: 1 },
      directAffiliate: affiliate,
      ancestors: [ancestor("parent", 1), ancestor("grandparent", 2)],
      multiLevelRules: [levelRule(1, 300), levelRule(2, 200)],
    });

    assert.equal(result.commissions.some((commission) => commission.levelDepth === 2), false);
  });

  it("blocks own referrals", () => {
    const result = calculateCommissionsForOrderInput({
      order: { ...order, customerEmail: affiliate.email },
      program,
      directAffiliate: affiliate,
    });

    assert.deepEqual(result.rejectedReasons, ["Own referral blocked."]);
    assert.equal(result.commissions.length, 0);
  });

  it("blocks sale items when configured", () => {
    const result = calculateCommissionsForOrderInput({
      order: { ...order, items: [{ ...order.items[0], isSaleItem: true }] },
      program: { ...program, blockSaleItems: true },
      directAffiliate: affiliate,
    });

    assert.deepEqual(result.rejectedReasons, ["No qualified order items."]);
  });

  it("creates refund reversal ledgers", () => {
    const result = calculateCommissionsForOrderInput({ order, program, directAffiliate: affiliate });
    const reversals = createRefundReversalLedgers(result.commissions);

    assert.equal(reversals[0].type, "reversal_debit");
    assert.equal(reversals[0].amountCents, -1000);
  });

  it("does not duplicate commission on duplicate webhook", () => {
    const existingIdempotencyKeys = new Set(["commission-set:order_1"]);
    const result = calculateCommissionsForOrderInput({ order, program, directAffiliate: affiliate, existingIdempotencyKeys });

    assert.equal(result.idempotent, true);
    assert.equal(result.commissions.length, 0);
  });

  it("enforces monthly cap", () => {
    const result = calculateCommissionsForOrderInput({
      order,
      program,
      directAffiliate: affiliate,
      ancestors: [ancestor("parent", 1)],
      multiLevelRules: [{ ...levelRule(1, 5000), maxPerMonthCents: 20 }],
      monthlyCommissionByAffiliateCents: { parent: 10 },
    });

    assert.equal(result.commissions.find((commission) => commission.affiliateId === "parent")?.amountCents, 10);
  });

  it("rejects payout request below minimum", () => {
    const result = validatePayoutRequest({ program, availableCents: 10000, amountCents: 2000 });
    assert.equal(result.ok, false);
  });

  it("wallet ledger balances match commission totals", () => {
    const ledgers: WalletLedgerDraft[] = [
      {
        shopId: "shop_1",
        affiliateId: "aff_1",
        type: "pending_credit",
        amountCents: 1000,
        currency: "USD",
        balanceType: "pending",
      },
      {
        shopId: "shop_1",
        affiliateId: "aff_1",
        type: "payout_debit",
        amountCents: -400,
        currency: "USD",
        balanceType: "available",
      },
    ];

    const balances = calculateWalletBalances(ledgers);
    assert.equal(balances.pending, 1000);
    assert.equal(balances.available, -400);
    assert.equal(balances.lifetimeEarned, 1000);
    assert.equal(balances.lifetimePaid, 400);
  });
});

function rule(overrides: Partial<CommissionRuleInput>): CommissionRuleInput {
  return {
    id: "rule",
    shopId: "shop_1",
    scope: "global",
    type: "percentage",
    percentageBps: 1000,
    active: true,
    ...overrides,
  };
}

function levelRule(depth: number, percentageBps: number): MultiLevelCommissionRuleInput {
  return {
    id: `level_${depth}`,
    shopId: "shop_1",
    levelDepth: depth,
    type: "percentage",
    percentageBps,
    commissionBase: "direct_commission",
    active: true,
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
    },
  };
}
