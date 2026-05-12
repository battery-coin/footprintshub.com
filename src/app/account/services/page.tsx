export default function AccountServicesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Services</h1>
      <p className="mt-3 text-black/60">Service orders show scheduling, briefs, delivery status, and next steps after verified payment.</p>
      <div className="mt-8 rounded-lg border border-black/10 bg-white p-6">
        <h2 className="font-semibold">No service orders yet</h2>
        <p className="mt-2 text-sm text-black/55">Purchased services will appear here once checkout is complete.</p>
      </div>
    </main>
  );
}
