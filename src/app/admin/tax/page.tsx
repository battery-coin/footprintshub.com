import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminTaxPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Tax</h1>
      <div className="mt-6 rounded-lg border border-black/10 bg-white p-6">
        <p className="text-sm leading-6 text-black/60">
          Tax classes and a conservative calculation placeholder are in place. Do not claim tax accuracy until Stripe Tax
          or a reviewed tax provider is configured.
        </p>
      </div>
    </AdminShell>
  );
}
