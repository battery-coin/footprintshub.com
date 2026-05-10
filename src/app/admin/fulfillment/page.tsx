import { AdminShell } from "@/components/admin/admin-shell";

const rows = [
  ["Default provider", "Manual fulfillment", "Enabled for MVP"],
  ["Future provider", "Printful / warehouse", "Scaffolded"],
  ["Tracking", "Carrier and tracking URL", "Ready in schema"],
];

export default function AdminFulfillmentPage() {
  return (
    <AdminShell>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Operations</p>
          <h1 className="mt-2 text-3xl font-semibold">Fulfillment</h1>
          <p className="mt-2 max-w-2xl text-sm text-black/60">
            Medusa-inspired fulfillment records are now separated from order status so shipments, providers, and
            tracking can evolve without disturbing checkout.
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
          {rows.map(([label, value, status]) => (
            <div key={label} className="grid gap-2 border-b border-black/10 p-4 text-sm last:border-b-0 md:grid-cols-3">
              <span className="font-medium">{label}</span>
              <span className="text-black/65">{value}</span>
              <span className="text-black/50">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
