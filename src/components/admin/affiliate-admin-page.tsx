import { AdminShell } from "@/components/admin/admin-shell";
import { MetricCard } from "@/components/affiliate/metric-card";
import { ButtonLink } from "@/components/ui/button";
import { demoAffiliateMetrics } from "@/lib/affiliate/demo-data";

const affiliateAdminLinks = [
  ["/admin/affiliates/plans", "Plans"],
  ["/admin/affiliates/applications", "Applications"],
  ["/admin/affiliates/referrals", "Referrals"],
  ["/admin/affiliates/commissions", "Commissions"],
  ["/admin/affiliates/payouts", "Payouts"],
  ["/admin/affiliates/rules", "Rules"],
  ["/admin/affiliates/levels", "7-level settings"],
  ["/admin/affiliates/ranks", "Ranks"],
  ["/admin/affiliates/performance-tiers", "Performance tiers"],
  ["/admin/affiliates/bonuses", "Bonuses"],
  ["/admin/affiliates/assets", "Assets"],
  ["/admin/affiliates/reports", "Reports"],
  ["/admin/affiliates/settings", "Settings"],
];

export function AffiliateAdminPage({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <AdminShell>
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Affiliate admin</p>
        <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total affiliates" value="1" />
          <MetricCard label="Pending applications" value="1" />
          <MetricCard label="Clicks" value={demoAffiliateMetrics.clicks} />
          <MetricCard label="Pending liability" cents={demoAffiliateMetrics.pendingCommission} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {affiliateAdminLinks.map(([href, label]) => (
            <ButtonLink key={href} href={href} variant="secondary">
              {label}
            </ButtonLink>
          ))}
        </div>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </AdminShell>
  );
}
