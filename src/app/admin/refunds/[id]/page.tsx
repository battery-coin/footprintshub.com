import { AdminShell } from "@/components/admin/admin-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function AdminRefundDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AdminShell requiredPermission="canManageRefunds">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Refund detail</p>
        <h1 className="mt-3 text-3xl font-semibold">Refund {id}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">
          Review refund reason, restock behavior, payment reversal status, and affiliate commission reversal impact before taking action.
        </p>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
          <Card>
            <h2 className="text-xl font-semibold">Editable refund review</h2>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1 text-sm font-medium">
                Reason
                <textarea className="min-h-28 rounded-md border border-black/15 px-3 py-2" defaultValue="Customer refund request pending admin review." />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Admin note
                <textarea className="min-h-24 rounded-md border border-black/15 px-3 py-2" placeholder="Internal note for audit trail" />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" /> Restock eligible physical items after approval
              </label>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">Actions</h2>
            <p className="mt-2 text-sm leading-6 text-black/60">
              Stripe refund execution and inventory restock should run through the refund API after payment provider credentials are configured.
            </p>
            <div className="mt-5 grid gap-3">
              <ButtonLink href="/admin/refunds" variant="secondary">Back to refunds</ButtonLink>
              <ButtonLink href="/admin/orders" variant="secondary">Find order</ButtonLink>
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

