import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { StructureSettingsForm } from "@/components/admin/affiliate-structure-actions";
import { getAdminAffiliatePlan } from "@/lib/affiliate/plan-builder";
import { getAffiliateStructureTemplate } from "@/lib/affiliate/structure-templates";

export default async function UnilevelPlanSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await getAdminAffiliatePlan(id);
  const template = getAffiliateStructureTemplate("unilevel")!;
  const config = template.defaultConfig as Record<string, string | number | boolean>;

  return (
    <AffiliateAdminPage title="Unilevel structure settings">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <StructureSettingsForm
          planId={plan?.id ?? id}
          structureType="unilevel"
          fields={[
            { name: "unlimitedFrontline", label: "Unlimited frontline", value: config.unlimitedFrontline, type: "checkbox" },
            { name: "maxDepth", label: "Max depth", value: config.maxDepth, type: "number" },
            { name: "compressionBehavior", label: "Compression behavior", value: config.compressionBehavior },
          ]}
        />
        <aside className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-900/75">
          Unilevel purchase commissions are supported by the current closure-table commission engine. Owner-edited level labels and percentages feed the active plan configuration.
        </aside>
      </div>
    </AffiliateAdminPage>
  );
}
