import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/ui/status-badge";

const legalRoutes = [
  "/legal/terms",
  "/legal/privacy",
  "/legal/refunds",
  "/legal/shipping",
  "/legal/preorders",
  "/legal/digital-goods",
  "/legal/digital-downloads",
  "/legal/download-license",
  "/legal/subscriptions",
  "/legal/membership-terms",
  "/legal/services",
  "/legal/nft-digital-collectibles",
  "/legal/affiliate-terms",
  "/legal/affiliate-disclosure",
  "/legal/ambassador-program-rules",
  "/legal/fan-club-disclaimer",
  "/legal/blind-box-odds",
  "/legal/printful-fulfillment",
  "/legal/store-credit",
  "/legal/crypto-payments",
  "/legal/advertising-terms",
  "/legal/sponsorship-terms",
  "/legal/ad-content-policy",
  "/legal/ad-refunds",
];

export default function AdminLegalSettingsPage() {
  return (
    <AdminShell requiredPermission="canManageShopSettings">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold">Legal page readiness</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/60">
          Legal copy is launch-ready as operational guidance but still needs final counsel review before public paid traffic.
        </p>
        <div className="mt-8 grid gap-3">
          {legalRoutes.map((href) => (
            <Link key={href} href={href} className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-4">
              <span className="font-medium capitalize">{href.split("/").pop()?.replaceAll("-", " ")}</span>
              <StatusBadge tone="good">Route exists</StatusBadge>
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}


