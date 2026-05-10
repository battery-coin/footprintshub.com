import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminShippingPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Shipping</h1>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-6">
        <p className="text-sm leading-6 text-black/60">
          Shipping is scaffolded for digital no-shipping products, flat rate, free shipping thresholds, local pickup, and
          future fulfillment provider integrations.
        </p>
      </div>
    </AdminShell>
  );
}
