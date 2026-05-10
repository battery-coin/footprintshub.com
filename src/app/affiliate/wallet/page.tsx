import { AffiliateShell } from "@/components/affiliate/affiliate-shell";
import { MetricCard } from "@/components/affiliate/metric-card";
import { demoAffiliateMetrics } from "@/lib/affiliate/demo-data";

export default function AffiliateWalletPage() {
  return (
    <AffiliateShell>
      <h1 className="text-3xl font-semibold">Wallet</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Pending" cents={demoAffiliateMetrics.pendingCommission} />
        <MetricCard label="Approved" cents={demoAffiliateMetrics.approvedCommission} />
        <MetricCard label="Available" cents={demoAffiliateMetrics.availableWallet} />
        <MetricCard label="Paid" cents={demoAffiliateMetrics.paidCommission} />
      </div>
      <p className="mt-6 rounded-lg border border-black/10 bg-white p-5 text-sm leading-6 text-black/60">
        Balances are ledger-based. No wallet balance should be changed without a matching ledger entry.
      </p>
    </AffiliateShell>
  );
}
