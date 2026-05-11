import { AdminShell } from "@/components/admin/admin-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AdminShell requiredPermission="canManageCustomers">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Customer detail</p>
        <h1 className="mt-3 text-3xl font-semibold">Customer {id}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">
          Customer profile controls are ready for notes, tags, support status, order history, and affiliate attribution context.
        </p>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
          <Card>
            <h2 className="text-xl font-semibold">Editable profile notes</h2>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1 text-sm font-medium">
                Display name
                <input className="min-h-10 rounded-md border border-black/15 px-3" placeholder="Customer name" />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Tags
                <input className="min-h-10 rounded-md border border-black/15 px-3" placeholder="vip, supporter, creator-fan" />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Admin note
                <textarea className="min-h-28 rounded-md border border-black/15 px-3 py-2" placeholder="Support notes stay internal." />
              </label>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">Customer actions</h2>
            <p className="mt-2 text-sm leading-6 text-black/60">
              Full customer editing persists through the customer profile API when customer auth is connected.
            </p>
            <div className="mt-5 grid gap-3">
              <ButtonLink href="/admin/customers" variant="secondary">Back to customers</ButtonLink>
              <ButtonLink href="/admin/orders" variant="secondary">View orders</ButtonLink>
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

