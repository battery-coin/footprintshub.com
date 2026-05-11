import { AdminShell } from "@/components/admin/admin-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Timeline } from "@/components/ui/timeline";

export default function AdminRefundsPage() {
  return (
    <AdminShell requiredPermission="canManageRefunds">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Refunds</p>
        <h1 className="mt-3 text-4xl font-semibold">Refund review</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/60">
          Refunds must coordinate Stripe status, inventory restock, Printful production state, digital access, and affiliate commission reversal.
        </p>
        <div className="mt-8">
          <EmptyState
            title="No refund requests yet"
            description="Paid orders will appear here when a refund is requested or created. Until Stripe credentials and DATABASE_URL are configured, refund actions remain in review mode."
            actionHref="/admin/orders"
            actionLabel="Review orders"
          />
        </div>
        <section className="mt-8 rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-2xl font-semibold">Refund workflow</h2>
          <div className="mt-5">
            <Timeline
              items={[
                { title: "Validate order", detail: "Confirm payment status, product type, fulfillment status, and refund eligibility." },
                { title: "Create provider refund", detail: "Send Stripe refund request from the server when configured and authorized." },
                { title: "Reverse commerce effects", detail: "Update refund status, restock if allowed, revoke digital access when policy permits, and reverse affiliate commissions." },
                { title: "Audit and notify", detail: "Write audit logs and notify customer, admin, and affected affiliates where applicable." },
              ]}
            />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}


