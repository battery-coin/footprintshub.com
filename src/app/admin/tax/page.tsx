import { AdminShell } from "@/components/admin/admin-shell";
import { EditRowLink } from "@/components/admin/edit-row-link";

export default function AdminTaxPage() {
  return (
    <AdminShell requiredPermission="canManageTax">
      <h1 className="text-3xl font-semibold">Tax</h1>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-6">
        <p className="text-sm leading-6 text-black/60">
          Tax classes and a conservative calculation placeholder are in place. Do not claim tax accuracy until Stripe Tax
          or a reviewed tax provider is configured.
        </p>
        <div className="mt-5 grid gap-3">
          {["Tax classes", "Tax rates", "Stripe Tax readiness"].map((row) => (
            <div key={row} className="flex items-center justify-between rounded-md bg-black/[0.03] p-3">
              <span className="text-sm font-medium">{row}</span>
              <EditRowLink href={`/admin/tax?edit=${encodeURIComponent(row.toLowerCase().replaceAll(" ", "-"))}`} />
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

