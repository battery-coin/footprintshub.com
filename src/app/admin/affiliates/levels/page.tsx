import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { PlanLevelsEditor } from "@/components/admin/affiliate-structure-actions";
import { ButtonLink } from "@/components/ui/button";
import { getActiveAdminAffiliatePlan } from "@/lib/affiliate/plan-builder";

export default async function AdminAffiliateLevelsPage() {
  const plan = await getActiveAdminAffiliatePlan();

  return (
    <AffiliateAdminPage title="7-level ambassador settings">
      <div className="mb-5 rounded-lg border border-black/10 bg-white p-5">
        <h2 className="text-lg font-semibold">Active plan level editor</h2>
        <p className="mt-2 text-sm leading-6 text-black/60">
          This page edits the currently active/default affiliate structure. Labels, enabled flags, percentages, commission bases, and caps persist through the plan-level API.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href="/admin/affiliates/structures" variant="secondary">Choose Structure</ButtonLink>
          <ButtonLink href={`/admin/affiliates/plans/${plan.id}`} variant="secondary">Open Active Plan</ButtonLink>
          <ButtonLink href={`/admin/affiliates/plans/${plan.id}/preview`} variant="secondary">Preview Plan</ButtonLink>
        </div>
      </div>
      <PlanLevelsEditor plan={plan} endpoint="/api/admin/affiliates/active-plan/levels" />
    </AffiliateAdminPage>
  );
}
