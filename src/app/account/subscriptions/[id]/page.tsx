export default async function AccountSubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Subscription</h1>
      <p className="mt-3 text-black/60">Subscription ID: {id}</p>
      <div className="mt-8 rounded-lg border border-black/10 bg-white p-6">
        <h2 className="font-semibold">Subscription details require account access</h2>
        <p className="mt-2 text-sm text-black/55">Status and cancellation tools will display after authentication and Stripe portal setup are connected.</p>
      </div>
    </main>
  );
}
