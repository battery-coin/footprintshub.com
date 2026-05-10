import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { ButtonLink } from "@/components/ui/button";
import { defaultSevenLevelPlan } from "@/lib/affiliate/demo-data";

const templates = [
  ["Simple Affiliate", "10% direct, 30-day cookie, 14-day hold"],
  ["Creator Ambassador", "10% direct plus 2%, 1%, 0.5% ancestor levels"],
  ["7-Level Ambassador", "Direct plus seven capped purchase-commission levels"],
  ["Store Credit Fan Program", "Store-credit rewards with cash payout disabled"],
  ["Rank-Gated Ambassador", "Paid depth unlocks by Bronze through Founder rank"],
  ["Product Launch Campaign", "Campaign products with deadline-based override"],
  ["Premium Creator Shop", "Creator shop default with platform caps"],
];

export default function AdminAffiliatePlansPage() {
  return (
    <AffiliateAdminPage title="Affiliate plans">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">FootprintsHub 7-Level Ambassador Plan</h2>
              <p className="mt-2 text-sm leading-6 text-black/60">
                Active default. Commissions are paid only on qualified purchases, held first, capped at 20% of qualified
                product subtotal, and reversed on refunds or chargebacks.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Active</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <div className="rounded-md bg-black/[0.03] p-3">
              <p className="text-xs text-black/55">Cookie</p>
              <p className="mt-1 font-semibold">30 days</p>
            </div>
            <div className="rounded-md bg-black/[0.03] p-3">
              <p className="text-xs text-black/55">Hold</p>
              <p className="mt-1 font-semibold">14 days</p>
            </div>
            <div className="rounded-md bg-black/[0.03] p-3">
              <p className="text-xs text-black/55">Max pool</p>
              <p className="mt-1 font-semibold">20%</p>
            </div>
            <div className="rounded-md bg-black/[0.03] p-3">
              <p className="text-xs text-black/55">Cash payout</p>
              <p className="mt-1 font-semibold">Off</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/admin/affiliates/plans/footprintshub-7-level">Review plan</ButtonLink>
            <ButtonLink href="/admin/affiliates/plans/footprintshub-7-level/levels" variant="secondary">
              Edit levels
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-lg font-semibold">Templates</h2>
          <div className="mt-4 grid gap-3">
            {templates.map(([name, description]) => (
              <div key={name} className="rounded-md border border-black/10 p-3">
                <p className="font-medium">{name}</p>
                <p className="mt-1 text-xs leading-5 text-black/55">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-black/10 bg-white p-5">
        <h2 className="text-lg font-semibold">Current level preview</h2>
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
