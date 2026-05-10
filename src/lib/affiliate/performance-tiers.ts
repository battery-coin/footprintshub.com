import type { AffiliatePerformanceTierInput, AffiliateQualificationSnapshotInput } from "./types";

export function resolvePerformanceTier({
  tiers,
  metrics,
}: {
  tiers: AffiliatePerformanceTierInput[];
  metrics: AffiliateQualificationSnapshotInput;
}) {
  return tiers
    .filter((tier) => tier.active)
    .filter((tier) => {
      const value = metricValue(tier.metric, metrics);
      return value >= tier.minValue && (tier.maxValue === undefined || value <= tier.maxValue);
    })
    .sort((a, b) => b.priority - a.priority)[0];
}

export function metricValue(metric: AffiliatePerformanceTierInput["metric"], metrics: AffiliateQualificationSnapshotInput) {
  switch (metric) {
    case "monthly_sales":
      return metrics.monthlySalesCents;
    case "monthly_orders":
      return metrics.monthlyOrderCount;
    case "lifetime_sales":
      return metrics.monthlySalesCents;
    case "approved_commissions":
      return metrics.approvedCommissionCents;
  }
}
