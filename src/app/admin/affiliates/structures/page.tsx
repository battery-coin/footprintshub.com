import { Badge } from "@/components/ui/badge";
import { AffiliateAdminPage } from "@/components/admin/affiliate-admin-page";
import { UseStructureTemplateButton } from "@/components/admin/affiliate-structure-actions";
import { affiliateStructureTemplates } from "@/lib/affiliate/structure-templates";
import { formatBpsAsPercent } from "@/lib/money/percentage-bps";

export default function AdminAffiliateStructuresPage() {
  return (
    <AffiliateAdminPage title="Choose commission structure">
      <div className="grid gap-5 lg:grid-cols-3">
        {affiliateStructureTemplates.map((template) => (
          <section key={template.key} className="grid gap-5 rounded-lg border border-black/10 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{template.name}</h2>
                <p className="mt-2 text-sm leading-6 text-black/60">{template.description}</p>
              </div>
              <Badge className={template.engineStatus === "functional" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}>
                {template.engineStatus}
              </Badge>
            </div>

            <StructureDiagram structureType={template.structureType} />

            <div className="grid gap-2 text-sm">
              <p>
                <span className="font-semibold">Best use:</span> {template.bestUseCase}
              </p>
              <p>
                <span className="font-semibold">Complexity:</span> {template.complexity}
              </p>
              <p className="text-black/60">
                Commissions are paid only on qualified purchases. No commission is paid for recruitment alone.
              </p>
            </div>

            <div className="rounded-md bg-black/[0.03] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Default rates</p>
              <div className="mt-3 grid gap-2">
                {template.defaultLevels.slice(0, 4).map((level) => (
                  <div key={level.levelDepth} className="flex items-center justify-between text-sm">
                    <span>{level.label}</span>
                    <span className="font-semibold">
                      {level.percentageBps ? formatBpsAsPercent(level.percentageBps) : `$${((level.fixedCents ?? 0) / 100).toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <UseStructureTemplateButton templateKey={template.key} />
          </section>
        ))}
      </div>
    </AffiliateAdminPage>
  );
}

function StructureDiagram({ structureType }: { structureType: string }) {
  if (structureType === "binary") {
    return (
      <div className="grid gap-3 rounded-lg bg-black p-4 text-white">
        <div className="mx-auto rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">Affiliate</div>
        <div className="grid grid-cols-2 gap-3 text-center text-sm">
          <div className="rounded-md border border-white/15 p-3">Left Team</div>
          <div className="rounded-md border border-white/15 p-3">Right Team</div>
        </div>
        <p className="text-center text-xs text-white/55">Weaker-leg or pair settings preview</p>
      </div>
    );
  }

  if (structureType === "matrix") {
    return (
      <div className="grid gap-2 rounded-lg bg-black p-4 text-white">
        {[0, 1, 2].map((row) => (
          <div key={row} className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((column) => (
              <div key={column} className="rounded-md border border-white/15 p-3 text-center text-xs">
                L{row + 1}
              </div>
            ))}
          </div>
        ))}
        <p className="text-center text-xs text-white/55">3 x 7 default grid</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 rounded-lg bg-black p-4 text-white">
      <div className="rounded-md border border-white/15 p-3 text-center text-sm">Unlimited frontline</div>
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {[1, 2, 3, 4, 5, 6, 7].map((level) => (
          <div key={level} className="rounded-md border border-white/15 p-2">
            L{level}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-white/55">Recommended launch structure</p>
    </div>
  );
}
