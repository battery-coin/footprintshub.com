export default async function AccountServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Service order</h1>
      <p className="mt-3 text-black/60">Service order ID: {id}</p>
      <div className="mt-8 rounded-lg border border-black/10 bg-white p-6">
        <h2 className="font-semibold">Service details require account access</h2>
        <p className="mt-2 text-sm text-black/55">Once customer authentication is connected, this page will show scheduling, briefs, and delivery notes.</p>
      </div>
    </main>
  );
}
