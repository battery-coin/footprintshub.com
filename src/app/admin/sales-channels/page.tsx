import { AdminShell } from "@/components/admin/admin-shell";

const channels = ["FootprintsHub Online Store", "Hero Studio Marketplace", "Creator Subdomain Shops", "Campaign Pages"];

export default function AdminSalesChannelsPage() {
  return (
    <AdminShell>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Catalog</p>
          <h1 className="mt-2 text-3xl font-semibold">Sales Channels</h1>
          <p className="mt-2 max-w-2xl text-sm text-black/60">
            Sales channels control where products appear without creating duplicate products for each shop surface.
          </p>
        </div>
        <div className="grid gap-3">
          {channels.map((channel) => (
            <div key={channel} className="rounded-lg border border-black/10 bg-white p-4 text-sm font-medium">
              {channel}
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
