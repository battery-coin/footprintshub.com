import { AccessDenied } from "@/components/auth/AccessDenied";
import { getCurrentPermissionContext } from "@/lib/auth/current-user";
import { hasPermission } from "@/lib/auth/permissions";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/prisma";

export default async function OwnerAuditLogsPage() {
  const context = await getCurrentPermissionContext();

  if (!hasPermission(context, "canViewAuditLogs")) {
    return <AccessDenied requiredPermission="canViewAuditLogs" currentRoles={context.roles ?? []} />;
  }

  const logs = hasDatabaseUrl()
    ? await getPrisma().auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 }).catch(() => [])
    : [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">Owner control</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">Audit logs</h1>
      <div className="mt-8 overflow-hidden rounded-lg border border-black/10 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-black/[0.03] text-xs uppercase tracking-[0.14em] text-black/45">
            <tr>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3 font-medium text-black">{log.action}</td>
                <td className="px-4 py-3 text-black/65">{log.category ?? "general"}</td>
                <td className="px-4 py-3 text-black/65">{[log.targetType, log.targetId].filter(Boolean).join(": ") || "None"}</td>
                <td className="px-4 py-3 text-black/65">{log.actorId ?? "system"}</td>
                <td className="px-4 py-3 text-black/65">{log.createdAt.toISOString()}</td>
              </tr>
            ))}
            {!logs.length ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-black/55">
                  No audit logs yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
