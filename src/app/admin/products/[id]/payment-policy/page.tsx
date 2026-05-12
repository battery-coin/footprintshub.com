import { AdminShell } from "@/components/admin/admin-shell";
import { getActiveGlobalPaymentPolicy, listTokenAssets } from "@/lib/payments/payment-policy";
import { MixedPaymentPolicyEditor } from "@/components/admin/mixed-payment-policy-editor";

export default async function ProductPaymentPolicyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [policy, tokenAssets] = await Promise.all([getActiveGlobalPaymentPolicy(), listTokenAssets()]);

  return (
    <AdminShell requiredPermission="canManagePricing">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">Product payment policy</p>
        <h1 className="mt-3 text-4xl font-semibold">Payment policy override</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/60">
          Product `{id}` can use the global policy now. Product-specific persistence is scaffolded for the next pass.
        </p>
        <div className="mt-8">
          <MixedPaymentPolicyEditor policy={policy} tokenAssets={tokenAssets} />
        </div>
      </div>
    </AdminShell>
  );
}
