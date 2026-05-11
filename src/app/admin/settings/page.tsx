import { AdminShell } from "@/components/admin/admin-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

const settingsSections = [
  { href: "/admin/settings/payments", title: "Payments", detail: "Stripe Checkout, webhook signature, crypto flag, and provider status." },
  { href: "/admin/settings/shipping", title: "Shipping", detail: "Flat-rate shipping, free-shipping threshold, Printful handoff, and digital-only checkout rules." },
  { href: "/admin/settings/legal", title: "Legal", detail: "Terms, refunds, shipping, digital goods, affiliate rules, and blind box disclosures." },
  { href: "/admin/printful", title: "Printful", detail: "Print-on-demand credentials, product mapping policy, and paid-order submission readiness." },
  { href: "/admin/affiliates", title: "Affiliate program", detail: "Applications, rules, payouts, and the 7-level ambassador commission configuration." },
  { href: "/admin/security", title: "Security", detail: "Admin secret, webhook protection, audit logs, and production hardening checks." },
];

export default function AdminSettingsPage() {
  return (
    <AdminShell requiredPermission="canManageShopSettings">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Settings</p>
        <h1 className="mt-3 text-4xl font-semibold">Store settings</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/60">
          The control panel keeps launch-critical settings visible while advanced commerce features stay grouped behind focused setup pages.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {settingsSections.map((section) => (
            <Card key={section.href}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-black/60">{section.detail}</p>
                </div>
                <StatusBadge>Review</StatusBadge>
              </div>
              <div className="mt-5">
                <ButtonLink href={section.href} variant="secondary">Open settings</ButtonLink>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}


