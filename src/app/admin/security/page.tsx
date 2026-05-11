import { AdminShell } from "@/components/admin/admin-shell";

const items = [
  "Admin secret gate is active for protected APIs.",
  "Stripe webhooks verify signatures and record idempotency.",
  "Admin audit log schema and writer are available.",
  "Affiliate fraud helpers hash IPs instead of storing raw IPs.",
  "CSP and production WAF settings are documented for Cloudflare.",
];

export default function AdminSecurityPage() {
  return (
    <AdminShell requiredPermission="canManageSecurity">
      <h1 className="text-3xl font-semibold">Security</h1>
      <div className="mt-6 grid gap-3">
        {items.map((item) => (
          <div key={item} className="rounded-lg border border-black/10 bg-white p-4 text-sm text-black/65">
            {item}
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

