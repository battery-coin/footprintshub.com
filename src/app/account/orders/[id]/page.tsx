export default async function AccountOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Order detail</h1>
      <p className="mt-2 font-mono text-sm text-black/50">{id}</p>
      <p className="mt-3 text-sm leading-6 text-black/60">
        Shows customer-visible history, downloads, shipments, returns, and reorder actions after auth is connected.
      </p>
    </main>
  );
}
