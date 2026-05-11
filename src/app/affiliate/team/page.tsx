import { AffiliateShell } from "@/components/affiliate/affiliate-shell";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, isAdmin } from "@/lib/auth/roles";
import { getActiveAdminAffiliatePlan } from "@/lib/affiliate/plan-builder";
import { getStructureEngineNotice } from "@/lib/affiliate/structure-templates";
import { formatBpsAsPercent } from "@/lib/money/percentage-bps";

export default async function AffiliateTeamPage() {
  const activePlan = await getActiveAdminAffiliatePlan();
  const showAdminTools = isAdmin(getCurrentUser());

  return (
    <AffiliateShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Ambassador network</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Network commissions are capped, auditable, and paid only on qualified purchases. No commission is paid for recruitment alone.
          </p>
        </div>
        <Badge className={activePlan.engineStatus === "functional" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}>
          {activePlan.structureType} - {activePlan.engineStatus}
        </Badge>
      </div>

      {showAdminTools ? (
        <section className="mt-6 rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-lg font-semibold">Owner/admin plan tools</h2>
          <p className="mt-2 text-sm leading-6 text-black/60">
            The team page stays affiliate-facing. Structure selection, labels, percentages, caps, and activation live in admin.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href="/admin/affiliates/plans" variant="secondary">Manage Plans</ButtonLink>
            <ButtonLink href="/admin/affiliates/structures" variant="secondary">Choose Structure</ButtonLink>
            <ButtonLink href={`/admin/affiliates/plans/${activePlan.id}/levels`} variant="secondary">Edit Active Plan Levels</ButtonLink>
            <ButtonLink href={`/admin/affiliates/plans/${activePlan.id}/preview`} variant="secondary">Active Plan Preview</ButtonLink>
          </div>
        </section>
      ) : null}

      <section className="mt-6 rounded-lg border border-black/10 bg-white p-5">
        <h2 className="text-lg font-semibold">Active structure view</h2>
        <p className="mt-2 text-sm leading-6 text-black/60">{getStructureEngineNotice(activePlan.structureType)}</p>
        <div className="mt-5 grid gap-3">
          {activePlan.levels.map((level) => (
            <div key={level.levelDepth} className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-4">
              <div>
                <span className="font-medium">{level.label}</span>
                <p className="text-xs text-black/45">Level {level.levelDepth} - {level.commissionBase.replaceAll("_", " ")}</p>
              </div>
              <span className="font-semibold">{formatBpsAsPercent(level.percentageBps)}</span>
            </div>
          ))}
        </div>
      </section>
    </AffiliateShell>
  );
}
