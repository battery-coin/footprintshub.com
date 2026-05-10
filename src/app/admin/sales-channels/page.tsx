import { AdminShell } from "@/components/admin/admin-shell";
import { EditRowLink } from "@/components/admin/edit-row-link";

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
            <div key={channel} className="flex items-center justify-between gap-3 rounded-lg border border-black/10 bg-white p-4 text-sm font-medium">
              <span>{channel}</span>
              <EditRowLink href={`/admin/sales-channels?edit=${encodeURIComponent(channel.toLowerCase().replaceAll(" ", "-"))}`} />
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
