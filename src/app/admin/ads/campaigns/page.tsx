import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export default async function AdminAdCampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <AdminShell requiredPermission="canManageAds">
      <div className="grid gap-6">
        <h1 className="text-3xl font-semibold">Ad campaigns</h1>
        <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
          {campaigns.length ? campaigns.map((campaign) => (
            <Link key={campaign.id} href={`/admin/ads/campaigns/${campaign.id}`} className="grid gap-1 border-b border-black/5 p-4 hover:bg-black/[0.03]">
              <span className="font-medium">{campaign.title}</span>
              <span className="text-sm text-black/55">{campaign.status} - {campaign.advertiserEmail}</span>
            </Link>
          )) : <p className="p-5 text-sm text-black/55">No campaigns yet. Paid ad orders create campaigns automatically.</p>}
        </div>
      </div>
    </AdminShell>
  );
}

async function getCampaigns() {
  if (!hasDatabaseUrl()) return [];
  try {
    return await getPrisma().adCampaign.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  } catch {
    return [];
  }
}
