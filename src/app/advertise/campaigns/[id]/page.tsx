import Link from "next/link";

export default async function AdvertiseCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-semibold">Ad campaign</h1>
      <p className="mt-3 text-black/60">Campaign ID: {id}</p>
      <div className="mt-8 grid gap-5 rounded-lg border border-black/10 bg-white p-6">
        <h2 className="font-semibold">Creative review status</h2>
        <p className="text-sm text-black/55">Campaigns start as pending creative or pending review. Approved campaigns can be scheduled by an ads manager.</p>
        <Link href={`/advertise/campaigns/${id}/creative`} className="inline-flex w-fit rounded-md bg-black px-4 py-2 text-sm font-medium text-white">Submit creative</Link>
      </div>
    </main>
  );
}
