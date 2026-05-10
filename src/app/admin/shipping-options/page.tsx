import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminShippingOptionsPage() {
  return (
    <AdminShell>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Regions</p>
          <h1 className="mt-2 text-3xl font-semibold">Shipping Options</h1>
          <p className="mt-2 max-w-2xl text-sm text-black/60">
            Shop-scoped shipping options can attach to market regions and fulfillment providers. The launch default is
            flat US shipping plus digital delivery.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Standard shipping", "$7.99", "Physical products"],
            ["Digital delivery", "$0.00", "Digital unlocks and memberships"],
          ].map(([name, price, note]) => (
            <div key={name} className="rounded-lg border border-black/10 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold">{name}</h2>
                <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">{price}</span>
              </div>
              <p className="mt-3 text-sm text-black/60">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
