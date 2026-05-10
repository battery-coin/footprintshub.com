import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { defaultSevenLevelPlan } from "@/lib/affiliate/demo-data";

export default function AffiliatePlanLevelsPage() {
  return (
    <AffiliateAdminPage title="Plan level editor">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-xl font-semibold">0 through 7 paid levels</h2>
          <p className="mt-2 text-sm leading-6 text-black/60">
            Level 0 is the direct referring affiliate. Levels 1 through 7 are ancestor ambassadors. Every level is
            configurable, capped, and paid only from qualified purchases.
          </p>
          <div className="mt-5 grid gap-3">
            {defaultSevenLevelPlan.map((level) => (
              <div
                key={level.depth}
                className="grid gap-3 rounded-lg border border-black/10 p-4 sm:grid-cols-[110px_1fr_120px_150px]"
              >
                <span className="font-mono text-sm">Level {level.depth}</span>
                <span>{level.label}</span>
                <span className="font-semibold">{level.rate}</span>
                <span className="rounded-full bg-black/[0.04] px-3 py-1 text-center text-xs">pay_zero</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-lg font-semibold">Example calculator</h2>
          <p className="mt-2 text-sm leading-6 text-black/60">
            On a $100 qualified subtotal, the default pool cap is $20. The direct affiliate earns $10 and all seven
            ancestor levels together can fit within the remaining cap.
          </p>
          <div className="mt-4 rounded-md bg-black/[0.03] p-4">
            <p className="text-xs text-black/55">Default pool cap</p>
            <p className="mt-1 text-2xl font-semibold">$20.00</p>
          </div>
        </div>
      </div>
    </AffiliateAdminPage>
  );
}
