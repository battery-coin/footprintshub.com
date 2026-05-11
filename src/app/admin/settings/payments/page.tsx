import { AdminShell } from "@/components/admin/admin-shell";
import { SetupPanel } from "@/components/ui/setup-panel";

export default function AdminPaymentSettingsPage() {
  return (
    <AdminShell requiredPermission="canViewFunds">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Payments</p>
        <h1 className="mt-3 text-4xl font-semibold">Payment settings</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/60">
          Stripe Checkout is the first production payment provider. Coinbase crypto checkout remains disabled unless explicitly configured.
        </p>
        <div className="mt-8">
          <SetupPanel
            title="Provider readiness"
            description="Server secrets must stay out of the browser. Public publishable keys are safe only when they use the NEXT_PUBLIC prefix intentionally."
            items={[
              { label: "STRIPE_SECRET_KEY", complete: Boolean(process.env.STRIPE_SECRET_KEY), detail: "Creates Stripe Checkout Sessions on the server." },
              { label: "STRIPE_WEBHOOK_SECRET", complete: Boolean(process.env.STRIPE_WEBHOOK_SECRET), detail: "Verifies paid, refund, and failed-payment webhooks." },
              { label: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", complete: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY), detail: "Optional public key for future client-side Stripe elements." },
              { label: "NEXT_PUBLIC_ENABLE_CRYPTO_CHECKOUT", complete: process.env.NEXT_PUBLIC_ENABLE_CRYPTO_CHECKOUT === "true", detail: "Keep false until Coinbase checkout is intentionally implemented and reviewed." },
            ]}
          />
        </div>
      </div>
    </AdminShell>
  );
}


