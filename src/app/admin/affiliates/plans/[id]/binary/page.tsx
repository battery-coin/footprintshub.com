import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { StructureSettingsForm } from "@/components/admin/affiliate-structure-actions";
import { getAdminAffiliatePlan } from "@/lib/affiliate/plan-builder";
import { getAffiliateStructureTemplate } from "@/lib/affiliate/structure-templates";

export default async function BinaryPlanSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await getAdminAffiliatePlan(id);
  const template = getAffiliateStructureTemplate("binary")!;
  const config = template.defaultConfig as Record<string, string | number | boolean>;

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
        <aside className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900/75">
          Binary payout execution is scaffolded. The owner can configure labels, weaker-leg basis, pair ratios, and caps, but live payout execution remains disabled until placement and volume rules are hardened.
        </aside>
      </div>
    </AffiliateAdminPage>
  );
}
