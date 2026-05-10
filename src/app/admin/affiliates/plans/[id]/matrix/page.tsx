import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { StructureSettingsForm } from "@/components/admin/affiliate-structure-actions";
import { getAdminAffiliatePlan } from "@/lib/affiliate/plan-builder";
import { getAffiliateStructureTemplate } from "@/lib/affiliate/structure-templates";

export default async function MatrixPlanSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await getAdminAffiliatePlan(id);
  const template = getAffiliateStructureTemplate("matrix")!;
  const config = template.defaultConfig as Record<string, string | number | boolean>;

  return (
    <AffiliateAdminPage title="Matrix structure settings">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <StructureSettingsForm
          planId={plan?.id ?? id}
          structureType="matrix"
          fields={[
            { name: "width", label: "Matrix width", value: config.width, type: "number" },
            { name: "depth", label: "Matrix depth", value: config.depth, type: "number" },
            { name: "spilloverMode", label: "Spillover mode", value: config.spilloverMode },
            { name: "levelCommissionMode", label: "Level commission mode", value: config.levelCommissionMode },
            { name: "completionBonusEnabled", label: "Completion bonus enabled", value: config.completionBonusEnabled, type: "checkbox" },
            { name: "completionBonusCents", label: "Completion bonus cents", value: config.completionBonusCents ?? 0, type: "number" },
          ]}
        />
        <aside className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900/75">
          Matrix payout execution is scaffolded. The owner can configure width, depth, spillover mode, and level rates, but live payout execution remains disabled until placement logic is hardened.
        </aside>
      </div>
    </AffiliateAdminPage>
  );
}
