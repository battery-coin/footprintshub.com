import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listAdminAffiliatePlans } from "@/lib/affiliate/plan-builder";
import { affiliateStructureTemplates } from "@/lib/affiliate/structure-templates";
import { formatBpsAsPercent } from "@/lib/money/percentage-bps";

export default async function AdminAffiliatePlansPage() {
  const plans = await listAdminAffiliatePlans();

  return (
    <AffiliateAdminPage title="Affiliate plans">
      <div className="grid gap-5">
        {plans.map((plan) => (
          <section key={plan.id} className="rounded-lg border border-black/10 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-black/60">{plan.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>{plan.structureType}</Badge>
                <Badge className={plan.engineStatus === "functional" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}>
                  {plan.engineStatus}
                </Badge>
                <Badge>{plan.status}</Badge>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <Metric label="Cookie" value={`${plan.cookieDays} days`} />
              <Metric label="Hold" value={`${plan.holdDays} days`} />
              <Metric label="Max pool" value={plan.maxCommissionPoolBps ? formatBpsAsPercent(plan.maxCommissionPoolBps) : "No cap"} />
              <Metric label="Active levels" value={String(plan.maxActiveLevels)} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href={`/admin/affiliates/plans/${plan.id}`}>Review plan</ButtonLink>
              <ButtonLink href={`/admin/affiliates/plans/${plan.id}/levels`} variant="secondary">
                Edit labels and rates
              </ButtonLink>
              <ButtonLink href={`/admin/affiliates/plans/${plan.id}/preview`} variant="secondary">
                Preview
              </ButtonLink>
            </div>
          </section>
        ))}

        <section className="rounded-lg border border-black/10 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Create from structure</h2>
              <p className="mt-2 text-sm text-black/60">Choose Binary, Matrix, or Unilevel from the owner structure selector.</p>
            </div>
            <ButtonLink href="/admin/affiliates/structures">Choose structure</ButtonLink>
          </div>
          <div className="mt-4 grid gap-3">
            {affiliateStructureTemplates.map((template) => (
              <div key={template.key} className="rounded-md border border-black/10 p-3">
                <p className="font-medium">{template.name}</p>
                <p className="mt-1 text-xs leading-5 text-black/55">{template.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AffiliateAdminPage>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-black/[0.03] p-3">
      <p className="text-xs text-black/55">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
