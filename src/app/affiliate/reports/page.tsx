import { AffiliateShell } from "@/components/affiliate/affiliate-shell";
import { MetricCard } from "@/components/affiliate/metric-card";
import { demoAffiliateMetrics } from "@/lib/affiliate/demo-data";

export default function AffiliateReportsPage() {
  return (
    <AffiliateShell>
      <h1 className="text-3xl font-semibold">Reports</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Clicks" value={demoAffiliateMetrics.clicks} />
        <MetricCard label="Orders" value={demoAffiliateMetrics.orders} />
        <MetricCard label="Conversion" value={demoAffiliateMetrics.conversionRate} />
        <MetricCard label="Pending" cents={demoAffiliateMetrics.pendingCommission} />
      </div>
    </AffiliateShell>
  );
}
