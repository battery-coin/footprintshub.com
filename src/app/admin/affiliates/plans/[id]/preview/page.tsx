import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { Badge } from "@/components/ui/badge";
import { getAdminAffiliatePlan, previewPlan } from "@/lib/affiliate/plan-builder";
import { getStructureEngineNotice } from "@/lib/affiliate/structure-templates";

export default async function AffiliatePlanPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await getAdminAffiliatePlan(id);

  if (!plan) {
    return (
      <AffiliateAdminPage title="Plan preview">
        <div className="rounded-lg border border-black/10 bg-white p-5">Plan not found.</div>
      </AffiliateAdminPage>
    );
  }

  const example = previewPlan(plan);

  return (
    <AffiliateAdminPage title={`${plan.name} preview`}>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-black/10 bg-white p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{plan.structureType}</Badge>
            <Badge className={plan.engineStatus === "functional" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}>
              {plan.engineStatus}
            </Badge>
          </div>
          <StructurePreview type={plan.structureType} />
          <p className="mt-5 text-sm leading-6 text-black/60">{getStructureEngineNotice(plan.structureType)}</p>
        </section>

        <section className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-lg font-semibold">Example calculator</h2>
          <p className="mt-2 text-sm leading-6 text-black/60">Example order subtotal: ${(example.subtotalCents / 100).toFixed(2)}</p>
          <div className="mt-4 grid gap-2">
            {example.levelRows.map((row) => (
              <div key={`${row.levelDepth}-${row.label}`} className="flex items-center justify-between rounded-md bg-black/[0.03] p-3 text-sm">
                <span>{row.label}</span>
                <span className="font-semibold">${(row.amountCents / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md bg-black p-4 text-white">
            <p className="text-xs text-white/55">Total preview</p>
            <p className="mt-1 text-2xl font-semibold">${(example.totalCents / 100).toFixed(2)}</p>
            <p className="mt-1 text-xs text-white/55">Default max pool: ${(example.maxPoolCents / 100).toFixed(2)}</p>
          </div>
        </section>
      </div>
    </AffiliateAdminPage>
  );
}

function StructurePreview({ type }: { type: string }) {
  if (type === "binary") {
    return (
      <div className="mt-5 rounded-lg bg-black p-6 text-white">
        <div className="mx-auto max-w-40 rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-black">Affiliate</div>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-md border border-white/15 p-5 text-center">Left Team</div>
          <div className="rounded-md border border-white/15 p-5 text-center">Right Team</div>
        </div>
      </div>
    );
  }

  if (type === "matrix") {
    return (
      <div className="mt-5 grid gap-3 rounded-lg bg-black p-6 text-white">
        {[1, 2, 3].map((level) => (
          <div key={level} className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((slot) => (
              <div key={slot} className="rounded-md border border-white/15 p-3 text-center text-sm">
                L{level}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-lg bg-black p-6 text-white">
      <div className="rounded-md border border-white/15 p-4 text-center">Unlimited frontline</div>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((level) => (
          <div key={level} className="rounded-md border border-white/15 p-2 text-center text-xs">
            L{level}
          </div>
        ))}
      </div>
    </div>
  );
}
