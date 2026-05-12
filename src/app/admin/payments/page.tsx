import Link from "next/link";
import { getCoinbaseConfigStatus } from "@/lib/coinbase/coinbase-business-client";

export default function AdminPaymentsPage() {
  const coinbase = getCoinbaseConfigStatus();
  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Payments</p>
        <h1 className="mt-2 text-3xl font-semibold">Payment controls</h1>
        <p className="mt-2 text-sm leading-6 text-black/60">
          Manage card checkout, crypto checkout status, token-payment scaffolds, and payment provider readiness without exposing secrets.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/payments/crypto" className="rounded-lg border border-black/10 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Coinbase crypto checkout</h2>
            <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
              {coinbase.enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-black/60">
            View Coinbase checkout sessions, webhook status, and configuration readiness.
          </p>
        </Link>
        <Link href="/admin/payments/token" className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="text-xl font-semibold">Token payment review</h2>
          <p className="mt-3 text-sm leading-6 text-black/60">
            Manual token verification scaffolding for future utility-token checkout policies.
          </p>
        </Link>
      </div>
    </main>
  );
}
