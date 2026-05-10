import { buildReferralUrl } from "./attribution";

export const demoAffiliate = {
  id: "aff_demo_founder",
  name: "Founder Ambassador",
  email: "ambassador@example.com",
  referralCode: "FOUNDER",
  status: "approved",
  rank: "Founder Ambassador",
  parent: "Community Partner",
};

export const demoAffiliateProgram = {
  name: "FootprintsHub Ambassador Program",
  cookieDays: 30,
  attributionModel: "last_touch",
  maxLevels: 7,
  maxCommissionPoolBps: 2000,
  directCommissionBps: 1000,
};

export const defaultSevenLevelPlan = [
  { depth: 0, label: "Direct affiliate", rate: "10%" },
  { depth: 1, label: "Parent ambassador", rate: "2%" },
  { depth: 2, label: "Grandparent ambassador", rate: "1.5%" },
  { depth: 3, label: "Third-level ambassador", rate: "1%" },
  { depth: 4, label: "Fourth-level ambassador", rate: "0.75%" },
  { depth: 5, label: "Fifth-level ambassador", rate: "0.50%" },
  { depth: 6, label: "Sixth-level ambassador", rate: "0.25%" },
  { depth: 7, label: "Seventh-level ambassador", rate: "0.25%" },
];

export const demoAffiliateMetrics = {
  clicks: 128,
  orders: 14,
  conversionRate: "10.9%",
  pendingCommission: 18450,
  approvedCommission: 9200,
  availableWallet: 7400,
  paidCommission: 12500,
};

export const demoCommissions = [
  {
    id: "com_1",
    date: "2026-05-09",
    type: "direct",
    order: "FH-1001",
    levelDepth: 0,
    amountCents: 490,
    status: "pending",
    reason: "Qualified purchase",
  },
  {
    id: "com_2",
    date: "2026-05-09",
    type: "multi_level",
    order: "FH-1002",
    levelDepth: 1,
    amountCents: 98,
    status: "pending",
    reason: "Parent ambassador commission",
  },
  {
    id: "com_3",
    date: "2026-05-08",
    type: "direct",
    order: "FH-1000",
    levelDepth: 0,
    amountCents: 2990,
    status: "approved",
    reason: "Hold period cleared",
  },
];

export const demoPayouts = [
  {
    id: "po_1",
    requestedAt: "2026-05-09",
    amountCents: 7400,
    feeCents: 250,
    method: "manual bank",
    status: "requested",
    adminNote: "Pending review",
  },
];

export const demoMarketingAssets = [
  {
    id: "asset_1",
    title: "Footprints Supporter Bundle Banner",
    type: "product banner",
    targetUrl: "/products/footprints-supporter-bundle",
  },
  {
    id: "asset_2",
    title: "Matrix Decoded Booster Pack Social Tile",
    type: "social image",
    targetUrl: "/products/matrix-decoded-booster-pack-series-1",
  },
];

export function getDemoReferralLink(path = "/") {
  return buildReferralUrl({
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://footprintshub.com",
    code: demoAffiliate.referralCode,
    path,
  });
}
