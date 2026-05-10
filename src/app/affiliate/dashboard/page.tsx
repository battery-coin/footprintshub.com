import { AffiliateShell } from "@/components/affiliate/affiliate-shell";
import { MetricCard } from "@/components/affiliate/metric-card";
import { ButtonLink } from "@/components/ui/button";
import { demoAffiliate, demoAffiliateMetrics, getDemoReferralLink } from "@/lib/affiliate/demo-data";

export default function AffiliateDashboardPage() {
  const referralLink = getDemoReferralLink("/");

  return (
    <AffiliateShell>
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Ambassador dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold">Welcome, {demoAffiliate.name}</h1>
        <div className="mt-6 rounded-lg border border-black/10 bg-white p-5">
          <p className="text-sm text-black/55">Referral code</p>
          <p className="mt-2 font-mono text-2xl font-semibold">{demoAffiliate.referralCode}</p>
          <p className="mt-3 break-all rounded-md bg-black/[0.03] p-3 font-mono text-sm">{referralLink}</p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Clicks" value={demoAffiliateMetrics.clicks} />
          <MetricCard label="Orders" value={demoAffiliateMetrics.orders} />
          <MetricCard label="Conversion" value={demoAffiliateMetrics.conversionRate} />
          <MetricCard label="Pending" cents={demoAffiliateMetrics.pendingCommission} />
          <MetricCard label="Approved" cents={demoAffiliateMetrics.approvedCommission} />
          <MetricCard label="Available wallet" cents={demoAffiliateMetrics.availableWallet} />
          <MetricCard label="Paid" cents={demoAffiliateMetrics.paidCommission} />
          <MetricCard label="Rank" value={demoAffiliate.rank} />
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/affiliate/links">Create share links</ButtonLink>
          <ButtonLink href="/legal/affiliate-disclosure" variant="secondary">
            Disclosure rules
          </ButtonLink>
        </div>
      </div>
    </AffiliateShell>
  );
}
