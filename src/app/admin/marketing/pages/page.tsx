import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminInformationPagesPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-semibold">Information pages</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
        Manage shop-specific legal, delivery, returns, contact, and creator responsibility pages without changing code.
      </p>
    </AdminShell>
  );
}
