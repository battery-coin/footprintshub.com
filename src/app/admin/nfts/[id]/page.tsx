import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminNftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AdminShell requiredPermission="canManageNFTProducts">
      <div className="grid gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Digital collectible</p>
          <h1 className="text-3xl font-semibold">{id}</h1>
        </div>
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="font-semibold">Claim or certificate details</h2>
          <p className="mt-2 text-sm text-black/55">Use access, provenance, digital twin, certificate, and claim language. Do not use investment or resale-value language.</p>
        </section>
      </div>
    </AdminShell>
  );
}
