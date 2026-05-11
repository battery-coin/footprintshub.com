import { AdminShell } from "@/components/admin/admin-shell";

const events = [
  "cart.updated",
  "checkout.session_created",
  "order.paid",
  "inventory.deducted",
  "affiliate.commission_created",
  "digital_unlock.granted",
];

export default function AdminEventsPage() {
  return (
    <AdminShell requiredPermission="canManageSecurity">
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">System</p>
          <h1 className="mt-2 text-3xl font-semibold">Commerce Events</h1>
          <p className="mt-2 max-w-2xl text-sm text-black/60">
            Events are the outbox/subscriber layer for paid orders, inventory, affiliate commissions, digital unlocks,
            and future Hero Studio webhooks.
          </p>
        </div>
        <div className="grid gap-2">
          {events.map((event) => (
            <div key={event} className="rounded-lg border border-black/10 bg-white p-4 font-mono text-sm">
              {event}
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

