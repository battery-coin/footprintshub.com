import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminOrdersPage() {
  return (
    <AdminShell requiredPermission="canViewOrders">
      <h1 className="text-3xl font-semibold">Orders</h1>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-6">
        <p className="text-sm leading-6 text-black/60">
          Orders will populate after Stripe Checkout sessions and webhooks are connected to Neon.
        </p>
      </div>
    </AdminShell>
  );
}

