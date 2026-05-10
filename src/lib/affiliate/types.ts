export type AffiliateStatus = "pending" | "approved" | "rejected" | "suspended";

export type AttributionModel = "first_touch" | "last_touch" | "coupon_priority" | "manual_override";

export type CommissionType = "percentage" | "fixed" | "percentage_plus_fixed";

export type CommissionBase = "order_subtotal" | "product_subtotal" | "direct_commission";

export type CommissionScope =
  | "global"
  | "product"
  | "category"
  | "collection"
  | "affiliate"
  | "affiliate_product"
  | "affiliate_category"
  | "campaign"
  | "membership";

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

export type AffiliateCommissionStatus = "pending" | "approved" | "rejected" | "paid" | "reversed" | "capped";

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

export type PayoutMethod = "manual_bank" | "paypal" | "stripe_connect" | "store_credit";

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
  scope: CommissionScope;
  affiliateId?: string;
  productId?: string;
  categoryId?: string;
  collectionId?: string;
  campaignId?: string;
  type: CommissionType;
  percentageBps?: number;
  fixedCents?: number;
  priority?: number;
  active: boolean;
};

export type MultiLevelCommissionRuleInput = {
  id: string;
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
