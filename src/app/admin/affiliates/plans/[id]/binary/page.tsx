import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { StructureSettingsForm } from "@/components/admin/affiliate-structure-actions";
import { getAdminAffiliatePlan } from "@/lib/affiliate/plan-builder";
import { getAffiliateStructureTemplate, type BinaryStructureConfig } from "@/lib/affiliate/structure-templates";

export default async function BinaryPlanSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await getAdminAffiliatePlan(id);
  const template = getAffiliateStructureTemplate("binary")!;
  const config = { ...(template.defaultConfig as BinaryStructureConfig), ...(plan?.binaryConfig ?? {}) };

  return (
    <AffiliateAdminPage title="Binary structure settings">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <StructureSettingsForm
          planId={plan?.id ?? id}
          structureType="binary"
          fields={[
            { name: "leftLabel", label: "Left team label", value: config.leftLabel },
            { name: "rightLabel", label: "Right team label", value: config.rightLabel },
            { name: "payoutBasis", label: "Payout basis", value: config.payoutBasis },
            { name: "pairRatioLeft", label: "Pair ratio left", value: config.pairRatioLeft, type: "number" },
            { name: "pairRatioRight", label: "Pair ratio right", value: config.pairRatioRight, type: "number" },
            { name: "pairCommissionBps", label: "Pair commission bps", value: config.pairCommissionBps ?? 1000, type: "number" },
            { name: "spilloverMode", label: "Spillover mode", value: config.spilloverMode },
            { name: "carryForwardVolume", label: "Carry forward volume", value: config.carryForwardVolume, type: "checkbox" },
            { name: "flushAfterPayout", label: "Flush after payout", value: config.flushAfterPayout, type: "checkbox" },
          ]}
        />
        <aside className="rounded-lg border border-sky-200 bg-sky-50 p-5 text-sm leading-6 text-sky-900/75">
          Binary configuration is functional: labels, weaker-leg basis, pair ratios, spillover mode, carry-forward volume, and caps save to the database. Payout execution should be activated only after owner review of placement and volume rules.
        </aside>
      </div>
    </AffiliateAdminPage>
  );
}
