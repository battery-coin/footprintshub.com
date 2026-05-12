import { AdminShell } from "@/components/admin/admin-shell";
import { MixedPaymentPolicyEditor } from "@/components/admin/mixed-payment-policy-editor";
import { getActiveGlobalPaymentPolicy, listTokenAssets } from "@/lib/payments/payment-policy";

export default async function MixedPaymentSettingsPage() {
  const [policy, tokenAssets] = await Promise.all([getActiveGlobalPaymentPolicy(), listTokenAssets()]);

  return (
    <AdminShell requiredPermission="canManageFunds">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Payments</p>
        <h1 className="mt-3 text-4xl font-semibold">Mixed payment ratios</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/60">
          Configure USD and utility token payment portions for checkout composition. Battery Coin is treated only as a utility/payment access option.
        </p>
        <div className="mt-8">
          <MixedPaymentPolicyEditor policy={policy} tokenAssets={tokenAssets} />
        </div>
      </div>
    </AdminShell>
  );
}
