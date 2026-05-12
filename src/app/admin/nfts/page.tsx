import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminNftsPage() {
  return (
    <AdminShell requiredPermission="canManageNFTProducts">
      <div className="grid gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Digital collectibles</p>
          <h1 className="text-3xl font-semibold">NFT-linked products</h1>
          <p className="mt-2 text-black/60">Manage claim-based digital collectibles, offchain certificates, and digital twin records.</p>
        </div>
        <section className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="font-semibold">Manual claim flow active</h2>
          <p className="mt-2 text-sm text-black/55">Automatic minting is not enabled. Never store private keys or seed phrases in FootprintsHub.</p>
        </section>
      </div>
    </AdminShell>
  );
}
