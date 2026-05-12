export default function AccountDownloadsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Downloads</h1>
      <p className="mt-3 text-black/60">
        Secure digital downloads appear here after a qualified purchase is fully paid. Download links use private tokens and may expire or have download limits.
      </p>
      <div className="mt-8 rounded-lg border border-black/10 bg-white p-6">
        <h2 className="font-semibold">No downloads found</h2>
        <p className="mt-2 text-sm text-black/55">Sign in or use your order link to view active download entitlements.</p>
      </div>
    </main>
  );
}
