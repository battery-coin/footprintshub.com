import Link from "next/link";

export default function AdvertiseCampaignsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl font-semibold">Advertiser campaigns</h1>
      <p className="mt-4 text-black/60">Purchased ad campaigns appear here after payment is verified. Use the campaign link from your receipt or admin team to submit creative.</p>
      <div className="mt-8 rounded-lg border border-black/10 bg-white p-6">
        <h2 className="font-semibold">Need to submit creative?</h2>
        <p className="mt-2 text-sm text-black/55">Open a campaign detail link and use the creative submission form. Customer-authenticated campaign lists can be connected when account auth is finalized.</p>
        <Link href="/advertise/policy" className="mt-4 inline-flex text-sm font-medium underline">Review ad policy</Link>
      </div>
    </main>
  );
}
