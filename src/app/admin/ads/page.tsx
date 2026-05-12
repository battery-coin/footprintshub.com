import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export default async function AdminAdsPage() {
  const counts = await getCounts();
  return (
    <AdminShell requiredPermission="canManageAds">
      <div className="grid gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Ad sales</p>
          <h1 className="text-3xl font-semibold">Ads control panel</h1>
          <p className="mt-2 text-black/60">Review, approve, schedule, pause, and report on purchased ad campaigns.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <Metric label="Pending review" value={counts.pending} />
          <Metric label="Live" value={counts.live} />
          <Metric label="Completed" value={counts.completed} />
          <Metric label="Rejected" value={counts.rejected} />
        </div>
        <nav className="grid gap-3 sm:grid-cols-3">
          {[
            ["/admin/ads/campaigns", "Campaigns"],
            ["/admin/ads/placements", "Placements"],
            ["/admin/ads/packages", "Packages"],
            ["/admin/ads/creatives", "Creatives"],
            ["/admin/ads/schedule", "Schedule"],
            ["/admin/ads/reports", "Reports"],
            ["/admin/ads/settings", "Settings"],
          ].map(([href, label]) => <Link key={href} href={href} className="rounded-lg border border-black/10 bg-white p-4 font-medium hover:bg-black/[0.03]">{label}</Link>)}
        </nav>
      </div>
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-lg border border-black/10 bg-white p-5"><p className="text-sm text-black/55">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>;
}

async function getCounts() {
  if (!hasDatabaseUrl()) return { pending: 0, live: 0, completed: 0, rejected: 0 };
  try {
    const prisma = getPrisma();
    const [pending, live, completed, rejected] = await Promise.all([
      prisma.adCampaign.count({ where: { status: { in: ["pending_creative", "pending_review"] } } }),
      prisma.adCampaign.count({ where: { status: "live" } }),
      prisma.adCampaign.count({ where: { status: "completed" } }),
      prisma.adCampaign.count({ where: { status: "rejected" } }),
    ]);
    return { pending, live, completed, rejected };
  } catch {
    return { pending: 0, live: 0, completed: 0, rejected: 0 };
  }
}
