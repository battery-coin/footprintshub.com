import type {
  AffiliateAncestor,
  AffiliateCommissionDraft,
  AffiliateProgramConfig,
  AffiliateRecord,
  CommissionCalculationInput,
  CommissionCalculationResult,
  CommissionRuleInput,
  MultiLevelCommissionRuleInput,
  OrderForCommission,
  OrderItemForCommission,
  WalletLedgerDraft,
} from "./types";

const MAX_SUPPORTED_LEVELS = 7;

const scopePrecedence: Record<CommissionRuleInput["scope"], number> = {
  affiliate_product: 2,
  affiliate_category: 3,
  product: 4,
  category: 5,
  collection: 5,
  creator_shop: 6,
  campaign: 6,
  membership: 6,
  ad_product: 6,
  service: 6,
  subscription: 6,
  digital: 6,
  nft: 6,
  rank: 7,
  performance_tier: 7,
  affiliate: 7,
  coupon: 8,
  lifetime: 8,
  manual: 9,
  global: 10,
};

export function calculateCommissionsForOrderInput(input: CommissionCalculationInput): CommissionCalculationResult {
  const rejectedReasons: string[] = [];

  if (input.existingIdempotencyKeys?.has(orderSetKey(input.order.id))) {
    return { commissions: [], walletLedgers: [], rejectedReasons, idempotent: true };
  }

  const directAffiliate = input.directAffiliate;
  if (!directAffiliate) {
    return { commissions: [], walletLedgers: [], rejectedReasons: ["No attributed affiliate."], idempotent: false };
  }

  const validation = validateAffiliateForOrder(input.order, directAffiliate, input.program);
  if (validation) {
    return { commissions: [], walletLedgers: [], rejectedReasons: [validation], idempotent: false };
  }

  const qualifiedItems = input.order.items.filter((item) => !(input.program.blockSaleItems && item.isSaleItem));
  if (!qualifiedItems.length) {
    return { commissions: [], walletLedgers: [], rejectedReasons: ["No qualified order items."], idempotent: false };
  }

  const direct = calculateDirectCommission(input.order, directAffiliate, input.program, input.commissionRules ?? []);
  const commissions: AffiliateCommissionDraft[] = direct.amountCents > 0 ? [direct] : [];
  const walletLedgers: WalletLedgerDraft[] = direct.amountCents > 0 ? [toPendingLedger(direct)] : [];

  if (direct.amountCents <= 0) {
    rejectedReasons.push("Direct commission calculated to zero.");
  }

  if (input.program.allowMultiLevel && direct.amountCents > 0) {
    const levelDrafts = calculateMultiLevelCommissions({
      order: input.order,
      program: input.program,
      directAffiliate,
      directCommissionCents: direct.amountCents,
      ancestors: input.ancestors ?? [],
      rules: input.multiLevelRules ?? [],
      monthlyCommissionByAffiliateCents: input.monthlyCommissionByAffiliateCents ?? {},
    });

    for (const commission of levelDrafts) {
      commissions.push(commission);
      walletLedgers.push(toPendingLedger(commission));
    }
  }

  const capped = enforceOrderPoolCap(input.order, input.program, commissions);

  return {
    commissions: capped,
    walletLedgers: capped.map(toPendingLedger),
    rejectedReasons,
    idempotent: false,
  };
}

export function calculateDirectCommission(
  order: OrderForCommission,
  affiliate: AffiliateRecord,
  program: AffiliateProgramConfig,
  rules: CommissionRuleInput[],
): AffiliateCommissionDraft {
  const qualifiedItems = order.items.filter((item) => !(program.blockSaleItems && item.isSaleItem));
  const amountCents = qualifiedItems.reduce((total, item) => {
    const rule = resolveBestCommissionRule(rules, affiliate.id, item);
    const commissionBaseCents = getDirectBaseCents(item, order, program);

    if (rule) {
      return total + calculateAmount(rule, commissionBaseCents);
    }

    return total + calculateAmount(
      {
        type: program.defaultCommissionType,
        percentageBps: program.defaultCommissionType === "percentage" ? program.defaultCommissionValue : undefined,
        fixedCents: program.defaultCommissionType !== "percentage" ? program.defaultCommissionValue : undefined,
      },
      commissionBaseCents,
    );
  }, 0);

  const baseCents = qualifiedItems.reduce((total, item) => total + getDirectBaseCents(item, order, program), 0);

  return {
    idempotencyKey: directCommissionKey(order.id, affiliate.id),
    shopId: order.shopId,
    affiliateId: affiliate.id,
    orderId: order.id,
      type: "direct",
      levelDepth: 0,
      structureType: "unilevel",
    status: "pending",
    amountCents: clampMoney(amountCents, 0, order.subtotalCents),
    currency: order.currency,
    commissionBaseCents: baseCents,
    ruleId: resolveDominantRuleId(rules, affiliate.id, qualifiedItems),
  };
}

export function resolveBestCommissionRule(
  rules: CommissionRuleInput[],
  affiliateId: string,
  item: OrderItemForCommission,
) {
  return rules
    .filter((rule) => rule.active && ruleMatches(rule, affiliateId, item))
    .sort((a, b) => {
      const precedence = scopePrecedence[a.scope] - scopePrecedence[b.scope];
      if (precedence !== 0) {
        return precedence;
      }
      return (b.priority ?? 0) - (a.priority ?? 0);
    })[0];
}

export function calculateMultiLevelCommissions({
  order,
  program,
  directAffiliate,
  directCommissionCents,
  ancestors,
  rules,
  monthlyCommissionByAffiliateCents,
}: {
  order: OrderForCommission;
  program: AffiliateProgramConfig;
  directAffiliate: AffiliateRecord;
  directCommissionCents: number;
  ancestors: AffiliateAncestor[];
  rules: MultiLevelCommissionRuleInput[];
  monthlyCommissionByAffiliateCents: Record<string, number>;
}) {
  const maxDepth = clampMoney(program.maxLevels, 0, MAX_SUPPORTED_LEVELS);
  const sortedAncestors = dedupeAncestors(ancestors)
    .filter((ancestor) => ancestor.depth > 0 && ancestor.depth <= maxDepth)
    .filter((ancestor) => ancestor.affiliate.status === "approved" && ancestor.affiliate.shopId === order.shopId)
    .sort((a, b) => a.depth - b.depth);

  const result: AffiliateCommissionDraft[] = [];

  for (const ancestor of sortedAncestors) {
    if (ancestor.affiliate.id === directAffiliate.id) {
      continue;
    }

    const rule = rules.find((candidate) => candidate.active && candidate.levelDepth === ancestor.depth);
    if (!rule) {
      continue;
    }

    const baseCents = getLevelBaseCents(rule, order, directCommissionCents);
    let amountCents = calculateAmount(rule, baseCents);

    if (rule.maxPerOrderCents !== undefined) {
      amountCents = Math.min(amountCents, rule.maxPerOrderCents);
    }

    if (rule.maxPerMonthCents !== undefined) {
      const alreadyEarned = monthlyCommissionByAffiliateCents[ancestor.affiliate.id] ?? 0;
      amountCents = Math.max(0, Math.min(amountCents, rule.maxPerMonthCents - alreadyEarned));
    }

    if (amountCents <= 0) {
      continue;
    }

    result.push({
      idempotencyKey: levelCommissionKey(order.id, ancestor.affiliate.id, ancestor.depth),
      shopId: order.shopId,
      affiliateId: ancestor.affiliate.id,
      orderId: order.id,
      sourceAffiliateId: directAffiliate.id,
      type: "multi_level",
      levelDepth: ancestor.depth,
      structureType: "unilevel",
      status: "pending",
      amountCents: clampMoney(amountCents, 0, order.subtotalCents),
      currency: order.currency,
      commissionBaseCents: baseCents,
      multiLevelRuleId: rule.planLevelId ? undefined : rule.id,
      planLevelId: rule.planLevelId,
    });
  }

  return result;
}

export function createRefundReversalLedgers(commissions: AffiliateCommissionDraft[]): WalletLedgerDraft[] {
  return commissions
    .filter((commission) => commission.amountCents > 0 && commission.status !== "reversed")
    .map((commission) => ({
      shopId: commission.shopId,
      affiliateId: commission.affiliateId,
      commissionIdempotencyKey: commission.idempotencyKey,
      type: "reversal_debit",
      amountCents: -commission.amountCents,
      currency: commission.currency,
      balanceType: "pending",
      note: `Refund or chargeback reversal for order ${commission.orderId}.`,
    }));
}

export function validatePayoutRequest({
  program,
  availableCents,
  amountCents,
}: {
  program: Pick<AffiliateProgramConfig, "minPayoutCents" | "maxPayoutCents" | "withdrawalFeeCents">;
  availableCents: number;
  amountCents: number;
}) {
  if (amountCents < program.minPayoutCents) {
    return { ok: false as const, reason: "Payout request is below the minimum payout amount." };
  }

  if (program.maxPayoutCents !== undefined && amountCents > program.maxPayoutCents) {
    return { ok: false as const, reason: "Payout request exceeds the maximum payout amount." };
  }

  if (amountCents > availableCents) {
    return { ok: false as const, reason: "Payout request exceeds available wallet balance." };
  }

  const netAmountCents = Math.max(0, amountCents - program.withdrawalFeeCents);
  return { ok: true as const, feeCents: program.withdrawalFeeCents, netAmountCents };
}

function validateAffiliateForOrder(
  order: OrderForCommission,
  affiliate: AffiliateRecord,
  program: AffiliateProgramConfig,
) {
  if (affiliate.status !== "approved") {
    return "Affiliate is not approved.";
  }

  if (affiliate.shopId !== order.shopId) {
    return "Affiliate does not belong to this shop.";
  }

  if (program.blockOwnReferrals) {
    const sameEmail =
      affiliate.email && order.customerEmail && affiliate.email.toLowerCase() === order.customerEmail.toLowerCase();
    const sameCustomer = affiliate.customerId && order.customerId && affiliate.customerId === order.customerId;

    if (sameEmail || sameCustomer) {
      return "Own referral blocked.";
    }
  }

  return null;
}

function ruleMatches(rule: CommissionRuleInput, affiliateId: string, item: OrderItemForCommission) {
  switch (rule.scope) {
    case "affiliate_product":
      return rule.affiliateId === affiliateId && rule.productId === item.productId;
    case "affiliate_category":
      return rule.affiliateId === affiliateId && Boolean(rule.categoryId && item.categoryIds?.includes(rule.categoryId));
    case "product":
      return rule.productId === item.productId;
    case "category":
      return Boolean(rule.categoryId && item.categoryIds?.includes(rule.categoryId));
    case "collection":
      return Boolean(rule.collectionId && item.collectionIds?.includes(rule.collectionId));
    case "creator_shop":
      return Boolean(rule.creatorShopId && rule.creatorShopId === item.creatorShopId);
    case "campaign":
      return Boolean(rule.campaignId && rule.campaignId === item.campaignId);
    case "membership":
      return item.productType === "membership";
    case "rank":
      return Boolean(rule.rankId);
    case "performance_tier":
      return Boolean(rule.performanceTierId);
    case "affiliate":
      return rule.affiliateId === affiliateId;
    case "coupon":
    case "lifetime":
    case "manual":
    case "global":
      return true;
  }
}

function calculateAmount(
  rule: Pick<CommissionRuleInput | MultiLevelCommissionRuleInput, "type" | "percentageBps" | "fixedCents">,
  baseCents: number,
) {
  const percentageAmount = rule.percentageBps ? Math.floor((baseCents * rule.percentageBps) / 10000) : 0;
  const fixedAmount = rule.fixedCents ?? 0;

  if (rule.type === "percentage" || rule.type === "store_credit") {
    return percentageAmount;
  }

  if (rule.type === "fixed") {
    return fixedAmount;
  }

  return percentageAmount + fixedAmount;
}

function getDirectBaseCents(item: OrderItemForCommission, order: OrderForCommission, program: AffiliateProgramConfig) {
  return program.commissionBase === "order_subtotal" ? order.subtotalCents : item.subtotalCents;
}

function getLevelBaseCents(rule: MultiLevelCommissionRuleInput, order: OrderForCommission, directCommissionCents: number) {
  if (rule.commissionBase === "direct_commission") {
    return directCommissionCents;
  }

  return order.subtotalCents;
}

function resolveDominantRuleId(
  rules: CommissionRuleInput[],
  affiliateId: string,
  items: OrderItemForCommission[],
) {
  return items.map((item) => resolveBestCommissionRule(rules, affiliateId, item)?.id).find(Boolean);
}

function toPendingLedger(commission: AffiliateCommissionDraft): WalletLedgerDraft {
  return {
    shopId: commission.shopId,
    affiliateId: commission.affiliateId,
    commissionIdempotencyKey: commission.idempotencyKey,
    type: "pending_credit",
    amountCents: commission.amountCents,
    currency: commission.currency,
    balanceType: "pending",
    note: `${commission.type} commission for order ${commission.orderId}.`,
  };
}

function enforceOrderPoolCap(
  order: OrderForCommission,
  program: AffiliateProgramConfig,
  commissions: AffiliateCommissionDraft[],
) {
  const maxPool = Math.floor((order.subtotalCents * program.maxCommissionPoolBps) / 10000);
  let remaining = maxPool;

  return commissions
    .map((commission) => {
      const amountCents = Math.min(commission.amountCents, remaining);
      remaining -= amountCents;

      return {
        ...commission,
        amountCents,
        capApplied: amountCents < commission.amountCents ? true : commission.capApplied,
        status: amountCents < commission.amountCents ? "capped" : commission.status,
        reason: amountCents < commission.amountCents ? "Order commission pool cap applied." : commission.reason,
      } satisfies AffiliateCommissionDraft;
    })
    .filter((commission) => commission.amountCents > 0);
}

function dedupeAncestors(ancestors: AffiliateAncestor[]) {
  const seen = new Set<string>();
  return ancestors.filter((ancestor) => {
    if (seen.has(ancestor.affiliate.id)) {
      return false;
    }
    seen.add(ancestor.affiliate.id);
    return true;
  });
}

function directCommissionKey(orderId: string, affiliateId: string) {
  return `commission:${orderId}:${affiliateId}:direct`;
}

function levelCommissionKey(orderId: string, affiliateId: string, depth: number) {
  return `commission:${orderId}:${affiliateId}:level:${depth}`;
}

function orderSetKey(orderId: string) {
  return `commission-set:${orderId}`;
}

function clampMoney(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.floor(value)));
}
