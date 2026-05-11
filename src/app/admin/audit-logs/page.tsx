import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminAuditLogsPage() {
  return (
    <AdminShell requiredPermission="canViewAuditLogs">
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Security</p>
          <h1 className="mt-2 text-3xl font-semibold">Audit Logs</h1>
          <p className="mt-2 max-w-2xl text-sm text-black/60">
            Admin changes, payout actions, commission overrides, webhook processing, and security-sensitive operations
            should write shop-scoped audit records.
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5 text-sm text-black/60">
          Audit log storage already exists in the schema. The next production phase should connect each mutating admin
          action to the audit-log service.
        </div>
      </div>
    </AdminShell>
  );
}

