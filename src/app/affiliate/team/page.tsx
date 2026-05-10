import { AffiliateShell } from "@/components/affiliate/affiliate-shell";
import { defaultSevenLevelPlan } from "@/lib/affiliate/demo-data";

export default function AffiliateTeamPage() {
  return (
    <AffiliateShell>
      <h1 className="text-3xl font-semibold">Ambassador network</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
        Network commissions are capped, auditable, and paid only on qualified purchases. No commission is paid for recruitment alone.
      </p>
      <div className="mt-6 grid gap-3">
        {defaultSevenLevelPlan.map((level) => (
          <div key={level.depth} className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-4">
            <span>{level.label}</span>
            <span className="font-semibold">{level.rate}</span>
          </div>
        ))}
      </div>
    </AffiliateShell>
  );
}
