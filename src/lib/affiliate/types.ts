export type AffiliateStatus = "pending" | "approved" | "rejected" | "suspended";

export type AttributionModel = "first_touch" | "last_touch" | "coupon_priority" | "lifetime" | "manual_override";

export type CommissionType = "percentage" | "fixed" | "percentage_plus_fixed" | "store_credit";

export type CommissionBase =
  | "order_subtotal"
  | "product_subtotal"
  | "item_subtotal"
  | "direct_commission"
  | "leg_volume"
  | "weaker_leg_volume"
  | "matrix_level_volume"
  | "gross_margin";

export type CommissionScope =
  | "global"
  | "product"
  | "category"
  | "collection"
  | "creator_shop"
  | "affiliate"
  | "affiliate_product"
  | "affiliate_category"
  | "campaign"
  | "membership"
  | "rank"
  | "performance_tier"
  | "coupon"
  | "lifetime"
  | "manual"
  | "ad_product"
  | "service"
  | "subscription"
  | "digital"
  | "nft";

export type AffiliatePlanType =
  | "flat"
  | "product"
  | "category"
  | "campaign"
  | "creator_shop"
  | "rank_based"
  | "performance_tier"
  | "seven_level"
  | "lifetime"
  | "coupon"
  | "hybrid";

export type AffiliateBusinessModelType = AffiliatePlanType | "manual";

export type AffiliateStructureType = "binary" | "matrix" | "unilevel";

export type AffiliateLegSide = "left" | "right";

export type BinaryPayoutBasis = "weaker_leg_volume" | "pair_matching" | "direct_purchase_volume";

export type BinarySpilloverMode = "auto_left" | "auto_right" | "weaker_leg" | "manual" | "balanced";

export type MatrixSpilloverMode = "breadth_first" | "depth_first" | "manual" | "auto_fill";

export type MatrixLevelCommissionMode = "per_level_percentage" | "per_member_fixed" | "level_completion";

export type CompressionBehavior = "pay_zero" | "skip_ineligible" | "compress_to_next_qualified";

export type PerformanceMetric = "monthly_sales" | "monthly_orders" | "lifetime_sales" | "approved_commissions";

export type AffiliateCommissionKind =
  | "direct"
  | "multi_level"
  | "signup"
  | "performance"
  | "click"
  | "share"
  | "manual"
  | "rank"
  | "coupon";

export type AffiliateCommissionStatus =
  | "pending"
  | "held"
  | "approved"
  | "rejected"
  | "paid"
  | "reversed"
  | "partially_reversed"
  | "capped";

export type WalletLedgerType =
  | "pending_credit"
  | "approve_credit"
  | "reject_debit"
  | "payout_debit"
  | "reversal_debit"
  | "manual_credit"
  | "manual_debit"
  | "coupon_debit";

export type WalletBalanceType = "pending" | "approved" | "available" | "paid" | "rejected";

export type PayoutMethod = "manual_bank" | "paypal" | "paypal_placeholder" | "stripe_connect" | "stripe_connect_placeholder" | "store_credit";

export type PayoutStatus = "requested" | "approved" | "processing" | "paid" | "rejected" | "cancelled";

export type AffiliateProgramConfig = {
  id: string;
  shopId: string;
  attributionModel: AttributionModel;
  cookieDays: number;
  allowMultiLevel: boolean;
  maxLevels: number;
  maxCommissionPoolBps: number;
  defaultCommissionType: CommissionType;
  defaultCommissionValue: number;
  commissionBase: CommissionBase;
  autoApproveCommissions: boolean;
  holdDays: number;
  blockOwnReferrals: boolean;
  blockSaleItems: boolean;
  minPayoutCents: number;
  maxPayoutCents?: number;
  withdrawalFeeCents: number;
};

export type AffiliateRecord = {
  id: string;
  shopId: string;
  email: string;
  customerId?: string;
  referralCode: string;
  status: AffiliateStatus;
  parentAffiliateId?: string;
  rankId?: string;
  performanceTierId?: string;
  activePlanId?: string;
};

export type AffiliateAncestor = {
  affiliate: AffiliateRecord;
  depth: number;
};

export type OrderItemForCommission = {
  id: string;
  productId: string;
  categoryIds?: string[];
  collectionIds?: string[];
  campaignId?: string;
  creatorShopId?: string;
  rankId?: string;
  performanceTierId?: string;
  productType?: string;
  subtotalCents: number;
  isSaleItem?: boolean;
};

export type OrderForCommission = {
  id: string;
  shopId: string;
  orderNumber?: string;
  customerId?: string;
  customerEmail?: string;
  subtotalCents: number;
  totalCents: number;
  currency: string;
  status: string;
  paymentStatus: string;
  items: OrderItemForCommission[];
};

export type CommissionRuleInput = {
  id: string;
  shopId: string;
  planId?: string;
  structureType?: AffiliateStructureType;
  businessModelType?: AffiliateBusinessModelType;
  scope: CommissionScope;
  affiliateId?: string;
  productId?: string;
  categoryId?: string;
  collectionId?: string;
  campaignId?: string;
  creatorShopId?: string;
  rankId?: string;
  performanceTierId?: string;
  type: CommissionType;
  percentageBps?: number;
  fixedCents?: number;
  priority?: number;
  active: boolean;
};

export type MultiLevelCommissionRuleInput = {
  id: string;
  planLevelId?: string;
  shopId: string;
  levelDepth: number;
  type: CommissionType;
  percentageBps?: number;
  fixedCents?: number;
  commissionBase: CommissionBase;
  maxPerOrderCents?: number;
  maxPerMonthCents?: number;
  active: boolean;
};

export type AffiliatePlanLevelInput = {
  id: string;
  shopId: string;
  affiliatePlanId: string;
  levelDepth: number;
  label: string;
  enabled: boolean;
  commissionType: CommissionType;
  percentageBps?: number;
  fixedCents?: number;
  commissionBase: CommissionBase;
  maxPerOrderCents?: number;
  maxPerMonthCents?: number;
  requiresRankId?: string;
  compressionBehavior: CompressionBehavior;
};

export type AffiliatePlanConfig = {
  id: string;
  shopId: string;
  name: string;
  planType: AffiliatePlanType;
  structureType?: AffiliateStructureType;
  isDefault: boolean;
  currency: string;
  maxActiveLevels: number;
  maxCommissionPoolBps?: number;
  maxCommissionPoolCents?: number;
  allowLifetimeAttribution: boolean;
  lifetimeAttributionDays?: number;
  attributionModel: AttributionModel;
  cookieDays: number;
  holdDays: number;
  autoApproveCommissions: boolean;
  blockOwnReferrals: boolean;
  blockSaleItems: boolean;
  allowStoreCreditPayout: boolean;
  allowCashPayout: boolean;
  levels: AffiliatePlanLevelInput[];
};

export type AffiliateRankInput = {
  id: string;
  shopId: string;
  name: string;
  priority: number;
  maxPaidLevels: number;
  directCommissionBonusBps?: number;
  monthlySalesRequiredCents?: number;
  directReferralRequiredCount?: number;
  qualifiedOrderRequiredCount?: number;
  active: boolean;
};

export type AffiliatePerformanceTierInput = {
  id: string;
  shopId: string;
  affiliatePlanId: string;
  name: string;
  priority: number;
  metric: PerformanceMetric;
  minValue: number;
  maxValue?: number;
  directCommissionBps?: number;
  maxPaidLevels?: number;
  bonusCents?: number;
  active: boolean;
};

export type AffiliateQualificationSnapshotInput = {
  affiliateId: string;
  monthlySalesCents: number;
  monthlyOrderCount: number;
  directReferralCount: number;
  qualifiedOrderCount: number;
  approvedCommissionCents: number;
  calculatedRankId?: string;
  calculatedTierId?: string;
  maxPaidLevels: number;
};

export type AffiliateCommissionDraft = {
  idempotencyKey: string;
  shopId: string;
  affiliateId: string;
  orderId: string;
  orderItemId?: string;
  sourceAffiliateId?: string;
  type: AffiliateCommissionKind;
  levelDepth: number;
  status: AffiliateCommissionStatus;
  amountCents: number;
  currency: string;
  commissionBaseCents: number;
  ruleId?: string;
  multiLevelRuleId?: string;
  planId?: string;
  planLevelId?: string;
  rankId?: string;
  performanceTierId?: string;
  businessModelType?: AffiliateBusinessModelType;
  structureType?: AffiliateStructureType;
  capApplied?: boolean;
  compressionApplied?: boolean;
  legSide?: AffiliateLegSide;
  matrixPositionId?: string;
  volumeCents?: number;
  reason?: string;
};

export type WalletLedgerDraft = {
  shopId: string;
  affiliateId: string;
  commissionIdempotencyKey?: string;
  type: WalletLedgerType;
  amountCents: number;
  currency: string;
  balanceType: WalletBalanceType;
  note?: string;
};

export type CommissionCalculationInput = {
  order: OrderForCommission;
  program: AffiliateProgramConfig;
  directAffiliate?: AffiliateRecord;
  ancestors?: AffiliateAncestor[];
  commissionRules?: CommissionRuleInput[];
  multiLevelRules?: MultiLevelCommissionRuleInput[];
  existingIdempotencyKeys?: Set<string>;
  monthlyCommissionByAffiliateCents?: Record<string, number>;
};

export type CommissionCalculationResult = {
  commissions: AffiliateCommissionDraft[];
  walletLedgers: WalletLedgerDraft[];
  rejectedReasons: string[];
  idempotent: boolean;
};

export type WalletBalances = Record<WalletBalanceType | "lifetimeEarned" | "lifetimePaid", number>;
