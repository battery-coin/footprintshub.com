import { CreativeSubmissionForm } from "@/components/ads/CreativeSubmissionForm";

export default async function AdvertiseCampaignCreativePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Creative submission</p>
      <h1 className="mt-3 text-4xl font-semibold">Submit ad creative</h1>
      <p className="mt-4 text-black/60">Upload URLs and copy for campaign `{id}`. The admin team reviews creative before anything goes live.</p>
      <div className="mt-8">
        <CreativeSubmissionForm campaignId={id} />
      </div>
    </main>
  );
}
