import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminAffiliatePlan, previewPlan } from "@/lib/affiliate/plan-builder";
import { formatBpsAsPercent } from "@/lib/money/percentage-bps";

export default async function AffiliatePlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await getAdminAffiliatePlan(id);

  if (!plan) {
    return (
      <AffiliateAdminPage title="Affiliate plan detail">
        <div className="rounded-lg border border-black/10 bg-white p-5">Plan not found.</div>
      </AffiliateAdminPage>
    );
  }

  const example = previewPlan(plan);

  return (
    <AffiliateAdminPage title="Affiliate plan detail">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="mt-1 font-mono text-xs text-black/45">{id}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{plan.structureType}</Badge>
              <Badge className={plan.engineStatus === "functional" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}>
                {plan.engineStatus}
              </Badge>
              <Badge>{plan.status}</Badge>
            </div>
          </div>
          <p className="mt-2 text-sm leading-6 text-black/60">
            {plan.description} Commissions are paid only on qualified purchases, held first, capped, and reversed on refunds or chargebacks.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Attribution", "Coupon priority, then qualified link/session attribution"],
              ["Commission trigger", "Verified paid order only"],
              ["Approval", `Pending first, ${plan.holdDays}-day hold or admin approval`],
              ["Refunds", "Direct and structure commissions reverse proportionally"],
              ["Engine", plan.engineStatus === "functional" ? "Live commission calculation supported" : "Configuration saves and previews; owner approval required before payout execution"],
              ["Compliance", "No commission for recruitment alone"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md bg-black/[0.03] p-3">
                <p className="text-xs text-black/55">{label}</p>
                <p className="mt-1 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href={`/admin/affiliates/plans/${plan.id}/levels`}>Level editor</ButtonLink>
            <ButtonLink href={`/admin/affiliates/plans/${plan.id}/preview`} variant="secondary">
              Preview
            </ButtonLink>
            <ButtonLink href={`/admin/affiliates/plans/${plan.id}/${plan.structureType}`} variant="secondary">
              Structure settings
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
        <h2 className="text-lg font-semibold">$100 example</h2>
        <p className="mt-2 text-sm text-black/60">
          Estimated total: ${(example.totalCents / 100).toFixed(2)}. Default pool cap: ${(example.maxPoolCents / 100).toFixed(2)}.
        </p>
        <div className="mt-4 grid gap-3">
          {plan.levels.map((level) => (
            <div key={level.levelDepth} className="grid gap-2 rounded-md bg-black/[0.03] p-3 sm:grid-cols-[120px_1fr_120px]">
              <span className="font-mono text-sm">Level {level.levelDepth}</span>
              <span>{level.label}</span>
              <span className="font-semibold">{formatBpsAsPercent(level.percentageBps)}</span>
            </div>
          ))}
        </div>
      </div>
    </AffiliateAdminPage>
  );
}
