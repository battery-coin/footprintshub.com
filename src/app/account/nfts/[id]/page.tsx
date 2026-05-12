export default async function AccountNftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Digital collectible claim</h1>
      <p className="mt-3 text-black/60">Claim ID: {id}</p>
      <div className="mt-8 rounded-lg border border-black/10 bg-white p-6">
        <h2 className="font-semibold">Claim details require account access</h2>
        <p className="mt-2 text-sm text-black/55">Wallet and claim details are shown only after the customer is authenticated.</p>
      </div>
    </main>
  );
}
