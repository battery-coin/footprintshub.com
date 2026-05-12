import { AdminShell } from "@/components/admin/admin-shell";
import { TokenAssetEditor } from "@/components/admin/token-asset-editor";
import { listTokenAssets } from "@/lib/payments/payment-policy";

export default async function TokenSettingsPage() {
  const assets = await listTokenAssets();

  return (
    <AdminShell requiredPermission="canManageFunds">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Payments</p>
        <h1 className="mt-3 text-4xl font-semibold">Token payment assets</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/60">
          Configure public token metadata for utility token payment policies. Do not store private keys, seed phrases, or payout credentials.
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <TokenAssetEditor />
          <aside className="h-fit rounded-lg border border-black/10 bg-white p-5">
            <h2 className="text-lg font-semibold">Configured assets</h2>
            <div className="mt-4 grid gap-3">
              {assets.map((asset) => (
                <div key={asset.id} className="rounded-md border border-black/10 p-3 text-sm">
                  <p className="font-semibold">{asset.name} ({asset.symbol})</p>
                  <p className="text-black/60">{asset.chain}</p>
                  <p className={asset.enabled ? "text-emerald-700" : "text-amber-700"}>{asset.enabled ? "Enabled" : "Configured only"}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}
