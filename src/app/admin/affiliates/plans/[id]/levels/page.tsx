import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { PlanLevelsEditor } from "@/components/admin/affiliate-structure-actions";
import { getAdminAffiliatePlan } from "@/lib/affiliate/plan-builder";

export default async function AffiliatePlanLevelsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await getAdminAffiliatePlan(id);

  if (!plan) {
    return (
      <AffiliateAdminPage title="Plan not found">
        <div className="rounded-lg border border-black/10 bg-white p-5">This affiliate plan could not be loaded.</div>
      </AffiliateAdminPage>
    );
  }

  return (
    <AffiliateAdminPage title={`${plan.name} levels`}>
      <PlanLevelsEditor plan={plan} />
    </AffiliateAdminPage>
  );
}
