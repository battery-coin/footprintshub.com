import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { StructureSettingsForm } from "@/components/admin/affiliate-structure-actions";
import { ButtonLink } from "@/components/ui/button";
import { getAdminAffiliatePlan } from "@/lib/affiliate/plan-builder";
import { getAffiliateStructureTemplate, type MatrixStructureConfig } from "@/lib/affiliate/structure-templates";

export default async function MatrixPlanSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await getAdminAffiliatePlan(id);
  const template = getAffiliateStructureTemplate("matrix")!;
  const config = { ...(template.defaultConfig as MatrixStructureConfig), ...(plan?.matrixConfig ?? {}) };

  return (
    <AffiliateAdminPage title="Matrix structure settings">
      <div className="mb-5 flex flex-wrap gap-3">
        <ButtonLink href={`/admin/affiliates/plans/${plan?.id ?? id}`} variant="secondary">Plan overview</ButtonLink>
        <ButtonLink href={`/admin/affiliates/plans/${plan?.id ?? id}/levels`} variant="secondary">Edit levels</ButtonLink>
        <ButtonLink href="/admin/affiliates/structures" variant="secondary">Choose structure</ButtonLink>
      </div>
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
        <aside className="rounded-lg border border-sky-200 bg-sky-50 p-5 text-sm leading-6 text-sky-900/75">
          Matrix configuration is functional: width, depth, spillover mode, completion bonus, and level commission mode save to the database. Payout execution should be activated only after owner review of matrix placement rules.
        </aside>
      </div>
    </AffiliateAdminPage>
  );
}
