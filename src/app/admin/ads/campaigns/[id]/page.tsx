import { AdminShell } from "@/components/admin/admin-shell";
import { CampaignStatusForm } from "@/components/admin/ads/CampaignStatusForm";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export default async function AdminAdCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  return (
    <AdminShell requiredPermission="canManageAds">
      <div className="grid gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Campaign</p>
          <h1 className="text-3xl font-semibold">{campaign?.title ?? id}</h1>
          <p className="mt-2 text-black/60">{campaign ? `${campaign.status} - ${campaign.advertiserEmail}` : "Connect Neon to load campaign details."}</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <section className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="font-semibold">Creative preview</h2>
            {campaign?.creatives.length ? campaign.creatives.map((creative) => (
              <div key={creative.id} className="mt-4 rounded-md border border-black/10 p-4">
                <p className="font-medium">{creative.title ?? creative.type}</p>
                <p className="mt-1 text-sm text-black/55">{creative.status} - {creative.targetUrl}</p>
              </div>
            )) : <p className="mt-2 text-sm text-black/55">No creative submitted yet.</p>}
          </section>
          <CampaignStatusForm campaignId={id} />
        </div>
      </div>
    </AdminShell>
  );
}

async function getCampaign(id: string) {
  if (!hasDatabaseUrl()) return null;
  try {
    return await getPrisma().adCampaign.findUnique({ where: { id }, include: { creatives: true } });
  } catch {
    return null;
  }
}
