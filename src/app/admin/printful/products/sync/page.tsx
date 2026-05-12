import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { isPrintfulConfigured } from "@/lib/printful/printful-service";

export default function AdminPrintfulSyncPage() {
  const configured = isPrintfulConfigured();

  return (
    <AdminShell requiredPermission="canManagePrintful">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Printful</p>
        <h1 className="mt-3 text-4xl font-semibold">Product sync</h1>
        <div className="mt-5 rounded-lg border border-black/10 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Sync readiness</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
                The safe MVP uses explicit local mapping fields instead of overwriting products from Printful. A future sync can import Printful products after field mapping and overwrite rules are confirmed.
              </p>
            </div>
            <StatusBadge tone={configured ? "warn" : "danger"}>{configured ? "Manual mapping active" : "Credentials required"}</StatusBadge>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
