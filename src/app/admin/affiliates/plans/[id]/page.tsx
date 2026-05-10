import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { ButtonLink } from "@/components/ui/button";
import { defaultSevenLevelPlan } from "@/lib/affiliate/demo-data";

export default async function AffiliatePlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AffiliateAdminPage title="Affiliate plan detail">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-xl font-semibold">FootprintsHub 7-Level Ambassador Plan</h2>
          <p className="mt-1 font-mono text-xs text-black/45">{id}</p>
          <p className="mt-2 text-sm leading-6 text-black/60">
            This plan supports flat, product-specific, rank-based, performance-tier, lifetime, coupon, and seven-level
            ambassador commission models under one capped purchase-only structure.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Attribution", "Coupon priority, then qualified link/session attribution"],
              ["Commission trigger", "Verified paid order only"],
              ["Approval", "Pending first, 14-day hold or admin approval"],
              ["Refunds", "Direct and ancestor commissions reverse proportionally"],
              ["Compression", "Pay zero by default for unqualified skipped levels"],
              ["Compliance", "No commission for recruitment alone"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md bg-black/[0.03] p-3">
                <p className="text-xs text-black/55">{label}</p>
                <p className="mt-1 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/admin/affiliates/plans/footprintshub-7-level/levels">Level editor</ButtonLink>
            <ButtonLink href="/admin/affiliates/ranks" variant="secondary">
              Rank rules
            </ButtonLink>
            <ButtonLink href="/admin/affiliates/performance-tiers" variant="secondary">
              Performance tiers
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-900">Risk controls</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900/75">
            Keep cash payout disabled until payout compliance, tax collection, KYC needs, and creator-shop liability are
            reviewed. Store credit is the safer MVP payout mode.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-black/10 bg-white p-5">
        <h2 className="text-lg font-semibold">Rates</h2>
        <div className="mt-4 grid gap-3">
          {defaultSevenLevelPlan.map((level) => (
            <div key={level.depth} className="grid gap-2 rounded-md bg-black/[0.03] p-3 sm:grid-cols-[120px_1fr_120px]">
              <span className="font-mono text-sm">Level {level.depth}</span>
              <span>{level.label}</span>
              <span className="font-semibold">{level.rate}</span>
            </div>
          ))}
        </div>
      </div>
    </AffiliateAdminPage>
  );
}
